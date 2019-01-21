---
layout:     post
title:      "jvm查询"
subtitle:   "机器学习"
date:       2018-11-19 11:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-autodeployed-with-markdown.jpg"
tags:
    - jvm
---

# jvm查询

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
