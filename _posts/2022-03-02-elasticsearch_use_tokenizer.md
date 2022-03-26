---
layout:     post
title:      "Elasticsearch分词器介绍和使用"
subtitle:   "搜索引擎"
date:       2022-02-23 10:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch的分词器

- 分词器的介绍
- 分词器使⽤

## 什么是分词器

* 什么是分词器
    * 将⽤户输⼊的⼀段⽂本，按照⼀定逻辑，分析成多个词语的⼀种⼯具
* 常⽤的内置分词器
    * standard analyzer
    * simple analyzer
    * whitespace analyzer
    * stop analyzer
    * language analyzer
    * pattern analyzer

### [](https://wylong.top/Elasticsearch/08-%E5%88%86%E8%AF%8D%E5%99%A8%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%92%8C%E4%BD%BF%E2%BD%A4.html#%E5%86%85%E7%BD%AE%E5%88%86%E8%AF%8D%E5%99%A8%E4%BB%8B%E7%BB%8D)内置分词器介绍

* standard analyzer
    * 标准分析器是默认分词器，如果未指定，则使⽤该分词器。

    * POST localhost:9200/_analyze

        ```json
        {
         "analyzer": "standard", // 指定使用standard分词器分析下面语句
         "text": "The best 3-points shooter is Curry!"
        }
        ```

* simple analyzer
    * simple 分析器当它遇到只要不是字⺟的字符，就将⽂本解析成term，⽽且所有的term都是⼩写的。

* whitespace analyzer
    * whitespace 分析器，当它遇到空⽩字符时，就将⽂本解析成terms

* stop analyzer
    * stop 分析器 和 simple 分析器很像，唯⼀不同的是，stop 分析器增加了对删除停⽌词的⽀持，默认使⽤了_english_停⽌词
    * stopwords 预定义的停⽌词列表，⽐如 (the,a,an,this,of,at)等等

* language analyzer
    * （特定的语⾔的分词器，⽐如说，english，英语分词器),内置语⾔：arabic,armenian,basque, bengali, brazilian, bulgarian, catalan, cjk, czech, danish, dutch, english, fifinnish,french, galician, german, greek, hindi, hungarian, indonesian, irish, italian, latvian,lithuanian, norwegian, persian, portuguese, romanian, russian, sorani, spanish,swedish, turkish, thai

* pattern analyzer
    * ⽤正则表达式来将⽂本分割成terms，默认的正则表达式是\W+（⾮单词字符）

### [](https://wylong.top/Elasticsearch/08-%E5%88%86%E8%AF%8D%E5%99%A8%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%92%8C%E4%BD%BF%E2%BD%A4.html#%E9%80%89%E6%8B%A9%E5%88%86%E8%AF%8D%E5%99%A8)选择分词器

* 创建索引，指定使用whitespace分词器
    * PUT localhost:9200/my_index

        ```json
        {
            "settings": {
                "analysis": {
                    "analyzer": {
                        "my_analyzer": {
                            "type": "whitespace"
                        }
                    }
                }
            },
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
                    },
                    "title": {
                        "type": "text",
                        "analyzer": "my_analyzer"
                    }
                }
            }
        }
        ```

    * PUT localhost:9200/my_index/_doc/1

        添加数据

        ```json
        {
            "name": "库⾥",
            "team_name": "勇⼠",
            "position": "控球后卫",
            "play_year": 10,
            "jerse_no": "30",
            "title": "The best 3-points shooter is Curry!"
        }
        ```

    * POST localhost:9200/my_index/_search

        查询 Curry 无法查出，因为使用的whitespace分词器，Curry! 才可以查出

        ```json
        {
            "query": {
                "match": {
                    "title": "Curry!"
                }
            }
        }
        ```

## [](https://wylong.top/Elasticsearch/08-%E5%88%86%E8%AF%8D%E5%99%A8%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%92%8C%E4%BD%BF%E2%BD%A4.html#%E5%B8%B8%E8%A7%81%E4%B8%AD%E6%96%87%E5%88%86%E8%AF%8D%E5%99%A8)常见中文分词器

* smartCN ⼀个简单的中⽂或中英⽂混合⽂本的分词器
* IK分词器 更智能更友好的中⽂分词器

* smartCn
    * 安装 `sh elasticsearch-plugin install analysis-smartcn`

    * 检验
        * 安装后重新启动

        * POST localhost:9200/_analyze

            ```json
            {
                "analyzer": "smartcn",
                "text": "⽕箭明年总冠军"
            }
            ```

    * 卸载 `sh elasticsearch-plugin remove analysis-smartcn`

* IK分词器
    * 下载 https://github.com/medcl/elasticsearch-analysis-ik/releases

    * 安装 解压安装到plugins⽬录

    * 检验
        * 安装后重新启动

        * POST localhost:9200/_analyze

            ```json
            {
                "analyzer": "ik_max_word",
                "text": "⽕箭明年总冠军"
            }
            ```

## [](https://wylong.top/Elasticsearch/08-%E5%88%86%E8%AF%8D%E5%99%A8%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%92%8C%E4%BD%BF%E2%BD%A4.html#ik-%E5%88%86%E8%AF%8D%E5%99%A8%E5%AE%89%E8%A3%85)ik 分词器安装

* 下载需要的文件,版本要和es保持一致7.5.2

    ```
    https://github.com/medcl/elasticsearch-analysis-pinyin
    https://github.com/medcl/elasticsearch-analysis-ik
    ```

* 解压到plugins目录

    `elasticSearch/plugins/`

* 添加自定义字典
    * 添加自定义配置

        plugins/elasticsearch-analysis-ik-7.5.2/config/
        目录下创建my.dic文件,添加如下内容

        ```
        河北石家庄
        河北
        石家庄
        ```

        > 此文件必须保存为 utf-8 格式；内容中顶部预留一个空行，防止第一行忽略现象

    * 修改配置文件IKAnalyzer.cfg.xml

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
        <properties>
            <comment>IK Analyzer 扩展配置</comment>
            <!--用户可以在这里配置自己的扩展字典 -->
            <entry key="ext_dict">my.dic</entry>
             <!--用户可以在这里配置自己的扩展停止词字典-->
            <entry key="ext_stopwords"></entry>
            <!--用户可以在这里配置远程扩展字典 -->
            <!-- <entry key="remote_ext_dict">words_location</entry> -->
            <!--用户可以在这里配置远程扩展停止词字典-->
            <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
        </properties>
        ```

* 重启容器

    ```
    docker restart es
    docker restart kibana
    ```

* 测试

    ```
    POST _analyze
    {
     "analyzer": "ik_max_word",
     "text": "河北石家庄"
    }
    ```

**IK分词器有两种分词模式：ik_max_word和ik_smart模式**

1.  ik_max_word

    ```
    会将文本做最细粒度的拆分，比如会将“中华人民共和国人民大会堂”拆分为
    “中华人民共和国、中华人民、中华、华人、人民共和国、人民、共和国、大会堂、大会、会堂等词语。
    ```

2.  ik_smart

    ```
    会做最粗粒度的拆分，比如会将“中华人民共和国人民大会堂”拆分为中华人民共和国、人民大会堂。

    测试两种分词模式的效果。分词查询要用GET、POST请求，需要把请求参数写在body中，且需要JSON格式
    ```


