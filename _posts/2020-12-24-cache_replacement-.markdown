---
layout:     post
title:      "缓存"
subtitle:   "缓存替换策略"
date:       2020-12-24 10:15:06
author:     "Ljeehash"
tags:
    - 缓存
    - 本地缓存
---


# 缓存（Cache）

![缓存](https://camo.githubusercontent.com/132a83c9c2d3a908c232f4463cb968dee544f46b9270166d7dbe325b9f873169/687474703a2f2f692e696d6775722e636f6d2f51367a32344c612e706e67)

缓存可以提高系统的加载速度，可以减少服务器和数据库的负载。在这个模型中，分发器先查看请求之前是否被响应过，如果有则将之前的结果直接返回，来省掉服务的调用（the actual execution）

数据库分片均匀分布的读取是最好的，但是热点数据会让读取分布不均匀，这样就会造成瓶颈，如果在数据库之前加入缓存，就会抹平不均匀的负载和突发流量(absorb uneven loads)对数据库的影响


# 何时更新缓存（When to update the cache）

由于只能在缓存中存储有限的数据，所以需要选择一个适用于业务场景的缓存更新测刘鹗


# 缓存模式（Cache-aside）

![资料来源：从缓存到内存数据网格](https://camo.githubusercontent.com/dfc9d3407cadd0d22ab93a46273f7329a1866b78c607b20b225f3c1918ef2d4a/687474703a2f2f692e696d6775722e636f6d2f4f4e6a4f52716b2e706e67)


应用从存储器读写。缓存不和存储器直接交互，应用执行一下操作：

- 在缓存中查找记录，如果所需数据不在缓存中
- 从数据库中加载所需内容
- 将查到的结果存储到缓存中
- 返回所需内容

```python
def get_user(self, user_id):
    user = cache.get("user.{0}", user_id)
    if user is None:
        user = db.query("SELECT * FROM users WHERE user_id = {0}", user_id)
        if user is not None:
            key = "user.{0}".format(user_id)
            cache.set(key, json.dumps(user))
    return user
```

Memcached 通常用这种方式使用。

添加到缓存中的数据读取速度很快。缓存模式也称为延迟加载。只缓存所请求的数据，这避免了没有被请求的数据占满了缓存空间。

缓存的缺点：

- 请求的数据如果不在缓存中就需要经过三个步骤来获取数据，这会导致明显的延迟。
- 如果数据库中的数据更新了会导致缓存中的数据过时。这个问题需要通过设置超时时间TTL,强制更新缓存或者直写模式来缓解这种情况。
- 当一个节点出现故障的时候，它将会被一个新的节点替代，这增加了延迟的时间。


# 直写模式(Write-through)

![直写模式](https://camo.githubusercontent.com/7bba5214ac7c60d31b9621bbb3b9350067d9533e7f372495b2a01b6b2a0032d3/687474703a2f2f692e696d6775722e636f6d2f3076426330684e2e706e67)

应用使用缓存作为主要的数据存储，将数据读写到缓存中，而缓存负责从数据库中读写数据。

- 应用向缓存中添加/更新数据
- 缓存同步地写入数据存储
- 返回所需内容


应用代码：

```python
set_user(12345, {"foo":"bar"})
```

缓存代码：

```
def set_user(user_id, values):
    user = db.query("UPDATE Users WHERE id = {0}", user_id, values)
    cache.set(user_id, user)
```
由于存写操作所以直写模式整体是一种很慢的操作，但是读取刚写入的数据很快。相比读取数据，用户通常比较能接受更新数据时速度较慢。缓存中的数据不会过时。

**直写模式的缺点：**

- 由于故障或者缩放而创建的新的节点，新的节点不会缓存，直到数据库更新为止。缓存应用直写模式可以缓解这个问题。
- 写入的大多数数据可能永远都不会被读取，用 TTL 可以最小化这种情况的出现。

# 回写模式【Write-behind (write-back)】

![回写模式](https://camo.githubusercontent.com/2b5d4a5cc43c7808320d8e48f55d6a3e3581eaf618e5469768e7136f06d67523/687474703a2f2f692e696d6775722e636f6d2f72675372766a472e706e67)

在回写模式中，应用执行以下操作：

- 在缓存中增加或者更新条目
- 异步写入数据，提高写入性能

**回写模式的缺点：**

- 缓存可能在其内容成功存储之前丢失数据。
- 执行直写模式比缓存或者回写模式更复杂。


# 刷新【Refresh-ahead】

![刷新](https://camo.githubusercontent.com/9260345bcd014968a54f5005e0c9e2abdf76d2af2f7504423329ff15d0e12e89/687474703a2f2f692e696d6775722e636f6d2f6b78746a7167452e706e67)

你可以将缓存配置成在到期之前自动刷新最近访问过的内容。

如果缓存可以准确预测将来可能请求哪些数据，那么刷新可能会导致延迟与读取时间的降低。

**刷新的缺点：**

- 不能准确预测到未来需要用到的数据可能会导致性能不如不使用刷新。

# 缓存的缺点：

- 需要保持缓存和真实数据源之间的一致性，比如数据库根据缓存无效。
- 需要修改程序代码，比如增加 Redis 或者 memcached。
- 无效缓存是个难题，什么时候更新缓存是与之相关的复杂问题。

## 扩展阅读(Source(s) and further reading)

- [From cache to in-memory data grid](http://www.slideshare.net/tmatyashovsky/from-cache-to-in-memory-data-grid-introduction-to-hazelcast)
- Scalable system design patterns
- Introduction to architecting systems for scale
- Scalability, availability, stability, patterns
- Scalability
- AWS ElastiCache strategies
- Wikipedia


## 拓展之一 —— 内存数据网格（IMDG）服务

### IMDG简介

将内存作为首要存储介质不是什么新鲜事儿，我们身边有很多主存数据库([IMDB](https://en.wikipedia.org/wiki/In-memory_database)或MMDB)的例子。在对主存的使用上，内存数据网格(In Memory Data Grid，IMDG)与IMDB类似，但二者在架构上完全不同。IMDG特性可以总结为以下几点：

- 数据是分布式存储在多台服务器上的。
- 每台服务器都是active模式。
- 数据模型通常是面向对象和非关系型的。
- 根据需要，经常会增减服务器。

换言之，**IMDG将对象本身存储在内存中，并保证可扩展性。**




# 缓存替换策略

[缓存替换策略](https://en.wikipedia.org/wiki/Cache_replacement_policies#Overview)




