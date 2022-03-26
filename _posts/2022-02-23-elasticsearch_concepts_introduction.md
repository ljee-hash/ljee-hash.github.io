---
layout:     post
title:      "Elasticsearch概念介绍"
subtitle:   "搜索引擎"
date:       2022-02-23 12:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch概念介绍

- ES核⼼概念的介绍
- RESTful格的介绍



## 一、ES核⼼概念的介绍

* 前⾔：
    * 我们在学习elastic search的核⼼概念之前，回顾下我们使⽤传统数据库查询数据的时候应该怎么做的？假设我们⽤使⽤mysql数据库存储⼀些数据，我们的操作步骤是怎样的？
        * 建⽴数据库->建表->插⼊数据->查询

* 索引(index)
    * ⼀个索引可以理解成⼀个关系型数据库

* 类型(type)
    * ⼀种type就像⼀类表，⽐如user表，order表。
    * 注意：
        * ES 5.x中⼀个index可以有多种type。
        * ES 6.x中⼀个index只能有⼀种type。
        * ES 7.x以后已经移除type这个概念。

* 映射(mapping)
    * mapping定义了每个字段的类型等信息。相当于关系型数据库中的表结构。

* ⽂档(document)
    * ⼀个document相当于关系型数据库中的⼀⾏记录。
* 字段(fifield)
    * 相当于关系型数据库表的字段
* 集群(cluster)
    * 集群由⼀个或多个节点组成，⼀个集群有⼀个默认名称"elasticsearch"。
* 节点(node)
    * 集群的节点，⼀台机器或者⼀个进程
* 分⽚和副本(shard)
    * 副本是分⽚的副本。分⽚有主分⽚(primary Shard)和副本分⽚(replica Shard)之分。
    * ⼀个Index数据在物理上被分布在多个主分⽚中，每个主分⽚只存放部分数据。
    * 每个主分⽚可以有多个副本，叫副本分⽚，是主分⽚的复制。

## [](https://wylong.top/Elasticsearch/03-Elasticsearch%E6%A6%82%E5%BF%B5%E4%BB%8B%E7%BB%8D.html#%E4%BA%8C%E3%80%81restful%E6%A0%BC%E7%9A%84%E4%BB%8B%E7%BB%8D)二、RESTful格的介绍

* 介绍
    * RESTful是⼀种架构的规范与约束、原则，符合这种规范的架构就是RESTful架构。
    * 先看REST是什么意思，英⽂Representatinal state transfer 表述性状态转移，其实就是对
    * 资源的表述性状态转移，即通过HTTP动词来实现资源的状态扭转:资源是REST系统的核⼼概念。 所有的设计都是以资源为中⼼
    * elasticsearch使⽤RESTful⻛格api来设计的

* ⽅法

    | action | 描述                     |
    | ------ | ------------------------ |
    | HEAD   | 只获取某个资源的头部信息 |
    | GET    | 获取资源                 |
    | POST   | 创建或更新资源           |
    | PUT    | 创建或更新资源           |
    | DELETE | 删除资源                 |

    ```
    GET /user:列出所有的⽤户
    POST /user:新建⼀个⽤户
    PUT /user:更新某个指定⽤户的信息
    DELETE /user/ID:删除指定⽤户
    ```

* postman⼯具

* curl⼯具
    * 获取elasticsearch状态

        ```shell
        curl -X GET "http://localhost:9200"
        ```

    * 新增⼀个⽂档

        ```shell
        curl -X PUT "localhost:9200/wyl/_doc/1" -H 'Content-Type:application/json' -d' 
        {
         "user" : "louis",
         "message" : "louis is good"
        }'
        ```
        
    * 删除⼀个⽂档

        ```shell
        curl -X DELETE "localhost:9200/wyl/_doc/1"
        ```


