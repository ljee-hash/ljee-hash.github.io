---
layout:     post
title:      "Elasticsearch数据的CRUD"
subtitle:   "搜索引擎"
date:       2022-03-01 10:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch数据的CRUD

- 索引的介绍和使用
- 映射(maping)的介绍和使⽤
- 文档的增删改查
- 搜索的简单使用


## 索引的介绍和使用

#### [](https://wylong.top/Elasticsearch/04-%E7%B4%A2%E5%BC%95%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%92%8C%E4%BD%BF%E7%94%A8.html#%E7%B4%A2%E5%BC%95%E7%9A%84%E6%93%8D%E4%BD%9C)索引的操作

* 新增
    * 请求

        ```shell
        curl -X PUT "localhost:9200/nba"
        ```

    * 响应

        ```json
        {
         "acknowledged": true,
         "shards_acknowledged": true,
         "index": "nba"
        }
        ```

* 获取
    * 请求

        ```shell
        curl -X GET "localhost:9200/nba"
        ```

    * 响应

        ```json
        {
            "nba": {
                "aliases": {},
                "mappings": {},
                "settings": {
                    "index": {
                        "creation_date": "1563078001824",
                        "number_of_shards": "1",
                        "number_of_replicas": "1",
                        "uuid": "P-kmcRGlRECcBxAI_8mgaw",
                        "version": {
                            "created": "7020099"
                        },
                        "provided_name": "nba"
                    }
                }
            }
        }
        ```

* 删除
    * 请求

        ```shell
        curl -X DELETE "localhost:9200/nba"
        ```

    * 响应

        ```json
        {
         "acknowledged": true
        }
        ```

* 批量获取
    * 请求

        ```shell
        curl -x GET "localhost:9200/nba,cba"
        ```

    * 响应

        ```json
        {
            "cba": {
                "aliases": {},
                "mappings": {},
                "settings": {
                    "index": {
                        "creation_date": "1563078437245",
                        "number_of_shards": "1",
                        "number_of_replicas": "1",
                        "uuid": "3rGtXSv_QTK-GU_xHKRvmw",
                        "version": {
                            "created": "7020099"
                        },
                        "provided_name": "cba"
                    }
                }
            },
            "nba": {
                "aliases": {},
                "mappings": {},
                "settings": {
                    "index": {
                        "creation_date": "1563078431931",
                        "number_of_shards": "1",
                        "number_of_replicas": "1",
                        "uuid": "bP6CZH5jSTGlhrTDzlq0bw",
                        "version": {
                            "created": "7020099"
                        },
                        "provided_name": "nba"
                    }
                }
            }
        }
        ```

* 获取所有
    * 请求1

        ```shell
        curl -X GET "localhost:9200/_all"
        ```

    * 响应1

        ```json
        {
            "cba": {
                "aliases": {},
                "mappings": {},
                "settings": {
                    "index": {
                        "creation_date": "1563078437245",
                        "number_of_shards": "1",
                        "number_of_replicas": "1",
                        "uuid": "3rGtXSv_QTK-GU_xHKRvmw",
                        "version": {
                            "created": "7020099"
                        },
                        "provided_name": "cba"
                    }
                }
            },
            "nba": {
                "aliases": {},
                "mappings": {},
                "settings": {
                    "index": {
                        "creation_date": "1563078431931",
                        "number_of_shards": "1",
                        "number_of_replicas": "1",
                        "uuid": "bP6CZH5jSTGlhrTDzlq0bw",
                        "version": {
                            "created": "7020099"
                        },
                        "provided_name": "nba"
                    }
                }
            }
        }
        ```

    * 请求2

        ```shell
        curl -X GET "localhost:9200/_cat/indices?v"
        ```

    * 响应2

        ```
        health status index uuid pri rep docs.count
        docs.deleted store.size pri.store.size
        yellow open nba bP6CZH5jSTGlhrTDzlq0bw 1 1 0 
         0 230b 230b
        yellow open cba 3rGtXSv_QTK-GU_xHKRvmw 1 1 0 
         0 230b 230b
        ```

* 判断是否存在
    * 请求

        ```shell
        curl -I "localhost:9200/nba"
        ```

    * 响应

        ```
        200 ok
        ```

