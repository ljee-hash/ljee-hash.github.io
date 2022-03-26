---
layout:     post
title:      "Elasticsearch的分布式集群"
subtitle:   "搜索引擎"
date:       2022-03-06 10:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch的分布式集群

- 集群的作用
- ES集群的核心概念
- 集群搭建
- 集群索引分片管理
- 集群的健康管理
- 集群规格选型


# 分布式集群

## [](https://wylong.top/Elasticsearch/14-%E5%88%86%E5%B8%83%E5%BC%8F%E9%9B%86%E7%BE%A4.html#%E4%B8%80%E3%80%81%E9%9B%86%E7%BE%A4%E7%9A%84%E4%BD%9C%E7%94%A8)一、集群的作用

* ⾼可⽤
    * ⾼可⽤（High Availability）是分布式系统架构设计中必须考虑的因素之⼀，它通常是指，通过设计减少系统不能提供服务的时间。如果系统每运⾏100个时间单位，会有1个时间单位⽆法提供服务，我们说系统的可⽤性是99%。

* 负载均衡
* 将流量均衡的分布在不同的节点上，每个节点都可以处理⼀部分负载，并且可以在节点之间动态分配负载，以实现平衡。
* ⾼性能
    * 将流量分发到不同机器，充分利⽤多机器多CPU，从串⾏计算到并⾏计算提⾼系统性能。

## [](https://wylong.top/Elasticsearch/14-%E5%88%86%E5%B8%83%E5%BC%8F%E9%9B%86%E7%BE%A4.html#%E4%BA%8C%E3%80%81es%E9%9B%86%E7%BE%A4%E7%9A%84%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5)二、ES集群的核心概念

* Cluster 集群
    * ⼀个 Elasticsearch 集群由⼀个或多个节点（Node）组成，每个集群都有⼀个共同的集群名称作为标识。

* Node节点
    * ⼀个 Elasticsearch 实例即⼀个 Node，⼀台机器可以有多个实例，正常使⽤下每个实例应该会部署在不同的机器上。Elasticsearch 的配置⽂件中可以通过 node.master、node.data 来设置节点类型。
    * node.master：表示节点是否具有成为主节点的资格
        * true代表的是有资格竞选主节点
        * false代表的是没有资格竞选主节点
    * node.data：表示节点是否存储数据

* Node节点组合
    * 主节点+数据节点(master+data)
        * 节点即有成为主节点的资格，⼜存储数据

            ```
            node.master: true
            node.data: true
            ```

    * 数据节点(data)
        * 节点没有成为主节点的资格，不参与选举，只会存储数据

            ```
            node.master: false
            node.data: true
            ```

    * 客户端节点(client)
        * 不会成为主节点，也不会存储数据，主要是针对海量请求的时候可以进⾏负载均衡

            ```
            node.master: false
            node.data: false
            ```

* 分⽚
    * 每个索引有⼀个或多个分⽚，每个分⽚存储不同的数据。分⽚可分为主分⽚（ primaryshard）和复制分⽚（replica shard），复制分⽚是主分⽚的拷⻉。默认每个主分⽚有⼀个复制分⽚，⼀个索引的复制分⽚的数量可以动态地调整，复制分⽚从不与它的主分⽚在同⼀个节点上。

## [](https://wylong.top/Elasticsearch/14-%E5%88%86%E5%B8%83%E5%BC%8F%E9%9B%86%E7%BE%A4.html#%E4%B8%89%E3%80%81es%E9%9B%86%E7%BE%A4%E6%90%AD%E5%BB%BA)三、ES集群搭建

搭建步骤

1.  拷⻉elasticsearch-7.5.2安装包3份，分别命名elasticsearch-7.5.2-a, elasticsearch-7.5.2-b,elasticsearch-7.5.2-c。

2.  分别修改elasticsearch.yml⽂件

3.  分别启动a ,b ,c 三个节点

4.  打开浏览器输⼊：http://localhost:9200/_cat/health?v ,如果返回的node.total是3，代表集

    群搭建成功

