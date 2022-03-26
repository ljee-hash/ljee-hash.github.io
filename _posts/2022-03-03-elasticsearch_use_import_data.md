---
layout:     post
title:      "Elasticsearch数据的导入"
subtitle:   "搜索引擎"
date:       2022-02-23 10:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch数据的导入

- 常见的字段类型
- ES之批量导入数据



## 常见的字段类型

* **数据类型**（字段类型）
    * 核⼼数据类型
    * 复杂数据类型
    * 专⽤数据类型

### [](https://wylong.top/Elasticsearch/09-%E5%B8%B8%E8%A7%81%E7%9A%84%E5%AD%97%E6%AE%B5%E7%B1%BB%E5%9E%8B.html#%E5%88%86%E5%88%AB%E4%BB%8B%E7%BB%8D)分别介绍

* **核⼼数据类型**
    * 字符串
        * text：⽤于全⽂索引，该类型的字段将通过分词器进⾏分词

        * keyword：不分词，只能搜索该字段的完整的值

    * 数值型
        * long, integer, short, byte, double, flfloat, half_flfloat, scaled_flfloat

    * 布尔 - boolean

    * ⼆进制 - binary
        * 该类型的字段把值当做经过 base64 编码的字符串，默认不存储，且不可搜索

    * 范围类型
        * 范围类型表示值是⼀个范围，⽽不是⼀个具体的值

        * integer_range, flfloat_range, long_range, double_range, date_range

        * 譬如 age 的类型是 integer_range，那么值可以是 {"gte" : 20, "lte" : 40}；搜索 "term" :{"age": 21} 可以搜索该值

    * ⽇期 - date
        * 由于Json没有date类型，所以es通过识别字符串是否符合format定义的格式来判断是否为date类型

        * format默认为：strict_date_optional_time||epoch_millis

        * 格式：2022-01-01" "2022/01/01 12:10:30" 这种字符串格式

        * 从开始纪元（1970年1⽉1⽇0点） 开始的毫秒数

        * 从开始纪元开始的秒数

        * PUT localhost:9200/nba/_mapping

            ```json
            {
                "properties": {
                    "name": {
                        "type": "text"
                    },
                    "team_name": {
                        "type": "text"
                    },
                    "position": {
                        "type": "text"
                    },
                    "play_year": {
                        "type": "long"
                    },
                    "jerse_no": {
                        "type": "keyword"
                    },
                    "title": {
                        "type": "text"
                    },
                    "date": {
                        "type": "date"
                    }
                }
            }
            ```

        * POST localhost:9200/nba/_doc/4

            ```json
            {
                  "name": "蔡x坤",
            "team_name": "勇⼠",
                  "position": "得分后卫",
                  "play_year": 10,
                  "jerse_no": "31",
                  "title": "打球最帅的明星",
                  "date": "2020-01-01"
              }
            ```

        * POST localhost:9200/nba/_doc/5

            ```json
            {
                  "name": "杨超越",
              "team_name": "猴急",
                  "position": "得分后卫",
                  "play_year": 10,
                  "jerse_no": "32",
                  "title": "打球最可爱的明星",
                  "date": 1610350870
              }
            ```

* **复杂数据类型**
    * 数组类型 Array
        * ES中没有专⻔的数组类型, 直接使⽤[]定义即可，数组中所有的值必须是同⼀种数据类型, 不⽀持混合数据类型的数组:

        * 字符串数组 [ "one", "two" ]

        * 整数数组 [ 1, 2 ]

        * Object对象数组 [ { "name": "Louis", "age": 18 }, { "name": "Daniel", "age": 17 }]

        * 同⼀个数组只能存同类型的数据，不能混存，譬如 [ 10, "some string" ] 是错误的

    * 对象类型 Object

    * 对象类型可能有内部对象

    * POST localhost:9200/nba/_doc/8

        ```json
        {
              "name": "吴XX",
              "team_name": "湖⼈",
              "position": "得分后卫",
              "play_year": 10,
              "jerse_no": "33",
              "title": "最会说唱的明星",
              "date": "1641886870",
              "array": [
                  "one",
                  "two"
              ],
              "address": {
                  "region": "China",
                  "location": {
                      "province": "GuangDong",
                      "city": "GuangZhou"
                  }
              }
          }
        ```

        * 索引⽅式

            ```
            "address.region": "China",
            "address.location.province": "GuangDong",
            "address.location.city": "GuangZhou"
            ```

        * POST localhost:9200/nba/_search

            ```json
            {
                "query": {
                    "match": {
                        "address.region": "china"
                    }
                }
            }
            ```