* 关闭
    * 请求

        ```shell
        curl -X POST "localhost:9200/nba/_close"
        ```

    * 响应

        ```shell
        {
         "acknowledged": true,
         "shards_acknowledged": true
        }
        ```

* 打开
    * 请求

        ```shell
        curl -X POST "localhost:9200/nba/_open"
        ```

    * 响应

        ```shell
        {
         "acknowledged": true,
         "shards_acknowledged": true
        }
        ```

## 映射(maping)的介绍和使⽤

#### [](https://wylong.top/Elasticsearch/05-%E6%98%A0%E5%B0%84maping%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%92%8C%E4%BD%BF%E2%BD%A4.html#%E6%93%8D%E4%BD%9Cmapping)操作mapping

* 新增
    * 请求

        ```json
        curl -X PUT "localhost:9200/nba/_mapping" -H 'Content-Type:application/json' -d' 
        {
            "properties": {
                "name": {
                    "type": "text"
                },
                "team_name": {
                    "type": "text"
                },
                "position": {
                    "type": "keyword"
                },
                "play_year": {
                    "type": "keyword"
                },
                "jerse_no": {
                    "type": "keyword"
                }
            }
        }'
        ```

    * 响应

        ```json
        {
         "acknowledged": true
        }
        ```

* 获取
    * 请求

        ```shell
        curl -X GET "localhost:9200/xdclass/_mapping"
        ```

    * 响应

        ```json
        {
            "nba": {
                "mappings": {
                    "properties": {
                        "jerse_no": {
                            "type": "keyword"
                        },
                        "name": {
                            "type": "text"
                        },
                        "play_year": {
                            "type": "keyword"
                        },
                        "position": {
                            "type": "keyword"
                        },
                        "team_name": {
                            "type": "text"
                        }
                    }
                }
            }
        }
        ```

* 批量获取
    * 请求

        ```shell
        curl -X GET "localhost:9200/nba,cba/mapping"
        ```

    * 响应

        ```json
        {
            "nba": {
                "mappings": {
                    "properties": {
                        "jerse_no": {
                            "type": "keyword"
                        },
                        "name": {
                            "type": "text"
                        },
                        "play_year": {
                            "type": "keyword"
                        },
                        "position": {
                            "type": "keyword"
                        },
                        "team_name": {
                            "type": "text"
                        }
                    }
                }
            },
            "cba": {
                "mappings": {}
            }
        }
        ```

* 获取所有
    * 请求(⼀)

        ```shell
        curl -X GET "localhost:9200/_mapping"
        ```

    * 响应(⼀)

        ```json
        {
            "nba": {
                "mappings": {
                    "properties": {
                        "jerse_no": {
                            "type": "keyword"
                        },
                        "name": {
                            "type": "text"
                        },
                        "play_year": {
                            "type": "keyword"
                        },
                        "position": {
                            "type": "keyword"
                        },
                        "team_name": {
                            "type": "text"
                        }
                    }
                }
            },
            "cba": {
                "mappings": {}
            }
        }
        ```

    * 请求(二)

        ```shell
        curl -X GET "localhost:9200/_all/_mapping"
        ```

    * 响应(二)

        ```json
        {
            "nba": {
                "mappings": {
                    "properties": {
                        "jerse_no": {
                            "type": "keyword"
                        },
                        "name": {
                            "type": "text"
                        },
                        "play_year": {
                            "type": "keyword"
                        },
                        "position": {
                            "type": "keyword"
                        },
                        "team_name": {
                            "type": "text"
                        }
                    }
                }
            },
            "cba": {
                "mappings": {}
            }
        }
        ```

* 修改

    > 只能加字段，不能修改字段类型
    >
    > 想修改，只能重建索引
    * 请求

        ```json
        curl -X PUT "localhost:9200/nba/_mapping" -H 'Content-Type:application/json' -d' 
        {
            "properties": {
                "name": {
                    "type": "text"
                },
                "team_name": {
                    "type": "text"
                },
                "position": {
                    "type": "keyword"
                },
                "play_year": {
                    "type": "keyword"
                },
                "jerse_no": {
                    "type": "keyword"
                },
                "country": {
                    "type": "keyword"
                }
            }
        }'
        ```

    * 响应

        ```json
        {
         "acknowledged": true
        }
        ```
## 文档的增删改查