* 配置elasticsearch.yml⽂件

    ```yaml
    #集群名称
    cluster.name: my-application

    #节点名称
    node.name: node-1 #是不是有资格主节点
    node.master: true

    #是否存储数据
    node.data: true

    #最⼤集群节点数
    node.max_local_storage_nodes: 3 

    #⽹关地址
    network.host: 0.0.0.0

    #端⼝
    http.port: 9200

    #内部节点之间沟通端⼝
    transport.tcp.port: 9300

    #es7.x 之后新增的配置，写⼊候选主节点的设备地址，在开启服务后可以被选为主节点
    discovery.seed_hosts: ["localhost:9300","localhost:9400","localhost:9500"]

    #es7.x 之后新增的配置，初始化⼀个新的集群时需要此配置来选举master
    cluster.initial_master_nodes: ["node-1", "node-2","node-3"] 

    #数据和存储路径
    path.data: /Users/louis.chen/Documents/study/search/storage/a/data
    path.logs: /Users/louis.chen/Documents/study/search/storage/a/logs
    ```

* kibana
    * 打开配置 kibana.yml，添加elasticsearch.hosts: ["[http://localhost:9200","http://localhost:9201","http://localhost:9202](http://localhost:9200%22%2C%22http//localhost:9201%22,%22http://localhost:9202)"]

    * 启动kibana，可以看到集群信息

## [](https://wylong.top/Elasticsearch/14-%E5%88%86%E5%B8%83%E5%BC%8F%E9%9B%86%E7%BE%A4.html#%E5%9B%9B%E3%80%81es%E9%9B%86%E7%BE%A4%E7%B4%A2%E5%BC%95%E5%88%86%E7%89%87%E7%AE%A1%E7%90%86)四、ES集群索引分片管理

* 介绍
    * 分⽚(shard):因为ES是个分布式的搜索引擎, 所以索引通常都会分解成不同部分, ⽽这些分布在不同节点的数据就是分⽚. ES⾃动管理和组织分⽚, 并在必要的时候对分⽚数据进⾏再平衡分配, 所以⽤户基本上不⽤担⼼分⽚的处理细节。

    * 副本(replica):ES默认为⼀个索引创建1个主分⽚, 并分别为其创建⼀个副本分⽚. 也就是说每个索引都由1个主分⽚成本, ⽽每个主分⽚都相应的有⼀个copy

    * Elastic search7.x之后，如果不指定索引分⽚，默认会创建1个主分⽚和⼀个副分⽚，⽽7.x版本之前的⽐如6.x版本，默认是5个主分⽚

* 创建索引(不指定分⽚数量)

    ```json
    PUT nba
    {"mappings":{"properties":{"birthDay":{"type":"date"},"birthDayStr": {"type":"keyword"},"age":{"type":"integer"},"code": {"type":"text"},"country":{"type":"text"},"countryEn": {"type":"text"},"displayAffiliation":{"type":"text"},"displayName": {"type":"text"},"displayNameEn":{"type":"text"},"draft": {"type":"long"},"heightValue":{"type":"float"},"jerseyNo": {"type":"text"},"playYear":{"type":"long"},"playerId": {"type":"keyword"},"position":{"type":"text"},"schoolType": {"type":"text"},"teamCity":{"type":"text"},"teamCityEn": {"type":"text"},"teamConference":{"type":"keyword"},"teamConferenceEn": {"type":"keyword"},"teamName":{"type":"keyword"},"teamNameEn": {"type":"keyword"},"weight":{"type":"text"}}}}
    ```

* 创建索引(指定分⽚数量)
    * settings

    * 创建索引

        ```json
        PUT nba
        {"settings":{"number_of_shards":3,"number_of_replicas":1},"mappings": {"properties":{"birthDay":{"type":"date"},"birthDayStr": {"type":"keyword"},"age":{"type":"integer"},"code": {"type":"text"},"country":{"type":"text"},"countryEn": {"type":"text"},"displayAffiliation":{"type":"text"},"displayName": {"type":"text"},"displayNameEn":{"type":"text"},"draft": {"type":"long"},"heightValue":{"type":"float"},"jerseyNo": {"type":"text"},"playYear":{"type":"long"},"playerId": {"type":"keyword"},"position":{"type":"text"},"schoolType": {"type":"text"},"teamCity":{"type":"text"},"teamCityEn": {"type":"text"},"teamConference": {"type":"keyword"},"teamConferenceEn":{"type":"keyword"},"teamName": {"type":"keyword"},"teamNameEn":{"type":"keyword"},"weight": {"type":"text"}}}}
        ```

