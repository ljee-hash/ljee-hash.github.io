---
layout:     post
title:      "Elasticsearch的⾼级使⽤(term&别名)"
subtitle:   "搜索引擎"
date:       2022-03-04 10:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch的快速安装

- ES之term的多种查询
- 快速安装


## ES之term的多种查询

* 介绍
    * 单词级别查询
    * 这些查询通常⽤于结构化的数据，⽐如：number, date, keyword等，⽽不是对text。
    * 也就是说，全⽂本查询之前要先对⽂本内容进⾏分词，⽽单词级别的查询直接在相应字段的反向索引中精确查找，单词级别的查询⼀般⽤于数值、⽇期等类型的字段上

## [](https://wylong.top/Elasticsearch/11-ES%E4%B9%8Bterm%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%9F%A5%E8%AF%A2.html#%E4%B8%80%E3%80%81%E6%99%AE%E9%80%9A%E6%9F%A5%E8%AF%A2)一、普通查询

* Term query 精准匹配查询(查找号码为23的球员)

    ```json
    POST nba/_search
    {
        "query": {
            "term": {
                "jerseyNo": "23"
            }
        }
    }
    ```

* Exsit Query 在特定的字段中查找⾮空值的⽂档(查找队名⾮空的球员)

    ```json
    POST nba/_search
    {
        "query": {
            "exists": {
                "field": "teamNameEn"
            }
        }
    }
    ```

* Prefifix Query 查找包含带有指定前缀term的⽂档(查找队名以Rock开头的球员)

    ```json
    POST nba/_search
    {
        "query": {
            "prefix": {
                "teamNameEn": "Rock"
            }
        }
    }
    ```

* Wildcard Query ⽀持通配符查询，*表示任意字符，?表示任意单个字符(查找⽕箭队的球员)

    ```json
    POST nba/_search
    {
        "query": {
            "wildcard": {
                "teamNameEn": "Ro*s"
            }
        }
    }
    ```

* Regexp Query 正则表达式查询(查找⽕箭队的球员)

    ```json
    POST nba/_search
    {
        "query": {
            "regexp": {
                "teamNameEn": "Ro.*s"
            }
        }
    }
    ```

* Ids Query(查找id为1和2的球员)

    ```json
    POST nba/_search
    {
        "query": {
            "ids": {
                "values": [
                    1,
                    2
                ]
            }
        }
    }
    ```

## [](https://wylong.top/Elasticsearch/11-ES%E4%B9%8Bterm%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%9F%A5%E8%AF%A2.html#%E4%BA%8C%E3%80%81es%E7%9A%84%E8%8C%83%E5%9B%B4%E6%9F%A5%E8%AF%A2)二、ES的范围查询

* 查找指定字段在指定范围内包含值（⽇期、数字或字符串）的⽂档
    * 查找在nba打了2年到10年以内的球员

        ```json
        POST nba/_search
        {
            "query": {
                "range": {
                    "playYear": {
                        "gte": 2,
                        "lte": 10
                    }
                }
            }
        }
        ```

    * 查找1980年到1999年出⽣的球员

        ```json
        POST nba/_search
        {
            "query": {
                "range": {
                    "birthDay": {
                        "gte": "01/01/1999",
                        "lte": "2022",
                        "format": "dd/MM/yyyy||yyyy"
                    }
                }
            }
        }
        ```

## [](https://wylong.top/Elasticsearch/11-ES%E4%B9%8Bterm%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%9F%A5%E8%AF%A2.html#%E4%B8%89%E3%80%81es%E7%9A%84%E5%B8%83%E5%B0%94%E6%9F%A5%E8%AF%A2)三、ES的布尔查询

* 布尔查询

    | type     | 描述                         |
    | -------- | ---------------------------- |
    | must     | 必须出现在匹配的文档中       |
    | filter   | 必须出现在⽂档中，但是不打分 |
    | must_not | 不能出现在⽂档中             |
    | should   | 应该出现在⽂档中             |

