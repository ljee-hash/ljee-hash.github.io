---
layout:     post
title:      "Paxos理论介绍(1): 朴素Paxos算法理论推导与证明"
subtitle:   "Paxos理论"
date:       2018-06-14 21:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-docker-with-markdown.jpg"
tags:
    - 分布式设计
    - 分布式一致性算法
    - Paxos理论
---


# Paxos理论介绍(1): 朴素Paxos算法理论推导与证明

参见:

https://zhuanlan.zhihu.com/p/21438357?refer=lynncui

https://zhuanlan.zhihu.com/p/21466932?refer=lynncui

https://zhuanlan.zhihu.com/p/21540239

https://zhuanlan.zhihu.com/p/22148265

这篇文章摘取部分我在微信内部关于Paxos的分享PPT，通过注解的方式尝试与大家说明白朴素Paxos的理论证明。

## 为何要重点说朴素的Paxos？

个人认为这个才是Paxos的精髓所在，也是所有Paxos相关算法的基石所在。另外本文将着重讲解Paxos的算法推导过程，而不是运行过程。因为以我学习算法的经验来看，推导过程对于掌握一门算法至关重要，只有掌握了理论推导过程，才能明白这个算法每一个步骤的含义。


这些PPT内容大部分都引自Lamport的论文 "The Part-Time Parliament" .

> 这些PPT内容大部分都引自Lamport的论文 "The Part-Time Parliament" .


![Lamport的论文](https://caozhilong.github.io/img/arct/The-Part-Time-Parliament.png)

> 页1注解<br/>这是PPT的题图，摆在中间的正是Paxos最为重要的三条约束，掌握这三条约束，即可掌握朴素Paxos。
  

```




```