* 索引分⽚分配
    * 分⽚分配到哪个节点是由ES⾃动管理的，如果某个节点挂了，那分⽚⼜会重新分配到别的节点上。

    * 在单机中，节点没有副分⽚，因为只有⼀个节点没必要⽣成副分⽚，⼀个节点挂点，副分⽚也会挂掉，完全是单故障，没有存在的意义。

    * 在集群中，同个分⽚它的主分⽚不会和它的副分⽚在同⼀个节点上，因为主分⽚和副分⽚在

    * 同个节点，节点挂了，副分⽚和主分机⼀样是挂了，不要把所有的鸡蛋都放在同个篮⼦⾥。

    * 可以⼿动移动分⽚，⽐如把某个分⽚移动从节点1移动到节点2。

    * 创建索引时指定的主分⽚数以后是⽆法修改的，所以主分⽚数的数量要根据项⽬决定，如果

        真的要增加主分⽚只能重建索引了。副分⽚数以后是可以修改的。

* ⼿动移动分⽚

    ```json
    POST /_cluster/reroute
    {
        "commands": [
            {
                "move": {
                    "index": "nba",
                    "shard": 2,
                    "from_node": "node-1",
                    "to_node": "node-3"
                }
            }
        ]
    }
    ```

* 修改副分⽚数量

    ```json
    PUT /nba/_settings
    {
        "number_of_replicas": 2
    }
    ```

## [](https://wylong.top/Elasticsearch/14-%E5%88%86%E5%B8%83%E5%BC%8F%E9%9B%86%E7%BE%A4.html#%E4%BA%94%E3%80%81es%E9%9B%86%E7%BE%A4%E7%9A%84%E5%81%A5%E5%BA%B7%E7%AE%A1%E7%90%86)五、ES集群的健康管理

**查看es集群健康的⼏种⽅式**