* **专用数据类型**
    * IP类型
        * IP类型的字段⽤于存储IPv4或IPv6的地址, 本质上是⼀个⻓整型字段

        * POST localhost:9200/nba/_mapping

            ```json
            {
                "properties": {
                    "name": {
                        "type": "text"
                    },
                    "team_name": {
                        "type": "text"
                    },
                    "position": {
                        "type": "text"
                    },
                    "play_year": {
                        "type": "long"
                    },
                    "jerse_no": {
                        "type": "keyword"
                    },
                    "title": {
                        "type": "text"
                    },
                    "date": {
                        "type": "date"
                    },
                    "ip_addr": {
                        "type": "ip"
                    }
                }
            }
            ```

        * PUT localhost:9200/nba/_doc/9

            ```json
            {
                "name": "吴xx",
                "team_name": "湖⼈",
                "position": "得分后卫",
                "play_year": 10,
                "jerse_no": "33",
                "title": "最会说唱的明星",
                "ip_addr": "192.168.1.1"
            }
            ```

        * POST localhost:9200/nba/_search

            ```json
            {
             "query": {
             "term": {
             "ip_addr": "192.168.0.0/16" // 192.168.0.0~192.168.255.255)
             }
             }
            }
            ```

* 官方文档
    * https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html#complex_datatypes

## ES之批量导入数据

* Bulk

* ES提供了⼀个叫 bulk 的API 来进⾏批量操作

* 批量导⼊
    * 数据

        ```json
        {"index": {"_index": "book", "_type": "_doc", "_id": 1}}
        {"name": "权⼒的游戏"} 
        {"index": {"_index": "book", "_type": "_doc", "_id": 2}}
        {"name": "疯狂的⽯头"}
        ```

* POST bulk

    es服务器内相对路径执行

    ```shell
    curl -X POST "localhost:9200/_bulk" -H 'Content-Type: application/json'
    --data-binary @name
    ```

    > 数据文件最后必须有一行空行

### [](https://wylong.top/Elasticsearch/10-ES%E4%B9%8B%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE.html#%E6%93%8D%E4%BD%9C%E9%A1%BA%E5%BA%8F)操作顺序

1.  创建索引
2.  准备数据文件，最后必须有一行空行
3.  上传数据文件到es服务器
    * 非必填项，可以远程导入
4.  执行导入命令

### [](https://wylong.top/Elasticsearch/10-ES%E4%B9%8B%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE.html#%E5%AE%9E%E6%93%8D)实操

* 创建索引

    ```json
    put nba
    {
        "mappings": {
            "properties": {
                "birthDay": {
                    "type": "date"
                },
                "birthDayStr": {
                    "type": "keyword"
                },
                "age": {
                    "type": "integer"
                },
                "code": {
                    "type": "text"
                },
                "country": {
                    "type": "text"
                },
                "countryEn": {
                    "type": "text"
                },
                "displayAffiliation": {
                    "type": "text"
                },
                "displayName": {
                    "type": "text"
                },
                "displayNameEn": {
                    "type": "text"
                },
                "draft": {
                    "type": "long"
                },
                "heightValue": {
                    "type": "float"
                },
                "jerseyNo": {
                    "type": "text"
                },
                "playYear": {
                    "type": "long"
                },
                "playerId": {
                    "type": "keyword"
                },
                "position": {
                    "type": "text"
                },
                "schoolType": {
                    "type": "text"
                },
                "teamCity": {
                    "type": "text"
                },
                "teamCityEn": {
                    "type": "text"
                },
                "teamConference": {
                    "type": "keyword"
                },
                "teamConferenceEn": {
                    "type": "keyword"
                },
                "teamName": {
                    "type": "keyword"
                },
                "teamNameEn": {
                    "type": "keyword"
                },
                "weight": {
                    "type": "text"
                }
            }
        }
    }
    ```

* 批量导入
    1.  准备文件 player

    2.  上传到es服务器

    3.  在player文件所在目录执行导入

        ```shell
        curl -X POST "localhost:9200/_bulk" -H 'Content-Type: application/json' --data-binary @player
        ```

        带用户密码

        ```shell
        curl -X POST "http://elastic:123456@localhost:9200/_bulk" -H "Content-Type:application/json;charset=UTF-8" --data-binary @player
        ```

    4.  导入后查询确认

        ```
        POST nba/_search
        {
         "query": {
         "match_all": {}
         },
         "from": 0, 
         "size": 20
        }
        ```
