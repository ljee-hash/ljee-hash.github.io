---
layout:     post
title:      "PV、TPS、QPS是怎么计算出来的？"
subtitle:   "服务器性能评价"
date:       2018-06-14 21:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-docker-with-markdown.jpg"
tags:
    - 性能
---


# PV、TPS、QPS是怎么计算出来的？

## 术语说明

术语说明：QPS = queries/sec = 查询数/秒

## QPS计算PV和机器的方式

QPS统计方式 [一般使用 http_load 进行统计]

QPS = 总查询数 / ( 进程总数 *   请求时间 )

QPS: 单个进程每秒请求服务器的成功次数

**单台服务器每天PV计算**

**公式1：**每天总PV = QPS * 3600 * 6

**公式2：**每天总PV = QPS * 3600 * 8

服务器计算服务器数量 =   ceil( 每天总PV / 单台服务器每天总PV )

## 峰值QPS和机器计算公式
  
**原理：**每天80%的访问集中在20%的时间里，这20%时间叫做峰值时间
  
**公式：**( 总PV数 * 80% ) / ( 每天秒数 * 20% ) = 峰值时间每秒查询数(QPS)
  
**机器：**峰值时间每秒QPS / 单台机器的QPS   = 需要的机器
  
**问：每天300w PV 的在单台机器上，这台机器需要多少QPS？**

答：( 3000000 * 0.8 ) / (86400 * 0.2 ) = 139 (QPS)

**问：如果一台机器的QPS是58，需要几台机器来支持？**

答：139 / 58 = 3

## 参考文献

https://en.wikipedia.org/wiki/Queries_per_second
https://www.zhihu.com/question/21556347