* 查看集群的健康状态
    * http://127.0.0.1:9200/_cat/health?v

    * 返回信息

        ![](https://wylong.top/Elasticsearch/images/14-%E9%9B%86%E7%BE%A4%E5%81%A5%E5%BA%B7%E4%BF%A1%E6%81%AF1.png)

        ```
        status ：集群的状态
            - red红表示集群不可⽤，有故障。
            - yellow⻩表示集群不可靠但可⽤，⼀般单节点时就是此状态。
            - green正常状态，表示集群⼀切正常。

        node.total ：节点数，这⾥是3，表示该集群有三个节点。

        node.data ：数据节点数，存储数据的节点数，这⾥是3。

        shards ：表示我们把数据分成多少块存储。

        pri ：主分⽚数，primary shards

        active_shards_percent ：激活的分⽚百分⽐，这⾥可以理解为加载的数据分⽚数
            只有加载所有的分⽚数，集群才算正常启动
            在启动的过程中，如果我们不断刷新这个⻚⾯，我们会发现这个百分⽐会不断加⼤。
        ```

* 查看集群的索引数
    * http://127.0.0.1:9200/_cat/indices?v

    * URL返回了集群中的所有索引信息，我们可以看到所有索引的健康情况和具体信息

    * 返回信息

        ![](https://wylong.top/Elasticsearch/images/14-%E9%9B%86%E7%BE%A4%E7%B4%A2%E5%BC%95%E4%BF%A1%E6%81%AF.png)

        ```
        health ： 索引健康,与集群健康状态⼀致。
            - green为正常
            - yellow表示索引不可靠（单节点）
            - red索引不可⽤。

        status ： 状态表明索引是否打开，只索引是可以关闭的。
        index ： 索引的名称
        uuid ： 索引内部分配的名称，索引的唯⼀表示
        pri ： 集群的主分⽚数量
        docs.count ： 这⾥统计了⽂档的数量。
        docs.deleted ： 这⾥统计了被删除⽂档的数量。
        store.size ： 索引的存储的总容量
        pri.store.size ： 主分别的容量
        ```

* 查看磁盘的分配情况
    * http://127.0.0.1:9200/_cat/allocation?v

    * URL返回了每个节点的磁盘情况。

    * 返回信息

        ![](https://wylong.top/Elasticsearch/images/14-%E9%9B%86%E7%BE%A4%E7%A3%81%E7%9B%98%E4%BF%A1%E6%81%AF.png)

        ```
        shards ： 该节点的分⽚数量
        disk.indices ： 该节点中所有索引在该磁盘所点的空间。
        disk.used ： 该节点已经使⽤的磁盘容量
        disk.avail ： 该节点可以使⽤的磁盘容量
        disk.total ： 该节点的磁盘容量
        ```

* 查看集群的节点信息
    * http://127.0.0.1:9200/_cat/nodes?v

    * URL返回了集群中各节点的情况。

    * 返回信息

        ![](https://wylong.top/Elasticsearch/images/14-%E9%9B%86%E7%BE%A4%E8%8A%82%E7%82%B9%E4%BF%A1%E6%81%AF.png)

        ```
        ip ： ip地址
        heap.percent ： 堆内存使⽤情况
        ram.percent ： 运⾏内存使⽤情况
        cpu ： cpu使⽤情况
        master ： 是否是主节点
        ```

* 查看集群的其他信息
    * http://127.0.0.1:9200/_cat

        ![](https://wylong.top/Elasticsearch/images/14-%E9%9B%86%E7%BE%A4%E5%85%B6%E5%AE%83%E4%BF%A1%E6%81%AF.png)


## 集群规格选型

### 集群规格评估
> 集群规格评估，Elasticsearch的单机规格在一定程度上限制了集群的能力，根据使用经验给出如下建议：
- **集群最大节点数** ：集群最小节点数 ~ 集群最大节点数 = 单节点CPU * 1 ~ 单节点CPU * 2。
- **单节点最大数据量**:使用场景不同，单节点最大承载数据量也会不同，具体如下：

1. 数据加速、查询聚合等场景：单节点磁盘最大容量 = 单节点内存大小（GB）* 5。
2. 日志写入、离线分析等场景：单节点磁盘最大容量 = 单节点内存大小（GB）* 25。
3. 通常情况：单节点磁盘最大容量 = 单节点内存大小（GB）* 15。

集群规格参考列表如下
<table>
<thead>
<tr>
<th>规格</th>
<th>最小节点数~最大节点数</th>
<th>单节点磁盘最大容量（查询）</th>
<th>单节点磁盘最大容量（日志）</th>
<th>单节点磁盘最大容量（通常）</th>
</tr>
</thead>
<tbody><tr>
<td>4核8G</td>
<td>4~8</td>
<td>40 GB</td>
<td>200 GB</td>
<td>120 GB</td>
</tr>
</tbody></table>

### 集群节点选型参考

基于集群每秒查询次数QPS、每秒写入次数TPS做出如下选型参考，数据节点规格确定后可根据预估数据量选择增减数据节点硬盘规格或数量，或直接选择容量型云盘（性能有一定下降）。

若业务存在大量聚合等较复杂查询场景，建议适当增加网关节点与数据节点数量或规格，主节点数量没有特殊要求默认3个即可。


### 规格映射参考

1、网关节点规格参考

2、 主节点规格参考

3、 数据节点节点推荐规格

4、网关节点推荐规格

5、主节点推荐规格


### 适用磁盘类型

适用于存储类型为SSD的Elasticsearch实例。


### 磁盘容量评估

影响Elasticsearch集群磁盘空间大小的因素包括：

* 副本数量：至少`1`个副本。
* 索引开销：通常比源数据大`10%`（_all参数等未计算）。
* 操作系统预留：默认操作系统会保留`5%`的文件系统供您处理关键流程、系统恢复以及磁盘碎片等。
* Elasticsearch内部开销：段合并、日志等内部操作，预留`20%`。
* 安全阈值：通常至少预留`15%`的安全阈值。


根据以上因素得到：`最小磁盘总大小` = `源数据大小` \* `3.4`。计算方式如下。

`磁盘总大小` = `源数据 *（1 + 副本数量）* 索引开销 /（1 - Linux预留空间）/（1 - Elasticsearch开销）/（1 - 安全阈值）`

= `源数据 *（1 + 副本数量）* 1.7`

= `源数据 * 3.4`


**说明**

对于_all这项参数，如果不需要在业务上使用，通常建议您禁止或者有选择性地添加。
如果您需要开启_all参数的索引，磁盘容量的开销也会随之增大。根据测试结果和使用经验，建议在上述评估的基础上，增加空间至原来的`1.5`倍，即：`磁盘总大小` = `源数据 *（1 + 副本数）* 1.7 *（1 + 0.5）= 源数据 * 5.1`。


## Shard评估

Shard大小和数量是影响Elasticsearch集群稳定性和性能的重要因素之一。Elasticsearch集群中任何一个索引都需要有一个合理的shard规划。合理的shard规划能够防止因业务不明确，导致分片庞大消耗Elasticsearch本身性能的问题。

**说明**

Elasticsearch 7.x以下版本的索引默认包含`5`个主shard，`1`个副shard；Elasticsearch 7.x及以上版本的索引默认包含`1`个主shard，`1`个副shard。


在进行shard规划前，请先考虑以下几个问题：

* 当前单个索引的数据多大
* 数据是否会持续增长
* 购买的实例规格多大
* 是否会定期删除或者合并临时索引


基于以上问题，下文对shard规划提供了一些建议。这些建议仅供参考，实际业务中还需根据需求进行调整：

* 建议在分配shard前，对Elasticsearch进行数据测试。当数据量很大时，要减少写入量的大小，降低Elasticsearch压力，建议选择多主1副本；当数据量较小，且写入量也比较小时，建议使用单主多副本或者单主1副本。

* 建议一个shard的存储量保持在30GB以内（最优），特殊情况下，可以提升到`50GB`以内。如果评估结果超过该容量，建议在创建索引之前，合理进行shard分配，后期进行reindex，虽然能保证不停机，但是比较耗时。

    **说明** 对于评估数据量低于`30GB`的业务，也可以使用1主多备的策略进行负载均衡。例如20GB的单索引，在5个数据节点中，可以考虑1主4副本的shard规划。

* 对于日志分析或者超大索引场景，建议单个shard大小不要超过`100GB`。

* 建议shard的个数（包括副本）要尽可能等于数据节点数，或者是数据节点数的整数倍。

    **说明** 主分片不是越多越好，因为主分片越多，Elasticsearch性能开销也会越大。

* 建议单个节点上同一索引的shard个数不要超`5`个。

* 建议按照以下说明，评估单个节点上全部索引的shard数量：
    * `单个数据节点的shard数量` = `当前节点的内存大小` \* `30`（小规格实例参考）
    * `单个数据节点的shard数量` = `当前节点的内存大小` \* `50`（大规格实例参考）

    **注意**
    在评估shard数量时，还需结合数据量进行分析，建议TB级别以下的数据量参考小规格实例进行评估。  
    在单节点上，7.x版本的实例默认的shard的上限为`1000`个（官方不建议调整），建议在使用前通过扩容节点来调整单节点的shard数量。

* 建议按照`1:5`的比例添加独立的协调节点（2个起），CPU:Memory为`1:4`或`1:8`。例如`10`个`8`核`32GB`的数据节点，建议配置`2`个`8`核`32G`的独立协调节点。

    **说明** 使用独立的协调节点，可以对最终的结果进行reduce操作，这样即使reduce阶段出现GC严重的现象，也不会影响数据节点。

* 使用模版，建议开启"定时(创建&删除)索引"，使用定时任务对索引进行创建、删除，或者通过Elasticsearch API创建、删除此类索引。

* 建议及时清理小索引（同样会占用Elasticsearch堆内存）。






