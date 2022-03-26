---
layout:     post
title:      "Elasticsearch的快速安装"
subtitle:   "搜索引擎"
date:       2022-02-23 10:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch的快速安装

- 集群规格选型
- 快速安装



## 集群规格选型

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

## 快速安装

### 1. 打开官⽹链接 https://www.elastic.co/guide/en/elastic-stack/7.2/index.html

### 2. 选择要下载的版本
![选择下载版本](https://wylong.top/Elasticsearch/images/02-%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD.png)

* 点击 installing the Elastic Stack
![安装Stack](https://wylong.top/Elasticsearch/images/02-%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD02.png)

* 选择第1个选项，install instructions，下载elasticsearch

![](https://wylong.top/Elasticsearch/images/02-%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD03.png)

### 3. 选择操作系统

- ****mac***

下载软件，安装

- ***linux***

```bash
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.2.0-linux-x86_64.tar.gz
```
- ***Windows***

> 使⽤windows不仅要注意jdk的版本和es的版本，还要注意操作系统的版本是否兼容

* 强烈建议最好可以使⽤⼀个阿⾥云服务器，再不⾏退⽽求其次使⽤虚拟机安装⼀个Linux，⽼师不是很建议使⽤windows来学elasticsearch的，因为很多坑，特别是7以上的es。

### 4. 启动

> 我们的elasticsearch是强依赖于我们的jdk环境，所以⼀定要安装对应的jdk，并且配置好相关的环境变量，⽐如es7.x版本要装jdk8以上的版本，⽽且要是官⽅来源的jdk。启动的时候有可能会提示要装jdk11，因为es7以上官⽅都是建议使⽤jdk11，但是⼀般只是提示信息，不影响启动。

[官⽅链接](https://www.elastic.co/cn/support/matrix)：[这⾥可以看到每个操作系统，每个版本需要的JDK版本](https://www.elastic.co/cn/support/matrix%EF%BC%8C%E8%BF%99%E2%BE%A5%E5%8F%AF%E4%BB%A5%E7%9C%8B%E5%88%B0%E6%AF%8F%E4%B8%AA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%EF%BC%8C%E6%AF%8F%E4%B8%AA%E7%89%88%E6%9C%AC%E9%9C%80%E8%A6%81%E7%9A%84JDK%E7%89%88%E6%9C%AC)

![示范](https://wylong.top/Elasticsearch/images/02-%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD04.png)

> es强依赖jvm，也很吃内存，所以⼀定要保证你的机器⾄少空闲出2G以上内存。所以建议能不⽤虚拟机就不⽤虚拟机，能⽤Linux服务器就⼀定⽤linux服务器。

> 启动⼀定要使⽤⾮root账户！！！这是es强制规定的。 Elasticsearch为了安全考虑，不让使⽤root启动，解决⽅法是新建⼀个⽤户，⽤此⽤户进⾏相关的操作。如果你⽤root启动，会报错。如果是使⽤root账号安装es的，⾸先给安装包授权，⽐如chown -R 777 '安装包路径'，然后再使⽤⾮root账号启动，具体的权限配置，可以根据⾃⼰想要的来配置。

1. mac/linux，打开软件的安装路径，进⼊到bin⽬录，执⾏sh elasticsearch.sh,守护进程的⽅式可以使⽤ 

        `sh elasticsearch.sh -d -p pid`

2. windows，打开软件的安装路径，进⼊到bin⽬录，双击elasticsearch.bat

### 5. 验证
 
1. 打开浏览器输⼊ `localhost:9200`

## [](https://wylong.top/Elasticsearch/02-Elasticsearch%E7%9A%84%E5%BF%AB%E9%80%9F%E5%AE%89%E8%A3%85.html#docker%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85elasticsearch)


## Docker方式安装ElasticSearch

### 1. 创建网络

```bash
docker network create --subnet=172.18.0.0/16 mynetwork
```

### 2. 拉取镜像

```shell
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.5.2
``

### 3. 创建目录

    ```shell
    mkdir -p /root/docker/elasticSearch/{config,data,plugins,logs}
    ```__

### 4.创建配置文件

```shell
cd /root/docker/elasticSearch/config
touch elasticsearch.yml
```

**添加如下内容**

```yaml
cluster.name: "docker-cluster"
network.host: 0.0.0.0

#开启跨域访问
http.cors.enabled: true
http.cors.allow-origin: "*"
# 单机模式
discovery.type: "single-node"
xpack.security.enabled: true
```

### 5.文件夹赋权限

 > 否则启动报错:AccessDeniedException[/usr/share/elasticsearch/data/nodes]

```shell
chmod -R 777 /root/docker/elasticSearch
```

### 6. 启动容器

```shell
docker run -d --name es --network mynetwork --ip 172.18.0.8 \
-p 9200:9200 -p 9300:9300 \
-v /root/docker/elasticSearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /root/docker/elasticSearch/data:/usr/share/elasticsearch/data \
-v /root/docker/elasticSearch/plugins:/usr/share/elasticsearch/plugins \
-v /root/docker/elasticSearch/logs:/usr/share/elasticsearch/logs \
929d271f1798
```

> 可以限制内存使用大小，默认2g

```bash
> -e ES_JAVA_OPTS="-Xms512m -Xmx512m"
```


### 7.设置密码

```shell
# 1.进入es容器
docker exec -it es bash
cd /usr/share/elasticsearch/
# 2.设置密码
bin/elasticsearch-setup-passwords interactive
# 密码进入容器设置为 123456
```

> 总共修改了6个用户的密码：elastic、kibana、apm_system、logstash_system、beats_system、remote_monitoring_user。


### 8.访问es

```
http://IP地址:9200/
```

![](https://wylong.top/Elasticsearch/images/03-es%E7%99%BB%E5%BD%9501.png)

![](https://wylong.top/Elasticsearch/images/03-es%E7%99%BB%E5%BD%95.png)

## [](https://wylong.top/Elasticsearch/02-Elasticsearch%E7%9A%84%E5%BF%AB%E9%80%9F%E5%AE%89%E8%A3%85.html#docker%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85kibana)

## Docker方式安装kibana

### 1. 拉取镜像

```shell
docker pull docker.io/kibana:7.5.2
```

### 2. 创建目录

```shell
mkdir -p /root/docker/kibana/config
```

### 3. 创建配置文件

```shell
cd /root/docker/kibana/config
touch kibana.yml
```

添加如下内容

```yaml
server.name: kibana
server.host: "0"
elasticsearch.hosts: [ "http://172.18.0.8:9200" ]
xpack.monitoring.ui.container.elasticsearch.enabled: true
elasticsearch.username: "kibana"
elasticsearch.password: "123456"
```

### 4. 启动容器

```shell
docker run -d  --name kibana --network mynetwork --ip 172.18.0.9 \
-p 5601:5601 \
-v /root/docker/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml \
a6e894c36481
```

### 5.访问Kibana

```
http://IP地址:5601/
```
    ![](https://wylong.top/Elasticsearch/images/03-kibana%E7%99%BB%E5%BD%9501.png)

![](https://wylong.top/Elasticsearch/images/03-kibana%E7%99%BB%E5%BD%9502.png)

 [](https://wylong.top/Elasticsearch/02-Elasticsearch%E7%9A%84%E5%BF%AB%E9%80%9F%E5%AE%89%E8%A3%85.html#elasticsearch%E2%BD%AC%E5%BD%95%E7%BB%93%E6%9E%84%E4%BB%8B%E7%BB%8D)

## Elasticsearch⽬录结构介绍

### 1.目录结构

    ![](https://wylong.top/Elasticsearch/images/03-es%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84.png)
结构如下

| 目录 | 描述 | 
| ------- | ------------------------------------------------------------ | 
| bin | ⼆进制脚本包含启动节点的elasticsearch | 
| config | 配置⽂件包含elasticsearch.yml | 
| data | 在节点上申请的每个index/shard的数据⽂件的位置。可容纳多个位置 | 
| logs | ⽇志⽂件位置 | 
| plugins | 插件⽂件位置。每个插件将包含在⼀个⼦⽬录中。 |


