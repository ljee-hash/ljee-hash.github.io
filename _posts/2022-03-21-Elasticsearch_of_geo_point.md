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

[lucene索引文件大小优化小结](https://www.cnblogs.com/LBSer/p/4068864.html)

[elasticsearch设置字段不索引，或源数据只索引不存储](https://blog.csdn.net/nddjava/article/details/114880045)

[地理空间距离计算优化](https://tech.meituan.com/2014/09/05/lucene-distance.html)

由于此篇文章中也会涉及一点GeoHash算法，为了方便大家理解，还请大家可以提前了解一下GeoHash空间算法。



在空间地理中，有很多的数据库都可以很好的存储，常见的关系型数据库如 MySql、Oracle等都可以很好的支持空间地理，非关系型数据库有 Redis、MongoBD、Elasticsearch等可以很好的支持空间地理；


但是如果涉及到空间地理的计算，相比较而言常见的几种非关系型数据库相对更胜一筹；



有基于Redis实现过类似于微信的"附近"功能，可以查看附近的元素。相关文章

> 数据编织（[Data Fabric](https://www.sap.com/resources/what-is-data-fabric)）是一种新兴的数据管理架构理念，旨在通过智能化、自动化和统一化的方式，将分散在异构环境中的数据资源整合为可灵活访问、可信任且支持实时分析的数据网络。其核心目标是消除数据孤岛，提升数据流动性，并赋能企业快速响应业务需求。已经实现了分布式系统，但遇到了数据管理上的挑战，比如数据孤岛、集成复杂或者治理困难。

[Neo4j如何使用Data Fabric技术编织万亿图数据](https://cloud.tencent.com/developer/article/2091923)

[微软Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview)



# 2、GeoHash算法解析及Redis支持GEO地理位置运用

[GeoHash算法解析及Redis支持GEO地理位置运用](https://zhuanlan.zhihu.com/p/38639394)


[基于朴素贝叶斯的定位算法](https://www.cnblogs.com/LBSer/p/4020370.html)

假设的场景，我现在遇到了一个关于GeoHash和Redis地理位置应用的问题。我需要先理解GeoHash是什么，以及它在Redis中的应用。让我们一步步地梳理一下。

1、首先，GeoHash是一种编码方式，可以将地理位置（经纬度）转换为短字符串。这可能对存储和查询地理位置数据有帮助。我记得它使用的是base32编码，字符集包括0-9和一些字母。每个字符代表5位的二进制信息，这样可以将经纬度分割成更小的区域，从而生成一个简短的字符串。

2、接下来，我需要理解GeoHash的工作原理。它将地球表面划分为多个区域，通过递归分割经度和纬度，每次分割都将区域分成两部分，因此每次分割都会增加一位base32字符。这样，GeoHash字符串越长，表示的区域就越精确。例如，长度为1的GeoHash可能覆盖一个较大的区域，而长度为12的则非常精确，可能达到厘米级别。

3、然后，我想到Redis支持地理位置相关的命令，特别是GEOADD、GEORADIUS等。GEOADD用于将地理位置数据添加到一个键中，而GEORADIUS用于根据给定的经纬度和半径查询附近的地理位置数据。这可能涉及到使用GeoHash来实现高效的地理位置查询。

**总结**

GeoHash通过将地理位置编码为短字符串，便于存储和查询。Redis利用GeoHash实现高效的地理位置功能，支持添加、查询和距离计算等操作。在实际应用中，理解GeoHash原理和Redis命令，有助于高效管理和查询地理位置数据，满足各种应用场景的需求。

# 3、使用代码实现查看"附近的人"功能

[使用代码实现查看"附近的人"功能](https://zhuanlan.zhihu.com/p/95967044)



# 空间距离计算

[GIS FAQ Q5.1: Great circle distance between 2 points](http://www.movable-type.co.uk/scripts/gis-faq-5.1.html)

```java
/**
   *
   * @param lat1     The y coordinate of the first point, in radians
   * @param lon1     The x coordinate of the first point, in radians
   * @param lat2     The y coordinate of the second point, in radians
   * @param lon2     The x coordinate of the second point, in radians
   * @return The distance between the two points, as determined by the Haversine formula, in radians.
   */
  public static double distHaversineRAD(double lat1, double lon1, double lat2, double lon2) {
    //TODO investigate slightly different formula using asin() and min() http://www.movable-type.co.uk/scripts/gis-faq-5.1.html
 
    // Check for same position
    if (lat1 == lat2 && lon1 == lon2)
      return 0.0;
    double hsinX = Math.sin((lon1 - lon2) * 0.5);
    double hsinY = Math.sin((lat1 - lat2) * 0.5);
    double h = hsinY * hsinY +
            (Math.cos(lat1) * Math.cos(lat2) * hsinX * hsinX);
    return 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }
```

[LBS定位技术](https://www.cnblogs.com/LBSer/p/3295642.html)
