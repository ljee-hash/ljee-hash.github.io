---
layout:     post
title:      "Zookeeper工作原理"
subtitle:   "机器学习"
date:       2018-10-19 11:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-autodeployed-with-markdown.jpg"
tags:
    - 机器学习
    - 自动化部署
---





# Apache ZooKeeper的zNode数据限制大小是多少？

1GB？10MB？1KB？

zNode Limit = 1MB。

这是ZooKeeper中单个zNode或键/值对的默认大小。应该注意的是，密钥和值都被合并到这个等式中。ZooKeeper被设计为用于小键的高读取，高吞吐量系统。它不是设计为容纳非常大的数据值的大型数据存储。因此，此1MB值是默认配置选项，可以覆盖。建议不要这样做 - 但是增加一点尺寸可能不会损坏您的系统（这完全取决于您的独特访问模式，这些更改应谨慎进行，风险自负）。


## 估算ZK默认1MB可存储多少数据

1M=1024k=1048576字节
算法是： 
8bit(位)=1Byte(字节) 
1024Byte(字节)=1KB 
1024KB=1MB 
1024MB=1GB 
1024GB=1TB 
一个汉字要占用2个字节 
一个汉字要占用1个字节 


```

-- 存储中文
1MB =1024KB = 1024*1024Byte =1024*1024*8/4=524,288个汉字

-- 存储英文
1MB =1024KB = 1024*1024Byte =1024*1024*8/1=1,048,576个汉字

Notes

(utf-8)

1个中文=3~4字节
1个中文标点=3字节
1个英文字母= 1字节
1个英文标点= 1字节


```

[UTF-8 编码里，一个汉字占用多少个字节？](https://hev.cc/257.html)



## 存储json

```
{"bizType":"dragDown","skinId":"skin_392","startTime":"2018-11-27 04:00:00","endTime":"2019-11-30 00:00:05","on":0}
```

这串json，占用115字节，存储1000个json传占用多少内存？

115*1000*8 = 920,000 =~ 1MB




## 附录

一些时候你会被要求做出保守估计。比如，你可能需要估计从磁盘中生成 100 张图片的缩略图需要的时间或者一个数据结构需要多少的内存。**2 的次方表**和**每个开发者都需要知道的一些时间数据**（译注：OSChina 上有这篇文章的[译文](https://www.oschina.net/news/30009/every-programmer-should-know)）都是一些很方便的参考资料。

### 2 的次方表

```
Power           Exact Value         Approx Value        Bytes
---------------------------------------------------------------
7                             128
8                             256
10                           1024   1 thousand           1 KB
16                         65,536                       64 KB
20                      1,048,576   1 million            1 MB
30                  1,073,741,824   1 billion            1 GB
32                  4,294,967,296                        4 GB
40              1,099,511,627,776   1 trillion           1 TB
```

#### 来源及延伸阅读

* [2 的次方](https://en.wikipedia.org/wiki/Power_of_two)

### 每个程序员都应该知道的延迟数

```
Latency Comparison Numbers
--------------------------
L1 cache reference                           0.5 ns
Branch mispredict                            5   ns
L2 cache reference                           7   ns                      14x L1 cache
Mutex lock/unlock                          100   ns
Main memory reference                      100   ns                      20x L2 cache, 200x L1 cache
Compress 1K bytes with Zippy            10,000   ns       10 us
Send 1 KB bytes over 1 Gbps network     10,000   ns       10 us
Read 4 KB randomly from SSD*           150,000   ns      150 us          ~1GB/sec SSD
Read 1 MB sequentially from memory     250,000   ns      250 us
Round trip within same datacenter      500,000   ns      500 us
Read 1 MB sequentially from SSD*     1,000,000   ns    1,000 us    1 ms  ~1GB/sec SSD, 4X memory
Disk seek                           10,000,000   ns   10,000 us   10 ms  20x datacenter roundtrip
Read 1 MB sequentially from 1 Gbps  10,000,000   ns   10,000 us   10 ms  40x memory, 10X SSD
Read 1 MB sequentially from disk    30,000,000   ns   30,000 us   30 ms 120x memory, 30X SSD
Send packet CA->Netherlands->CA    150,000,000   ns  150,000 us  150 ms

Notes
-----
1 ns = 10^-9 seconds
1 us = 10^-6 seconds = 1,000 ns
1 ms = 10^-3 seconds = 1,000 us = 1,000,000 ns
```

基于上述数字的指标：
* 从磁盘以 30 MB/s 的速度顺序读取
* 以 100 MB/s 从 1 Gbps 的以太网顺序读取
* 从 SSD 以 1 GB/s 的速度读取
* 以 4 GB/s 的速度从主存读取
* 每秒能绕地球 6-7 圈
* 数据中心内每秒有 2,000 次往返

```
L1 cache ：………………………………………………..0.5ns
branch mispredict(转移、分支预测) : ……………..5ns
L2 cache :………………………………………………… 7ns
互斥锁\解锁 :…………………………………………….. 25ns
1k字节压缩(Zippy) : …………………………………….3000ns = 3us
在1Gbps的网络上发送2k字节 : ……………………….20,000ns = 20us
SSD随机读 ：……………………………………………..150,000ns = 150us
从内存顺序读取1MB ：…………………………………250,000ns = 250 us
同一个数据中心往返 ：………………………………….500,000ns = 0.5ms
从SSD顺序读取1MB ： …………………………………1,000,000ns = 1ms
磁盘搜索:…………………………………………………..10,000,000ns = 10ms
从磁盘里面读出1MB : …………………………………..20，000，000ns = 20ms
```


#### 延迟数可视化

![](https://camo.githubusercontent.com/77f72259e1eb58596b564d1ad823af1853bc60a3/687474703a2f2f692e696d6775722e636f6d2f6b307431652e706e67)

#### 来源及延伸阅读

* [每个程序员都应该知道的延迟数 — 1](https://gist.github.com/jboner/2841832)
* [每个程序员都应该知道的延迟数 — 2](https://gist.github.com/hellerbarde/2843375)
* [关于建设大型分布式系统的的设计方案、课程和建议](http://www.cs.cornell.edu/projects/ladis2009/talks/dean-keynote-ladis2009.pdf)
* [关于建设大型可拓展分布式系统的软件工程咨询](https://static.googleusercontent.com/media/research.google.com/en//people/jeff/stanford-295-talk.pdf)

