---
layout:     post
title:      "Elasticsearch应用集成"
subtitle:   "搜索引擎"
date:       2022-03-05 10:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch应用集成

- Springboot集成ES
- HighLevelClient直接使用


## Springboot集成ES

> 完整项目见git地址：https://gitee.com/wyloong/elasticsearch-demo.git

## [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E6%B7%BB%E5%8A%A0%E4%BE%9D%E8%B5%96)添加依赖

版本需要和es版本一直，否则可能有坑

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.5.2</version>
</dependency>
<dependency>
    <groupId>org.elasticsearch</groupId>
    <artifactId>elasticsearch</artifactId>
    <version>7.5.2</version>
</dependency>
```

## [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#applicationyml%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE%E4%BF%A1%E6%81%AF)application.yml添加配置信息

```yaml
spring:
# 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/nba?useUnicode=true&characterEncoding=utf-8&useSSL=false
    username: root
    password: root

# es配置信息
elasticsearch:
  host: 8.131.66.135
  port: 9200
  user: elastic
  pwd: 123456
```

## [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E9%85%8D%E7%BD%AEes)配置ES

配置es基本信息

* RestHighLevelClient - 高级api
* BulkProcessor - bulk批量操作

```java
@Data
@Configuration
@ConfigurationProperties(prefix = "elasticsearch")
public class EsConfig {

    private String host;
    private Integer port;
    private String user;
    private String pwd;

    @Bean(destroyMethod = "close")
    public RestHighLevelClient client() {

        HttpHost httpHost = new HttpHost(host, port, "http");

        final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(user, pwd));

        RestClientBuilder builder = RestClient.builder(httpHost).setRequestConfigCallback(requestConfigBuilder -> {
            requestConfigBuilder.setConnectTimeout(-1);
            requestConfigBuilder.setSocketTimeout(-1);
            requestConfigBuilder.setConnectionRequestTimeout(-1);
            return requestConfigBuilder;
        }).setHttpClientConfigCallback(httpClientBuilder -> {
            httpClientBuilder.disableAuthCaching();
            return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
        });

        RestHighLevelClient client = new RestHighLevelClient(builder);
        return client;

    }

    @Bean
    public BulkProcessor bulkProcessor() {
        BulkProcessor.Listener listener = new BulkProcessor.Listener() {
            //beforeBulk会在批量提交之前执行
            @Override
            public void beforeBulk(long executionId, BulkRequest request) {
//                System.out.println("调用procss bulk 之前" + executionId +" items info:" + executionId);
            }

            //第一个afterBulk会在批量成功后执行，可以跟beforeBulk配合计算批量所需时间
            @Override
            public void afterBulk(long executionId, BulkRequest request, Throwable failure) {
                failure.printStackTrace();
                List<DocWriteRequest<?>> list = request.requests();
            }

            //第二个afterBulk会在批量失败后执行
            @Override
            public void afterBulk(long executionId, BulkRequest request, BulkResponse response) {
//                System.out.println("调用procss bulk 之后" + executionId +" items info:" + response.getItems());
            }
        };

        BulkProcessor bulkProcessor = BulkProcessor.builder(
                (request, bulkListener) -> (client()).bulkAsync(request, RequestOptions.DEFAULT, bulkListener),
                listener)
                // 每添加500个request，执行一次bulk操作
                .setBulkActions(500)
                // 每达到1M 执行一次
                .setBulkSize(new ByteSizeValue(1, ByteSizeUnit.MB))
                // 每1s执行一次bulk操作
                .setFlushInterval(TimeValue.timeValueSeconds(1))
                // 0代表同步提交即只能提交一个request 10代表当有一个新的bulk正在累积时，10个并发请求可被允许执行
                .setConcurrentRequests(10)
                // 设置当出现代表ES集群拥有很少的可用资源来处理request时抛出
                // EsRejectedExecutionException造成N个bulk内request失败时
                // 进行重试的策略,初始等待100ms，后面指数级增加，总共重试3次.
                // 不重试设为BackoffPolicy.noBackoff()
                .setBackoffPolicy(BackoffPolicy.exponentialBackoff(TimeValue.timeValueMillis(1), 3)).build();
        return bulkProcessor;
    }

}
```

## [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E7%BC%96%E5%86%99%E5%A2%9E%E5%88%A0%E6%94%B9%E6%9F%A5)编写增删改查

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E5%AE%9A%E4%B9%89%E5%9F%BA%E6%9C%AC%E5%8F%98%E9%87%8F%E5%B1%9E%E6%80%A7)定义基本变量属性

```java
// 操作es高级api
@Resource
private RestHighLevelClient client;