* must (查找名字叫做James的球员)

    ```json
    POST /nba/_search
    {
        "query": {
            "bool": {
                "must": [
                    {
                        "match": {
                            "displayNameEn": "james"
                        }
                    }
                ]
            }
        }
    }
    ```

* filter 效果同must，但是不打分(查找名字叫做James的球员)

    ```json
    POST /nba/_search
    {
        "query": {
            "bool": {
                "filter": [
                    {
                        "match": {
                            "displayNameEn": "james"
                        }
                    }
                ]
            }
        }
    }
    ```

* must_not (查找名字叫做James的⻄部球员)

    ```json
    POST /nba/_search
    {
        "query": {
            "bool": {
                "must": [
                    {
                        "match": {
                            "displayNameEn": "james"
                        }
                    }
                ],
                "must_not": [
                    {
                        "term": {
                            "teamConferenceEn": {
                                "value": "Eastern"
                            }
                        }
                    }
                ]
            }
        }
    }
    ```

* should(查找名字叫做James的打球时间应该在11到20年⻄部球员)
    * 即使匹配不到也返回，只是评分不同

        ```json
        POST /nba/_search
        {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "displayNameEn": "james"
                            }
                        }
                    ],
                    "must_not": [
                        {
                            "term": {
                                "teamConferenceEn": {
                                    "value": "Eastern"
                                }
                            }
                        }
                    ],
                    "should": [
                        {
                            "range": {
                                "playYear": {
                                    "gte": 11,
                                    "lte": 20
                                }
                            }
                        }
                    ]
                }
            }
        }
        ```

    * 如果minimum_should_match=1，则变成要查出名字叫做James的打球时间在11到20年⻄部球员

        ```json
        POST /nba/_search
        {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "displayNameEn": "james"
                            }
                        }
                    ],
                    "must_not": [
                        {
                            "term": {
                                "teamConferenceEn": {
                                    "value": "Eastern"
                                }
                            }
                        }
                    ],
                    "should": [
                        {
                            "range": {
                                "playYear": {
                                    "gte": 11,
                                    "lte": 20
                                }
                            }
                        }
                    ],
                    "minimum_should_match": 1
                }
            }
        }
        ```

## [](https://wylong.top/Elasticsearch/11-ES%E4%B9%8Bterm%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%9F%A5%E8%AF%A2.html#%E5%9B%9B%E3%80%81es%E7%9A%84%E6%8E%92%E5%BA%8F%E6%9F%A5%E8%AF%A2)四、ES的排序查询

* ⽕箭队中按打球时间从⼤到⼩排序的球员

    ```json
    POST nba/_search
    {
        "query": {
            "match": {
                "teamNameEn": "Rockets"
            }
        },
        "sort": [
            {
                "playYear": {
                    "order": "desc"
                }
            }
        ]
    }
    ```

* ⽕箭队中按打球时间从⼤到⼩，如果年龄相同则按照身⾼从⾼到低排序的球员

    ```json
    POST nba/_search
    {
        "query": {
            "match": {
                "teamNameEn": "Rockets"
            }
        },
        "sort": [
            {
                "playYear": {
                    "order": "desc"
                }
            },
            {
                "heightValue": {
                    "order": "asc"
                }
            }
        ]
    }
    ```

## [](https://wylong.top/Elasticsearch/11-ES%E4%B9%8Bterm%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%9F%A5%E8%AF%A2.html#%E4%BA%94%E3%80%81es%E8%81%9A%E5%90%88%E6%9F%A5%E8%AF%A2%E4%B9%8B%E6%8C%87%E6%A0%87%E8%81%9A%E5%90%88)五、ES聚合查询之指标聚合