#### [](https://wylong.top/Elasticsearch/06-%E6%96%87%E6%A1%A3%E7%9A%84%E5%A2%9E%E5%88%A0%E6%94%B9%E6%9F%A5.html#%E6%BC%94%E7%A4%BA%E2%BD%82%E6%A1%A3%E7%9A%84%E5%A2%9E%E5%88%A0%E6%94%B9%E6%9F%A5)演示⽂档的增删改查

* 新增⽂档
    * PUT localhost:9200/nba/_doc/1 (指定id)

        ```json
        {
            "name": "哈登",
            "team_name": "⽕箭",
            "position": "得分后卫",
            "play_year": "10",
            "jerse_no": "13"
        }
        ```

        ```json
        {
            "_index": "nba",
            "_type": "_doc",
            "_id": "1",
            "_version": 1,
            "result": "created",
            "_shards": {
                "total": 2,
                "successful": 1,
                "failed": 0
            },
            "_seq_no": 0,
            "_primary_term": 1
        }
        ```

    * POST localhost:9200/nba/_doc (不指定id)

        ```json
        {
            "name": "库⾥",
            "team_name": "勇⼠",
            "position": "组织后卫",
            "play_year": "10",
            "jerse_no": "30"
        }
        ```

        ```json
        {
            "_index": "nba",
            "_type": "_doc",
            "_id": "cVi582sB6wrnBnZnFqog",
            "_version": 1,
            "result": "created",
            "_shards": {
                "total": 2,
                "successful": 1,
                "failed": 0
            },
            "_seq_no": 1,
            "_primary_term": 1
        }
        ```

* ⾃动创建索引
    * 查看auto_create_index开关状态，请求http://localhost:9200/_cluster/settings

    * 当索引不存在并且auto_create_index为true的时候，新增⽂档时会⾃动创建索引

    * 修改auto_create_index状态
        * PUT localhost:9200/_cluster/settings

            ```json
            {
                "persistent": {
                    "action.auto_create_index": "false"
                }
            }
            ```

            ```json
            {
                "acknowledged": true,
                "persistent": {
                    "action": {
                        "auto_create_index": "false"
                    }
                },
                "transient": {}
            }
            ```

    * 当auto_create_index=false时，指定⼀个不存在的索引，新增⽂档
        * PUT localhost:9200/wnba/_doc/1

            ```json
            {
                "name": "杨超越",
                "team_name": "梦之队",
                "position": "组织后卫",
                "play_year": "0",
                "jerse_no": "18"
            }
            ```

            ```json
            {
                "error": {
                    "root_cause": [
                        {
                            "type": "index_not_found_exception",
                            "reason": "no such index [wnba]",
                            "resource.type": "index_expression",
                            "resource.id": "wnba",
                            "index_uuid": "_na_",
                            "index": "wnba"
                        }
                    ],
                    "type": "index_not_found_exception",
                    "reason": "no such index [wnba]",
                    "resource.type": "index_expression",
                    "resource.id": "wnba",
                    "index_uuid": "_na_",
                    "index": "wnba"
                },
                "status": 404
            }
            ```

    * 当auto_create_index=true时，指定⼀个不存在的索引，新增⽂档

        ```json
        {
            "name": "杨超越",
            "team_name": "梦之队",
            "position": "组织后卫",
            "play_year": "0",
            "jerse_no": "18"
        }
        ```

        ```json
        {
            "_index": "wnba",
            "_type": "_doc",
            "_id": "1",
            "_version": 1,
            "result": "created",
            "_shards": {
                "total": 2,
                "successful": 1,
                "failed": 0
            },
            "_seq_no": 0,
            "_primary_term": 1
        }
        ```

* 指定操作类型
    * PUT localhost:9200/nba/_doc/1?op_type=create

        > 强制新增，防止修改已经存在的数据 - 指定了id=1

        ```json
        {
            "name": "哈登",
            "team_name": "⽕箭",
            "position": "得分后卫",
            "play_year": "10",
            "jerse_no": "13"
        }
        ```

        ```json
        {
            "error": {
                "root_cause": [{
                    "type": "version_conflict_engine_exception",
                    "reason": "[1]: version conflict, document already
                    exists(current version[2])
                    ",
                    "index_uuid": "oPdc9qAjRO-IlzPfymnpkg",
                    "shard": "0",
                    "index": "nba"
                }],
                "type": "version_conflict_engine_exception",
                "reason": "[1]: version conflict, document already exists
                    (current version[2])
                ",
                "index_uuid": "oPdc9qAjRO-IlzPfymnpkg",
                "shard": "0",
                "index": "nba"
            },
            "status": 409
        }
        ```