// 批量操作的对象
@Resource
private BulkProcessor bulkProcessor;

// 操作数据库dao
@Resource
private NBAPlayerDao nbaPlayerDao;

// 索引
private static final String NBA_INDEX = "nba";
// 查询数据起始值
private static final int START_OFFSET = 0;
// 查询数量
private static final int MAX_COUNT = 1000;
```

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E6%B7%BB%E5%8A%A0)添加

```java
/**
* 添加球员
*
* @param player
* @param id
* @return
* @throws IOException
*/
@Override
public boolean addPlayer(NBAPlayer player, String id) throws IOException {
    IndexRequest request = new IndexRequest(NBA_INDEX).id(id).source(beanToMap(player));
    IndexResponse response = client.index(request, RequestOptions.DEFAULT);
    System.out.println(JSONObject.toJSON(response));
    return false;
}
```

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E6%A0%B9%E6%8D%AEid%E8%8E%B7%E5%BE%97)根据ID获得

```java
/**
* 获得球员
*
* @param id
* @return
* @throws IOException
*/
@Override
public Map<String, Object> getPlayer(String id) throws IOException {
    GetRequest getRequest = new GetRequest(NBA_INDEX, id);
    GetResponse response = client.get(getRequest, RequestOptions.DEFAULT);
    return response.getSource();
}
```

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E6%9B%B4%E6%96%B0)更新

```java
/**
* 更新球员
*
* @param player
* @param id
* @return
* @throws IOException
*/
@Override
public boolean updatePlayer(NBAPlayer player, String id) throws IOException {
    UpdateRequest request = new UpdateRequest(NBA_INDEX, id).doc(beanToMap(player));
    UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
    System.out.println(JSONObject.toJSON(response));
    return true;
}
```

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E6%A0%B9%E6%8D%AEid%E5%88%A0%E9%99%A4%E4%B8%80%E4%B8%AA)根据id删除一个

```java
/**
* 删除球员 - 根据id删除一个
*
* @param id
* @return
* @throws IOException
*/
@Override
public boolean deletePlayer(String id) throws IOException {
    DeleteRequest request = new DeleteRequest(NBA_INDEX, id);
    client.delete(request, RequestOptions.DEFAULT);
    return true;
}
```

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E6%A0%B9%E6%8D%AE%E6%9F%A5%E8%AF%A2%E6%9D%A1%E4%BB%B6%E5%88%A0%E9%99%A4)根据查询条件删除

```java
/**
* 根据查询条件删除
*
* @param key
* @param value
* @return
* @throws IOException
*/
@Override
public boolean deleteByQuery(String key, String value) throws IOException {
    DeleteByQueryRequest deleteByQueryRequest = new DeleteByQueryRequest();
    deleteByQueryRequest.indices(NBA_INDEX);
    deleteByQueryRequest.setQuery(new MatchQueryBuilder(key, value));
    client.deleteByQuery(deleteByQueryRequest, RequestOptions.DEFAULT);
    return true;
}
```

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89)删除所有

```java
/**
* 删除所有球员
*
* @return
* @throws IOException
*/
@Override
public boolean deleteAllPlayer() throws IOException {
    DeleteByQueryRequest request = new DeleteByQueryRequest(NBA_INDEX);
    request.setQuery(QueryBuilders.boolQuery());
    client.deleteByQuery(request, RequestOptions.DEFAULT);

    return true;
}
```

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5)批量导入

```java
/**
* 批量导入所有球员
*
* @return
* @throws IOException
*/
@Override
public boolean importAll() {
    List<IndexRequest> indexRequests = new ArrayList<>();
    List<NBAPlayer> list = nbaPlayerDao.selectAll();
    list.forEach(player -> {
        IndexRequest request = new IndexRequest(NBA_INDEX).id(player.getPlayerId()).source(beanToMap(player));
        indexRequests.add(request);
    });
    indexRequests.forEach(bulkProcessor::add);
    return true;
}
```

### [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E6%90%9C%E7%B4%A2%E5%8C%B9%E9%85%8D%E7%9A%84%E3%80%81term%E6%9F%A5%E8%AF%A2%E3%80%81%E5%89%8D%E7%BC%80%E6%9F%A5%E8%AF%A2)搜索匹配的、term查询、前缀查询

```java
/**
* 搜索匹配的
*
* @param key
* @param value
* @return
* @throws IOException
*/
@Override
public List<NBAPlayer> searchMatch(String key, String value) throws IOException {
    QueryBuilder query = QueryBuilders.matchQuery(key, value);
    return commonSearch(query);
}

