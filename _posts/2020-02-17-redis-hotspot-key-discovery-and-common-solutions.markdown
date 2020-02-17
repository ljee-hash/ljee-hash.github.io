---
layout:     post
title:      "Redis热点Key发现及常见解决方案"
date:       2020-02-17 09:45:45
author:     "思考"
header-img: "img/post/post-bg-2020.png"
tags:
    - redis
---

中文版：
https://yq.aliyun.com/articles/672690

英文版：
https://www.alibabacloud.com/blog/redis-hotspot-key-discovery-and-common-solutions_594446?spm=a2c41.12559851.0.0

热点Key问题产生的原因大致有以下两种：

1、用户消费的数据远大于生产的数据（热卖商品、热点新闻、热点评论、明星直播）。

在日常工作生活中一些突发的的事件，例如：双十一期间某些热门商品的降价促销，当这其中的某一件商品被数万次点击浏览或者购买时，会形成一个较大的需求量，这种情况下就会造成热点问题。

同理，被大量刊发、浏览的热点新闻、热点评论、明星直播等，这些典型的读多写少的场景也会产生热点问题。

2、请求分片集中，超过单 Server 的性能极限。

在服务端读数据进行访问时，往往会对数据进行分片切分，此过程中会在某一主机 Server 上对相应的 Key 进行访问，当访问超过 Server 极限时，就会导致热点 Key 问题的产生。

pdf：
中文版
https://raw.githubusercontent.com/caozhilong/caozhilong.github.io/2b6d90b52c7a5d1fb4714521f0e20921fc3c80a3/file/Redis%E7%83%AD%E7%82%B9Key%E5%8F%91%E7%8E%B0%E5%8F%8A%E5%B8%B8%E8%A7%81%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88-%E4%BA%91%E6%A0%96%E7%A4%BE%E5%8C%BA-%E9%98%BF%E9%87%8C%E4%BA%91.pdf

英文版
https://render.githubusercontent.com/view/pdf?commit=2b6d90b52c7a5d1fb4714521f0e20921fc3c80a3&amp;enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f63616f7a68696c6f6e672f63616f7a68696c6f6e672e6769746875622e696f2f326236643930623532633761356431666234373134353231663065323039323166633363383061332f66696c652f5265646973253230486f7473706f742532304b6579253230446973636f76657279253230616e64253230436f6d6d6f6e253230536f6c7574696f6e732532302d253230416c6962616261253230436c6f7564253230436f6d6d756e6974792e706466&amp;nwo=caozhilong%2Fcaozhilong.github.io&amp;path=file%2FRedis+Hotspot+Key+Discovery+and+Common+Solutions+-+Alibaba+Cloud+Community.pdf


