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