* ES聚合分析是什么
    * 聚合分析是数据库中重要的功能特性，完成对⼀个查询的数据集中数据的聚合计算，如：找出某字段（或计算表达式的结果）的最⼤值、最⼩值，计算和、平均值等。ES作为搜索引擎兼数据库，同样提供了强⼤的聚合分析能⼒。
    * 对⼀个数据集求最⼤、最⼩、和、平均值等指标的聚合，在ES中称为**指标聚合**
    * ⽽关系型数据库中除了有聚合函数外，还可以对查询出的数据进⾏分组group by，再在组上进⾏指标聚合。在ES中称为**桶聚合**

* max min sum avg
    * 求火箭队球员的平均年龄

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "avgAge": {
                    "avg": {
                        "field": "age"
                    }
                }
            },
            "size": 0
        }
        ```

* value_count 统计⾮空字段的⽂档数
    * 求出⽕箭队中球员打球时间不为空的数量

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "countPlayerYear": {
                    "value_count": {
                        "field": "playYear"
                    }
                }
            },
            "size": 0
        }
        ```

    * 查出⽕箭队有多少名球员

        ```json
        POST nba/_count
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            }
        }
        ```

* Cardinality 值去重计数
    * 查出⽕箭队中年龄不同的数量

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "counAget": {
                    "cardinality": {
                        "field": "age"
                    }
                }
            },
            "size": 0
        }
        ```

* stats 统计count max min avg sum 5个值
    * 查出⽕箭队球员的年龄stats

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "statsAge": {
                    "stats": {
                        "field": "age"
                    }
                }
            },
            "size": 0
        }
        ```

* Extended stats ⽐stats多4个统计结果： 平⽅和、⽅差、标准差、平均值加/减两个标准差的区间
    * 查出⽕箭队球员的年龄Extend stats

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "extendStatsAge": {
                    "extended_stats": {
                        "field": "age"
                    }
                }
            },
            "size": 0
        }
        ```

* Percentiles 占⽐百分位对应的值统计，默认返回[ 1, 5, 25, 50, 75, 95, 99 ]分位上的值
    * 查出⽕箭的球员的年龄占⽐

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "pecentAge": {
                    "percentiles": {
                        "field": "age"
                    }
                }
            },
            "size": 0
        }
        ```

    * 查出⽕箭的球员的年龄占⽐(指定分位值)

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "percentAge": {
                    "percentiles": {
                        "field": "age",
                        "percents": [
                            20,
                            50,
                            75
                        ]
                    }
                }
            },
            "size": 0
        }
        ```

## [](https://wylong.top/Elasticsearch/11-ES%E4%B9%8Bterm%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%9F%A5%E8%AF%A2.html#%E5%85%AD%E3%80%81es%E8%81%9A%E5%90%88%E6%9F%A5%E8%AF%A2%E4%B9%8B%E6%A1%B6%E8%81%9A%E5%90%88)六、ES聚合查询之桶聚合

* ES聚合分析是什么
    * 聚合分析是数据库中重要的功能特性，完成对⼀个查询的数据集中数据的聚合计算，如：找出某字段（或计算表达式的结果）的最⼤值、最⼩值，计算和、平均值等。ES作为搜索引擎兼数据库，同样提供了强⼤的聚合分析能⼒。
    * 对⼀个数据集求最⼤、最⼩、和、平均值等指标的聚合，在ES中称为**指标聚合**
    * ⽽关系型数据库中除了有聚合函数外，还可以对查询出的数据进⾏分组group by，再在组上进⾏指标聚合。在ES中称为**桶聚合**

* Terms Aggregation 根据字段项分组聚合
    * ⽕箭队根据年龄进⾏分组

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "aggsAge": {
                    "terms": {
                        "field": "age",
                        "size": 10
                    }
                }
            },
            "size": 0
        }
        ```