* 查看⽂档
    * GET localhost:9200/nba/_doc/1

        ```json
        {
            "_index": "nba",
            "_type": "_doc",
            "_id": "1",
            "_version": 3,
            "_seq_no": 3,
            "_primary_term": 1,
            "found": true,
            "_source": {
                "name": "哈登",
                "team_name": "⽕箭",
                "position": "得分后卫",
                "play_year": "10",
                "jerse_no": "13"
            }
        }
        ```

* 查看多个⽂档
    * POST localhost:9200/_mget

        ```json
        {
            "docs": [
                {
                    "_index": "nba",
                    "_type": "_doc",
                    "_id": "1"
                },
                {
                    "_index": "nba",
                    "_type": "_doc",
                    "_id": "2"
                }
            ]
        }
        ```

        ```json
        {
            "docs": [
                {
                    "_index": "nba",
                    "_type": "_doc",
                    "_id": "1",
                    "_version": 3,
                    "_seq_no": 3,
                    "_primary_term": 1,
                    "found": true,
                    "_source": {
                        "name": "哈登",
                        "team_name": "⽕箭",
                        "position": "得分后卫",
                        "play_year": "10",
                        "jerse_no": "13"
                    }
                },
                {
                    "_index": "nba",
                    "_type": "_doc",
                    "_id": "2",
                    "found": false
                }
            ]
        }
        ```

    * POST localhost:9200/nba/_mget

        ```json
        {
            "docs": [
                {
                    "_type": "_doc",
                    "_id": "1"
                },
                {
                    "_type": "_doc",
                    "_id": "2"
                }
            ]
        }
        ```

    * POST localhost:9200/nba/_doc/_mget

        ```json
        {
            "docs": [
                {
                    "_id": "1"
                },
                {
                    "_id": "2"
                }
            ]
        }
        ```

    * GET localhost:9200/nba/_doc/_mget

        ```json
        {
            "ids": [
                "1",
                "2"
            ]
        }
        ```

* 修改⽂档
    * 根据提供的⽂档⽚段更新数据
        * POST localhost:9200/nba/_update/1

            ```json
            {
                "doc": {
                    "name": "哈登",
                    "team_name": "⽕箭",
                    "position": "双能卫",
                    "play_year": "10",
                    "jerse_no": "13"
                }
            }
            ```

    * 向_source字段，增加⼀个字段
        * POST localhost:9200/nba/_update/1

            ```json
            {
                "script": "ctx._source.age = 18"
            }
            ```

    * 从_source字段，删除⼀个字段
        * POST localhost:9200/nba/_update/1

            ```json
            {
                "script": "ctx._source.remove(\"age\")"
            }
            ```

    * 根据参数值，更新指定⽂档的字段
        * POST localhost:9200/nba/_update/1

            ```json
            {
                "script": {
                    "source": "ctx._source.age += params.age",
                    "params": {
                        "age": 4
                    }
                }
            }
            ```

            > upsert 当指定的⽂档不存在时，upsert参数包含的内容将会被插⼊到索引中，作为⼀个新⽂档；
            >
            > 如果指定的⽂档存在，ElasticSearch引擎将会执⾏指定的更新逻辑。

        * POST localhost:9200/nba/_update/3

            ```json
            {
                "script": {
                    "source": "ctx._source.allstar += params.allstar",
                    "params": {
                        "allstar": 4
                    }
                },
                "upsert": {
                    "allstar": 1
                }
            }
            ```

* 删除⽂档
    * DELETE localhost:9200/nba/_doc/1

* 清空文档

    ```
    POST nba/_delete_by_query
    {
        "query": {
            "match_all": {
            }
        }
    }
    ```

## 搜索的简单使用

