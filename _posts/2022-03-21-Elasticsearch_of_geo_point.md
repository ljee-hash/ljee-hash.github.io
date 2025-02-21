---
layout:     post
title:      "Elasticsearch基于geo_point语法实现空间地理信息存储及检索"
subtitle:   "搜索引擎"
date:       2022-03-21 10:15:06
author:     "Ljeehash"
tags:
    - Elasticsearch
    - GeoHash
---

# 1、Elasticsearch基于geo_point语法实现空间地理信息存储及检索

[Elasticsearch基于geo_point语法实现空间地理信息存储及检索](https://zhuanlan.zhihu.com/p/378770937?utm_id=0)

由于此篇文章中也会涉及一点GeoHash算法，为了方便大家理解，还请大家可以提前了解一下GeoHash空间算法。



在空间地理中，有很多的数据库都可以很好的存储，常见的关系型数据库如 MySql、Oracle等都可以很好的支持空间地理，非关系型数据库有 Redis、MongoBD、Elasticsearch等可以很好的支持空间地理；


但是如果涉及到空间地理的计算，相比较而言常见的几种非关系型数据库相对更胜一筹；



有基于Redis实现过类似于微信的"附近"功能，可以查看附近的元素。相关文章

# 2、GeoHash算法解析及Redis支持GEO地理位置运用

[GeoHash算法解析及Redis支持GEO地理位置运用](https://zhuanlan.zhihu.com/p/38639394)



# 3、使用代码实现查看"附近的人"功能

[使用代码实现查看"附近的人"功能](https://zhuanlan.zhihu.com/p/95967044)