* order 分组聚合排序
    * ⽕箭队根据年龄进⾏分组，分组信息通过年龄从⼤到⼩排序 (通过指定字段)

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "aggsAge": {
                    "terms": {
                        "field": "age",
                        "size": 10,
                        "order": {
                            "_key": "desc"
                        }
                    }
                }
            },
            "size": 0
        }
        ```

    * ⽕箭队根据年龄进⾏分组，分组信息通过⽂档数从⼤到⼩排序 (通过⽂档数)

        ```json
        POST /nba/_search
        {
            "query": {
                "term": {
                    "teamNameEn": {
                        "value": "Rockets"
                    }
                }
            },
            "aggs": {
                "aggsAge": {
                    "terms": {
                        "field": "age",
                        "size": 10,
                        "order": {
                            "_count": "desc"
                        }
                    }
                }
            },
            "size": 0
        }
        ```

    * 每⽀球队按该队所有球员的平均年龄进⾏分组排序 (通过分组指标值)

        ```json
        POST /nba/_search
        {
            "aggs": {
                "aggsTeamName": {
                    "terms": {
                        "field": "teamNameEn",
                        "size": 30,
                        "order": {
                            "avgAge": "desc"
                        }
                    },
                    "aggs": {
                        "avgAge": {
                            "avg": {
                                "field": "age"
                            }
                        }
                    }
                }
            },
            "size": 0
        }
        ```

* 筛选分组聚合
    * 湖⼈和⽕箭队按球队平均年龄进⾏分组排序 (指定值列表)

        ```json
        POST /nba/_search
        {
            "aggs": {
                "aggsTeamName": {
                    "terms": {
                        "field": "teamNameEn",
                        "include": [
                            "Lakers",
                            "Rockets",
                            "Warriors"
                        ],
                        "exclude": [
                            "Warriors"
                        ],
                        "size": 30,
                        "order": {
                            "avgAge": "desc"
                        }
                    },
                    "aggs": {
                        "avgAge": {
                            "avg": {
                                "field": "age"
                            }
                        }
                    }
                }
            },
            "size": 0
        }
        ```

    * 湖⼈和⽕箭队按球队平均年龄进⾏分组排序 (正则表达式匹配值)

        ```json
        POST /nba/_search
        {
            "aggs": {
                "aggsTeamName": {
                    "terms": {
                        "field": "teamNameEn",
                        "include": "Lakers|Ro.*|Warriors.*",
                        "exclude": "Warriors",
                        "size": 30,
                        "order": {
                            "avgAge": "desc"
                        }
                    },
                    "aggs": {
                        "avgAge": {
                            "avg": {
                                "field": "age"
                            }
                        }
                    }
                }
            },
            "size": 0
        }
        ```

* Range Aggregation 范围分组聚合
    * NBA球员年龄按20,20-35,35这样分组

        ```json
        POST /nba/_search
        {
            "aggs": {
                "ageRange": {
                    "range": {
                        "field": "age",
                        "ranges": [
                            {
                                "to": 20
                            },
                            {
                                "from": 20,
                                "to": 35
                            },
                            {
                                "from": 35
                            }
                        ]
                    }
                }
            },
            "size": 0
        }
        ```

    * NBA球员年龄按20,20-35,35这样分组 (起别名)

        ```json
        POST /nba/_search
        {
            "aggs": {
                "ageRange": {
                    "range": {
                        "field": "age",
                        "ranges": [
                            {
                                "to": 20,
                                "key": "A"
                            },
                            {
                                "from": 20,
                                "to": 35,
                                "key": "B"
                            },
                            {
                                "from": 35,
                                "key": "C"
                            }
                        ]
                    }
                }
            },
            "size": 0
        }
        ```

* Date Range Aggregation 时间范围分组聚合
    * NBA球员按出⽣年⽉分组

        ```json
        POST /nba/_search
        {
            "aggs": {
                "birthDayRange": {
                    "date_range": {
                        "field": "birthDay",
                        "format": "MM-yyy",
                        "ranges": [
                            {
                                "to": "01-1989"
                            },
                            {
                                "from": "01-1989",
                                "to": "01-1999"
                            },
                            {
                                "from": "01-1999",
                                "to": "01-2009"
                            },
                            {
                                "from": "01-2009"
                            }
                        ]
                    }
                }
            },
            "size": 0
        }
        ```

* Date Histogram Aggregation 时间柱状图聚合
    * 按天、⽉、年等进⾏聚合统计。可按 year (1y), quarter (1q), month (1M), week (1w), day(1d), hour (1h), minute (1m), second (1s) 间隔聚合

    * NBA球员按出⽣年分组

        ```json
        POST /nba/_search
        {
            "aggs": {
                "birthday_aggs": {
                    "date_histogram": {
                        "field": "birthDay",
                        "format": "yyyy",
                        "interval": "year"
                    }
                }
            },
            "size": 0
        }
        ```

## [](https://wylong.top/Elasticsearch/11-ES%E4%B9%8Bterm%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%9F%A5%E8%AF%A2.html#%E4%B8%83%E3%80%81es%E4%B9%8Bquerystring%E6%9F%A5%E8%AF%A2)七、ES之query_string查询

* 介绍
    * query_string 查询，如果熟悉lucene的查询语法，我们可以直接⽤lucene查询语法写⼀个查询串进⾏查询，ES中接到请求后，通过查询解析器,解析查询串⽣成对应的查询。

* 指定单个字段查询

    ```json
    POST /nba/_search
    {
        "query": {
            "query_string": {
                "default_field": "displayNameEn",
                "query": "james OR curry"
            }
        },
        "size": 100
    }
    ```
## 一、ES之索引别名的使⽤

* 别名有什么⽤

    在开发中，随着业务需求的迭代，较⽼的业务逻辑就要⾯临更新甚⾄是重构，⽽对于es来说，为了适应新的业务逻辑，可能就要对原有的索引做⼀些修改，⽐如对某些字段做调整，甚⾄是重建索引。⽽做这些操作的时候，可能会对业务造成影响，甚⾄是停机调整等问题。由此，es提供了索引别名来解决这些问题。 索引别名就像⼀个快捷⽅式或是软连接，可以指向⼀个或多个索引，也可以给任意⼀个需要索引名的API来使⽤。别名的应⽤为程序提供了极⼤地灵活性

* 查询别名

    ```
    GET /nba/_alias

    GET /_alias
    ```

* 新增别名

    ```json
    POST /_aliases
    {
        "actions": [
            {
                "add": {
                    "index": "nba",
                    "alias": "nba_v1.0"
                }
            }
        ]
    }
    ```

    ```
    PUT /nba/_alias/nba_v1.1
    ```

* 删除别名

    ```json
    POST /_aliases
    {
        "actions": [
            {
                "remove": {
                    "index": "nba",
                    "alias": "nba_v1.0"
                }
            }
        ]
    }
    ```

    ```
    DELETE /nba/_alias/nba_v1.1
    ```

* 重命名

    先删除，再添加

    ```json
    POST /_aliases
    {
        "actions": [
            {
                "remove": {
                    "index": "nba",
                    "alias": "nba_v1.0"
                }
            },
            {
                "add": {
                    "index": "nba",
                    "alias": "nba_v2.0"
                }
            }
        ]
    }
    ```

* 为多个索引指定⼀个别名

    ```json
    POST /_aliases
    {
        "actions": [
            {
                "add": {
                    "index": "nba",
                    "alias": "national_player"
                }
            },
            {
                "add": {
                    "index": "wnba",
                    "alias": "national_player"
                }
            }
        ]
    }
    ```

* 为同个索引指定多个别名

    ```json
    POST /_aliases
    {
        "actions": [
            {
                "add": {
                    "index": "nba",
                    "alias": "nba_v2.1"
                }
            },
            {
                "add": {
                    "index": "nba",
                    "alias": "nba_v2.2"
                }
            }
        ]
    }
    ```

* 通过别名读索引
    * 当别名指定了⼀个索引，则查出⼀个索引

        ```
        GET /nba_v2.1
        ```

    * 当别名指定了多个索引，则查出多个索引

        ```
        GET /national_player
        ```

* 通过别名写索引
    * 当别名指定了⼀个索引，则可以做写的操作

        ```json
        POST /nba_v2.1/_doc/566
        {
            "countryEn": "Croatia",
            "teamName": "快船",
            "birthDay": 858661200000,
            "country": "克罗地亚",
            "teamCityEn": "LA",
            "code": "ivica_zubac",
            "displayAffiliation": "Croatia",
            "displayName": "伊维察 祖巴茨哥哥",
            "schoolType": "",
            "teamConference": "⻄部",
            "teamConferenceEn": "Western",
            "weight": "108.9 公⽄",
            "teamCity": "洛杉矶",
            "playYear": 3,
            "jerseyNo": "40",
            "teamNameEn": "Clippers",
            "draft": 2016,
            "displayNameEn": "Ivica Zubac",
            "heightValue": 2.16,
            "birthDayStr": "1997-03-18",
            "position": "中锋",
            "age": 22,
            "playerId": "1627826"
        }
        ```

    * 当别名指定了多个索引，可以指定写某个索引

        ```json
        POST /_aliases
        {
            "actions": [
                {
                    "add": {
                        "index": "nba",
                        "alias": "national_player",
                        "is_write_index": true
                    }
                },
                {
                    "add": {
                        "index": "wnba",
                        "alias": "national_player"
                    }
                }
            ]
        }
        ```

        ```json
        POST /national_player/_doc/566
        {
            "countryEn": "Croatia",
            "teamName": "快船",
            "birthDay": 858661200000,
            "country": "克罗地亚",
            "teamCityEn": "LA",
            "code": "ivica_zubac",
            "displayAffiliation": "Croatia",
            "displayName": "伊维察 祖巴茨妹妹",
            "schoolType": "",
            "teamConference": "⻄部",
            "teamConferenceEn": "Western",
            "weight": "108.9 公⽄",
            "teamCity": "洛杉矶",
            "playYear": 3,
            "jerseyNo": "40",
            "teamNameEn": "Clippers",
            "draft": 2016,
            "displayNameEn": "Ivica Zubac",
            "heightValue": 2.16,
            "birthDayStr": "1997-03-18",
            "position": "中锋",
            "age": 22,
            "playerId": "1627826"
        }
        ```

## [](https://wylong.top/Elasticsearch/12-ES%E7%9A%84%E2%BE%BC%E7%BA%A7%E4%BD%BF%E2%BD%A4.html#%E4%BA%8C%E3%80%81es%E9%87%8D%E5%BB%BA%E7%B4%A2%E5%BC%95)二、ES重建索引

* 背景

    Elasticsearch是⼀个实时的分布式搜索引擎，为⽤户提供搜索服务，当我们决定存储某种数据时，在创建索引的时候需要将数据结构完整确定下来，于此同时索引的设定和很多固定配置将⽤不能改变。当需要改变数据结构时，就需要重新建⽴索引，为此，Elastic团队提供了很多辅助⼯具帮助开发⼈员进⾏重建索引。

* 步骤
    1.  nba取⼀个别名nba_latest, nba_latest作为对外使⽤
    2.  新增⼀个索引nba_20220101，结构复制于nba索引，根据业务要求修改字段
    3.  将nba数据同步到nba_20220101
    4.  给nba_20220101添加别名nba_latest，删除nba别名nba_latest
    5.  删除nba索引

### [](https://wylong.top/Elasticsearch/12-ES%E7%9A%84%E2%BE%BC%E7%BA%A7%E4%BD%BF%E2%BD%A4.html#%E5%AE%9E%E6%93%8D)实操

* 我们对外提供访问nba索引时使⽤的是nba_latest别名

* 新增⼀个索引(⽐如修改字段类型，jerseyNo改成keyword类型)

    ```json
    PUT /nba_20220101
    {
        "mappings": {
            "properties": {
                "age": {
                    "type": "integer"
                },
                "birthDay": {
                    "type": "date"
                },
                "birthDayStr": {
                    "type": "keyword"
                },
                "code": {
                    "type": "text"
                },
                "country": {
                    "type": "keyword"
                },
                "countryEn": {
                    "type": "keyword"
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
                    "type": "keyword"
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

* 将旧索引数据copy到新索引
    * 同步等待，接⼝将会在 reindex 结束后返回

        ```json
        POST /_reindex
        {
            "source": {
                "index": "nba"
            },
            "dest": {
                "index": "nba_20220101"
            }
        }
        ```

    * 异步执⾏，如果 reindex 时间过⻓，建议加上 `wait_for_completion=false` 的参数条件，这样 reindex 将直接返回 `taskId`

        ```json
        POST /_reindex?wait_for_completion=false
        {
            "source": {
                "index": "nba"
            },
            "dest": {
                "index": "nba_20220101"
            }
        }
        ```

        后续可以根据返回的taskId查询进度

        ```
        GET /_tasks/<task_id>
        ```

        查询参数

        | 参数                | 说明                                                         |
        | ------------------- | ------------------------------------------------------------ |
        | timeout             | 请求超时时间，如果超时时间内没有响应，则请求失败并返回错误信息，默认30s。 |
        | wait_for_completion | 如果为true，则等待匹配的任务完成。默认为false。              |
        | nodes               | 逗号分隔的节点id或节点名等。检索指定节点的任务信息。         |
        | parent_task_id      | 指定父任务id，检索其所有子任务信息。                         |
        | actions             | 指定任务功能，返回指定功能的任务信息。接受通配符表达式。     |
        | detailed            | 如果为true，返回任务信息中会额外包括description任务描述信息，默认为false。 |
        | group_by            | 对返回结果进行分组，可选值为nodes（按节点分组）、none（禁用分组）、parents（按父任务分组），默认为nodes。 |

        取消指定的任务（如果任务支持取消操作）

        ```
        POST _tasks/<task_id>/_cancel
        ```

* 替换别名

    ```json
    POST /_aliases
    {
        "actions": [
            {
                "add": {
                    "index": "nba_20220101",
                    "alias": "nba_latest"
                }
            },
            {
                "remove": {
                    "index": "nba",
                    "alias": "nba_latest"
                }
            }
        ]
    }
    ```

* 删除旧索引

    ```
    DELETE /nba
    ```

* 通过别名访问新索引

    ```json
    POST /nba_latest/_search
    {
        "query": {
            "match": {
                "displayNameEn": "james"
            }
        }
    }
    ```

## [](https://wylong.top/Elasticsearch/12-ES%E7%9A%84%E2%BE%BC%E7%BA%A7%E4%BD%BF%E2%BD%A4.html#%E4%B8%89%E3%80%81es%E4%B9%8Brefresh%E6%93%8D%E4%BD%9C)三、ES之refresh操作

* 理想的搜索：

    新的数据⼀添加到索引中⽴⻢就能搜索到，但是真实情况不是这样的。

* 我们使⽤链式命令请求，先添加⼀个⽂档，再⽴刻搜索

    数据先到buffer缓冲区，所以立马查询不到，默认1s

    ```
    curl -X PUT localhost:9200/star/_doc/888 -H 'Content-Type:application/json' -d '{ "displayName": "蔡徐坤" }'

    curl -X GET localhost:9200/star/_doc/_search?pretty
    ```

* 强制刷新

    ```
    curl -X PUT localhost:9200/star/_doc/666?refresh -H 'Content-Type:application/json' -d '{ "displayName": "杨超越" }'

    curl -X GET localhost:9200/star/_doc/_search?pretty
    ```

* 修改默认更新时间(默认时间是1s)

    ```json
    PUT /star/_settings
    {
        "index": {
            "refresh_interval": "5s"
        }
    }
    ```

* 将refresh关闭

    ```json
    PUT /star/_settings
    {
        "index": {
            "refresh_interval": "-1"
        }
    }
    ```

## [](https://wylong.top/Elasticsearch/12-ES%E7%9A%84%E2%BE%BC%E7%BA%A7%E4%BD%BF%E2%BD%A4.html#%E5%9B%9B%E3%80%81es%E4%B9%8B%E9%AB%98%E4%BA%AE%E6%9F%A5%E8%AF%A2)四、ES之高亮查询

如果返回的结果集中很多符合条件的结果，那怎么能⼀眼就能看到我们想要的那个结果呢？

⽐如在百度中，我们搜索 `elasticsearch` ，在结果集中，将所有 `elasticsearch` ⾼亮显示？

![](https://wylong.top/Elasticsearch/images/12-%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.png)

* ⾼亮查询

    ```json
    POST /nba_latest/_search
    {
        "query": {
            "match": {
                "displayNameEn": "james"
            }
        },
        "highlight": {
            "fields": {
                "displayNameEn": {}
            }
        }
    }
    ```

    结果中会多出这么一段内容，默认使用 `em` 标签包裹

    ```json
    "highlight" : {
        "displayNameEn" : [
            "<em>James</em> Harden"
        ]
    }
    ```

* ⾃定义⾼亮标签查询

    ```json
    POST /nba_latest/_search
    {
        "query": {
            "match": {
                "displayNameEn": "james"
            }
        },
        "highlight": {
            "fields": {
                "displayNameEn": {
                    "pre_tags": [
                        "<h1>"
                    ],
                    "post_tags": [
                        "</h1>"
                    ]
                }
            }
        }
    }
    ```

    结果

    ```json
    "highlight" : {
        "displayNameEn" : [
        "<h1>James</h1> Harden"
        ]
    }
    ```

## [](https://wylong.top/Elasticsearch/12-ES%E7%9A%84%E2%BE%BC%E7%BA%A7%E4%BD%BF%E2%BD%A4.html#%E4%BA%94%E3%80%81es%E4%B9%8B%E5%BB%BA%E8%AE%AE%E6%9F%A5%E8%AF%A2)五、ES之建议查询

* 查询建议是什么
    * 查询建议，是为了给⽤户提供更好的搜索体验。包括：词条检查，⾃动补全。

    * 词条检查

        ![](https://wylong.top/Elasticsearch/images/12-%E6%9F%A5%E8%AF%A2%E5%BB%BA%E8%AE%AE.png)

    * ⾃动补全

        只输入了 `elastics`  自动补全了 `elasticsearch`

        ![](https://wylong.top/Elasticsearch/images/12-%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8.png)

* Suggester - 建议器
    * Term suggester
    * Phrase suggester
    * Completion suggester

* 建议器字段

    ![](https://wylong.top/Elasticsearch/images/12-%E5%BB%BA%E8%AE%AE%E5%99%A8%E5%AD%97%E6%AE%B5.png)

* Term suggester
    * term 词条建议器，对给输⼊的⽂本进⾏分词，为每个分词提供词项建议

        ```json
        POST /nba_latest/_search
        {
            "suggest": {
                "my-suggestion": {
                    "text": "jamse hardne",
                    "term": {
                        "suggest_mode": "missing",
                        "field": "displayNameEn"
                    }
                }
            }
        }
        ```

* Phrase suggester
    * phrase 短语建议，在term的基础上，会考量多个term之间的关系，⽐如是否同时出现在索引的原⽂⾥，相邻程度，以及词频等

        ```json
        POST /nba_latest/_search
        {
            "suggest": {
                "my-suggestion": {
                    "text": "jamse harden",
                    "phrase": {
                        "field": "displayNameEn"
                    }
                }
            }
        }
        ```

* Completion suggester
    * Completion 完成建议

        ```json
        POST /nba_latest/_search
        {
            "suggest": {
                "my-suggestion": {
                    "text": "Miam",
                    "completion": {
                        "field": "teamCityEn"
                    }
                }
            }
        }
        ```