* 准备⼯作
    * 删掉nba索引
        * DELETE localhost:9200/nba

    * 新建⼀个索引,并且指定mapping
        * PUT localhost:9200/nba

            ```json
            {
                "mappings": {
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
                        }
                    }
                }
            }
            ```

    * 新增document
        * PUT localhost:9200/nba/_doc/1

            ```json
            {
                "name": "哈登",
                "team_name": "⽕箭",
                "position": "得分后卫",
                "play_year": 10,
                "jerse_no": "13"
            }
            ```

        * PUT localhost:9200/nba/_doc/2

            ```json
            {
                "name": "库⾥",
                "team_name": "勇⼠",
                "position": "控球后卫",
                "play_year": 10,
                "jerse_no": "30"
            }
            ```

        * PUT localhost:9200/nba/_doc/3

            ```json
            {
                "name": "詹姆斯",
                "team_name": "湖⼈",
                "position": "⼩前锋",
                "play_year": 15,
                "jerse_no": "23"
            }
            ```

* term(词条)查询和full text(全⽂)查询
    * **词条查询：**词条查询不会分析查询条件，只有当词条和查询字符串完全匹配时，才匹配搜索。
    * **全⽂查询：**ElasticSearch引擎会先分析查询字符串，将其拆分成多个分词，只要已分析的字段中包含词条的任意⼀个，或全部包含，就匹配查询条件，返回该⽂档；如果不包含任意⼀个分词，表示没有任何⽂档匹配查询条件

* 单条term查询

    ```json
    {
        "query": {
            "term": {
                "jerse_no": "23"
            }
        }
    }
    ```

* 多条term查询

    ```json
    {
        "query": {
            "terms": {
                "jerse_no": [
                    "23",
                    "13"
                ]
            }
        }
    }
    ```

    ```json
    {
        "took": 21,           // 消耗时间
        "timed_out": false,   // 是否超时
        "_shards": {          // 分片信息
            "total": 1,
            "successful": 1,
            "skipped": 0,
            "failed": 0
        },
        "hits": {                 // 命中情况
            "total": {
                "value": 2,
                "relation": "eq"
            },
            "max_score": 1,         // 查询打分，多条显示最大的分数
            "hits": [
                {
                    "_index": "nba",
                    "_type": "_doc",
                    "_id": "1",
                    "_score": 1,
                    "_source": {
                        "name": "哈登",
                        "team_name": "⽕箭",
                        "position": "得分后卫",
                        "play_year": 10,
                        "jerse_no": "13"
                    }
                },
                {
                    "_index": "nba",
                    "_type": "_doc",
                    "_id": "3",
                    "_score": 1,
                    "_source": {
                        "name": "詹姆斯",
                        "team_name": "湖⼈",
                        "position": "⼩前锋",
                        "play_year": 15,
                        "jerse_no": "23"
                    }
                }
            ]
        }
    }
    ```

* match_all
    * POST localhost:9200/nba/_search

        ```json
        {
            "query": {
                "match_all": {}
            },
            "from": 0,
            "size": 10
        }
        ```

* match
    * POST localhost:9200/nba/_search

        ```json
        {
            "query": {
                "match": {
                    "position": "后卫"
                }
            }
        }
        ```

* multi_match
    * POST localhost:9200/nba/_update/2

        先更新一下文档

        ```
        {
            "doc": {
                "name": "库⾥",
                "team_name": "勇⼠",
                "position": "控球后卫",
                "play_year": 10,
                "jerse_no": "30",
                "title": "the best shooter"
            }
        }
        ```

    * POST localhost:9200/nba/_search

        ```json
        {
            "query": {
                "multi_match": {
                    "query": "shooter",
                    "fields": [
                        "title",
                        "name"
                    ]
                }
            }
        }
        ```

        ```json
        {
            "query": {
                "multi_match": {
                    "query": "shooter",
                    "fields": [
                        "*title",
                        "name"
                    ]
                }
            }
        }
        ```

* match_phrase - 精确查询，类似term查询
    * post localhost:9200/nba/_search

        ```json
        {
            "query": {
                "match_phrase": {
                    "position": "得分后卫"
                }
            }
        }
        ```

* match_phrase_prefifix - 精确前缀查询
    * POST localhost:9200/nba/_update/3

        先修改文档

        ```json
        {
            "doc": {
                "name": "詹姆斯",
                "team_name": "湖⼈",
                "position": "⼩前锋",
                "play_year": 15,
                "jerse_no": "23",
                "title": "the best small forward"
            }
        }
        ```

    * POST localhost:9200/nba/_search

        ```json
        {
            "query": {
                "match_phrase_prefix": {
                    "title": "the best s"
                }
            }
        }
        ```