/**
* term查询
*
* @param key
* @param value
* @return
* @throws IOException
*/
@Override
public List<NBAPlayer> searchTerm(String key, String value) throws IOException {
    QueryBuilder query = QueryBuilders.termQuery(key, value);
    return commonSearch(query);
}

/**
* 前缀查询
*
* @param key
* @param value
* @return
* @throws IOException
*/
@Override
public List<NBAPlayer> searchMatchPrefix(String key, String value) throws IOException {
    QueryBuilder query = QueryBuilders.prefixQuery(key, value);
    return commonSearch(query);
}

/**
* 封装通用查询
*
* @param query
* @return
* @throws IOException
*/
private List commonSearch(QueryBuilder query) throws IOException {
    SearchRequest searchRequest = new SearchRequest(NBA_INDEX);
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    searchSourceBuilder.query(query);
    searchSourceBuilder.from(START_OFFSET);
    searchSourceBuilder.size(MAX_COUNT);
    searchRequest.source(searchSourceBuilder);
    SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);

    SearchHit[] hits = response.getHits().getHits();
    List<NBAPlayer> playerList = new LinkedList<>();
    for (SearchHit hit : hits) {
        NBAPlayer player = JSONObject.parseObject(hit.getSourceAsString(), NBAPlayer.class);
        playerList.add(player);
    }

    return playerList;
}
```

## [](https://wylong.top/Elasticsearch/13-Springboot%E9%9B%86%E6%88%90ES.html#%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95)单元测试

```java
@SpringBootTest
class ElasticsearchDemoApplicationTests {

    @Resource
    private NBAPlayerDao nbaPlayerDao;

    @Resource
    private NBAPlayerService service;

    @Test
    public void selectAll() {
        List<NBAPlayer> playerList = nbaPlayerDao.selectAll();

        System.out.println(JSON.toJSONString(playerList));
    }

    @Test
    public void addPlayer() throws IOException {
        NBAPlayer player = new NBAPlayer();
        player.setId(999);
        player.setDisplayName("杨超越");
        service.addPlayer(player, "999");
    }

    @Test
    public void getPlayer() throws IOException {
        Map<String, Object> player = service.getPlayer("999");
        System.out.println(JSONObject.toJSON(player));
    }

    @Test
    public void updatePlayer() throws IOException {
        NBAPlayer player = new NBAPlayer();
        player.setId(999);
        player.setDisplayName("杨超越2");
        service.updatePlayer(player, "999");
    }

    @Test
    public void deletePlayer() throws IOException {
        service.deletePlayer("999");
    }

    @Test
    public void deleteByQyery() throws IOException {
        service.deleteByQuery("jerseyNo", "23");
    }

    @Test
    public void deleteAll() throws IOException {
        service.deleteAllPlayer();
    }

    @Test
    public void addAll() throws InterruptedException {
        service.importAll();
        // 延时一会，否则es连接就会断掉，只会插入100的整数倍，剩下的不会自动插入，数据还在buffer缓冲区
        TimeUnit.SECONDS.sleep(12L);
    }

    @Test
    public void searchMatch() throws IOException {
        String key = "displayNameEn";
        String value = "james";
        List resList = service.searchMatch(key, value);

        System.out.println(JSON.toJSONString(resList));
    }

    @Test
    public void searchTerm() throws IOException {
        String key = "jerseyNo";
        String value = "23";
        List resList = service.searchTerm(key, value);

        System.out.println(JSON.toJSONString(resList));
    }

    @Test
    public void searchMatchPrefix() throws IOException {
        String key = "teamNameEn";
        String value = "Rock";
        List resList = service.searchMatchPrefix(key, value);

        System.out.println(JSON.toJSONString(resList));
    }

}
```
