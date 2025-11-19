---
layout:     post
title:      "jvm调优"
subtitle:   "jvm调优"
date:       2018-11-19 11:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-autodeployed-with-markdown.jpg"
tags:
    - jvm虚拟机
---

# jvm调优

## jvm查询CPU利用率高的线程

1.使用top 定位到占用CPU高的进程PID

```shell
top 
```
通过ps aux | grep PID命令


2.获取线程信息，并找到占用CPU高的线程

```
ps -mp pid -o THREAD,tid,time | sort -rn 
```

3.将需要的线程ID转换为16进制格式

```
printf "%x\n" tid
```

4.打印线程的堆栈信息

```
jstack pid |grep tid -A 30
```

## 线程池调优

### 实际应用实际使用中并发线程数如何设置呢？

那么实际使用中并发线程数如何设置呢？分析如下[1]：

Nthreads=Ncpu*(1+w/c)

IO密集型：一般情况下，如果存在IO，那么肯定w/c>1（阻塞耗时一般都是计算耗时的很多倍）,但是需要考虑系统内存有限（每开启一个线程都需要内存空间），这里需要上服务器测试具体多少个线程数适合（CPU占比、线程数、总耗时、内存消耗）。如果不想去测试，保守点取1即，Nthreads=Ncpu*(1+1)=2Ncpu。这样设置一般都OK。

计算密集型：假设没有等待w=0，则W/C=0. Nthreads=Ncpu。

至此结论就是：

IO密集型=2Ncpu（可以测试后自己控制大小，2Ncpu一般没问题）（常出现于线程中：数据库数据交互、文件上传下载、网络数据传输等等）

计算密集型=Ncpu（常出现于线程中：复杂算法）

java中：Ncpu=Runtime.getRuntime().availableProcessors()

=========================此处可略过=============================================

当然派系一种《Java Concurrency in Practice》还有一种说法，

> 即对于计算密集型的任务，在拥有N个处理器的系统上，当线程池的大小为N+1时，通常能实现最优的效率。(即使当计算密集型的线程偶尔由于缺失故障或者其他原因而暂停时，这个额外的线程也能确保CPU的时钟周期不会被浪费。)
> 即，计算密集型=Ncpu+1，但是这种做法导致的多一个cpu上下文切换是否值得，这里不考虑。读者可自己考量。

===============================================================================


## 更新

Arthas 使用

1、切到admin用户

sudo -s

su - admin

2、下载预发环境下载工具包：

wget http://xx(可下载域名的地址)/arthas-packaging-3.6.2-bin.zip

3、安装运行

unzip arthas-packaging-3.6.2-bin.zip

java -jar arthas-boot.jar

dump 内存： heapdump /export/synworker.hprof


4、查看效果

输入dashboard

5、更多arthas使用手册

https://alibaba.github.io/arthas/advanced-use.html#profiler

## 常用命令

获取线程信息，并找到占用CPU高的线程
```bash
# 查看TOP5的
thread -n 30

# 如果看到NetworkInterface相关线程阻塞
thread tid  # 直接查看详细堆栈


# 内置实时监控
thread -n 3 -i 5000  # 每5秒刷新


# 查找死锁线程
thread -b
# 或
thread --blocked-thread


按状态查看线程
# 查看所有BLOCKED状态的线程
thread --state BLOCKED

# 查看WAITING状态的线程
thread --state WAITING

# 查看TIMED_WAITING状态的线程
thread --state TIMED_WAITING


# 实时监控线程状态
# 每2秒刷新一次，显示前10个线程
thread -n 10 -i 2000

# 持续监控BLOCKED线程
watch -n 2 'thread --state BLOCKED'
```

# 参考文献

[1][如何根据CPU核心数确定线程池并发线程数?](https://www.cnblogs.com/dennyzhangdd/p/6909771.html)




