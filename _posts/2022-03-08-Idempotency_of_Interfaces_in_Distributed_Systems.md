---
layout:     post
title:      "分布式系统中接口的幂等性"
subtitle:   "搜索引擎"
date:       2022-02-23 10:15:06
author:     "Ljeehash"
tags:
    - 分布式事务
    - TCC
---

# 分布式系统中接口的幂等性

- 业务场景介绍
- 总结与思考



# 业务场景

<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button>[\#](https://www.cnblogs.com/jajian/p/10926681.html#%E4%B8%9A%E5%8A%A1%E5%9C%BA%E6%99%AF)

公司有个借贷的项目，具体业务类似于阿里的蚂蚁借呗，用户在平台上借款，然后规定一个到期时间，在该时间内用户需将借款还清并收取一定的手续费，如果规定时间逾期未还上，则会产生滞纳金。

用户发起借款因此会产生一笔借款订单，用户可通过支付宝或在系统中绑定银行卡到期自动扣款等方式进行还款。还款流程都走支付系统，因此用户还款是否逾期以及逾期天数、逾期费等都通过系统来计算。

[![](https://img2018.cnblogs.com/blog/1162587/201905/1162587-20190526192901178-648957258.png)](https://img2018.cnblogs.com/blog/1162587/201905/1162587-20190526192901178-648957258.png)

但是在做订单系统的时候，遇到这样一个业务场景，由于业务原因允许用户通过线下支付宝还款，即我们提供一个公司官方的支付宝二维码，用户扫码还款，然后财务不定期的去拉取该支付宝账户下的还款清单并生成规范化的Excel表格录入到支付系统。

支付系统将这些支付信息生成对应的支付订单并落库，同时针对每笔还款记录生产一个消息信息到消息系统，消息的消费者就是订单系统。订单系统接受到消息后去结算当前用户的金额清算：先还本金，本金还清再还滞纳金，都还清则该笔订单结清并提升可借贷额度，……，整个流程大致如下：

[![](https://img2018.cnblogs.com/blog/1162587/201905/1162587-20190526192914978-1553300884.png)](https://img2018.cnblogs.com/blog/1162587/201905/1162587-20190526192914978-1553300884.png)

从上面的流程描述可以知道，相当于原来线上的支付现在转移到线下进行，这会产生一个问题：支付结算的不及时。例如用户的订单在今天19-05-27到期，但是用户在19-05-26还清，财务在19-05-27甚至更晚的时候从支付宝拉取清单录入支付系统。这样就造成了实际上用户是未逾期还清借款而我们这边却记录的是用户未还清且产生了滞纳金。

当然以上的是业务范畴的问题，我们今天要说的是支付系统发送消息到订单系统的环节中的一个问题。大家都知道为了避免消息丢失或者订单系统处理异常或者网络问题等问题，我们设计消息系统的时候都需要考虑消息持久化和消息的失败重试机制。

[![](https://img2018.cnblogs.com/blog/1162587/201905/1162587-20190526184548766-89193937.png)](https://img2018.cnblogs.com/blog/1162587/201905/1162587-20190526184548766-89193937.png)

对于重试机制，假如订单系统消费了消息，但是由于网络等问题消息系统未收到反馈是否已成功处理。这时消息系统会根据配置的规则隔段时间就 retry 一次。你 retry 一次没错，是为了保证系统的处理正常性，但是如果这时网络恢复正常，我第一次收到的消息成功处理了，这时我又收到了一条消息，如果没有做一些防护措施，会产生如下情况：用户付款一次但是订单系统计算了两次，这样会造成财务账单异常对不上账的情况发生。那就可能用户笑呵呵老板哭兮兮了。

# 接口幂等性

<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button>[\#](https://www.cnblogs.com/jajian/p/10926681.html#%E6%8E%A5%E5%8F%A3%E5%B9%82%E7%AD%89%E6%80%A7)

为了防止上述情况的发生，我们需要提供一个防护措施，对于同一笔支付信息如果我其中某一次处理成功了，我虽然又接收到了消息，但是这时我不处理了，即保证接口的 **幂等性**。

> **维基百科上的定义：**
>
> **幂等**（idempotent、idempotence）是一个数学与计算机学概念，常见于抽象代数中。
>
> **在编程中一个幂等操作的特点是其任意多次执行所产生的影响均与一次执行的影响相同。**幂等函数，或幂等方法，是指可以使用相同参数重复执行，并能获得相同结果的函数。这些函数不会影响系统状态，也不用担心重复执行会对系统造成改变。例如，“setTrue()”函数就是一个幂等函数,无论多次执行，其结果都是一样的，更复杂的操作幂等保证是利用唯一交易号(流水号)实现.

**任意多次执行所产生的影响均与一次执行的影响相同**，这是幂等性的核心特点。其实在我们编程中主要操作就是CURD，其中读取（Retrieve）操作和删除（Delete）操作是天然幂等的，受影响的就是创建（Create）、更新（Update）。

对于业务中需要考虑幂等性的地方一般都是接口的重复请求，重复请求是指同一个请求因为某些原因被多次提交。导致这个情况会有几种场景：

* **前端重复提交**：提交订单，用户快速重复点击多次，造成后端生成多个内容重复的订单。
* **接口超时重试**：对于给第三方调用的接口，为了防止网络抖动或其他原因造成请求丢失，这样的接口一般都会设计成超时重试多次。
* **消息重复消费**：MQ消息中间件，消息重复消费。

对于一些业务场景影响比较大的，接口的幂等性是个必须要考虑的问题，例如金钱的交易方面的接口。否则一个错误的、考虑不周的接口可能会给公司带来巨额的金钱损失，那么背锅的肯定是程序员自己了。

# 幂等性实现方式

<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button>[\#](https://www.cnblogs.com/jajian/p/10926681.html#%E5%B9%82%E7%AD%89%E6%80%A7%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F)

对于和web端交互的接口，我们可以在前端拦截一部分，例如防止表单重复提交，按钮置灰、隐藏、不可点击等方式。

但是前端做控制实际效益不是很高，懂点技术的都会模拟请求调用你的服务，所以安全的策略还是需要从后端的接口层来做。

那么后端要实现分布式接口的幂等性有哪些策略方式呢？主要可以从以下几个方面来考虑实现：

## Token机制

<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button>[\#](https://www.cnblogs.com/jajian/p/10926681.html#token%E6%9C%BA%E5%88%B6)

针对前端重复连续多次点击的情况，例如用户购物提交订单，提交订单的接口就可以通过 Token 的机制实现防止重复提交。

[![](https://img2020.cnblogs.com/blog/1162587/202007/1162587-20200701142807385-1283194170.png)](https://img2020.cnblogs.com/blog/1162587/202007/1162587-20200701142807385-1283194170.png)

主要流程就是：

1.  服务端提供了发送token的接口。我们在分析业务的时候，哪些业务是存在幂等问题的，就必须在执行业务前，先去获取token，服务器会把token保存到redis中。（微服务肯定是分布式了，如果单机就适用jvm缓存）。
2.  然后调用业务接口请求时，把token携带过去，一般放在请求头部。
3.  服务器判断token是否存在redis中，存在表示第一次请求，这时把redis中的token删除，继续执行业务。
4.  如果判断token不存在redis中，就表示是重复操作，直接返回重复标记给client，这样就保证了业务代码，不被重复执行。

## 数据库去重表

<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button>[\#](https://www.cnblogs.com/jajian/p/10926681.html#%E6%95%B0%E6%8D%AE%E5%BA%93%E5%8E%BB%E9%87%8D%E8%A1%A8)

往去重表里插入数据的时候，利用数据库的唯一索引特性，保证唯一的逻辑。唯一序列号可以是一个字段，例如订单的订单号，也可以是多字段的唯一性组合。例如设计如下的数据库表。

```sql
CREATE TABLE `t_idempotent` (
  `id` int(11) NOT NULL COMMENT 'ID',
  `serial_no` varchar(255)  NOT NULL COMMENT '唯一序列号',
  `source_type` varchar(255)  NOT NULL COMMENT '资源类型',
  `status` int(4) DEFAULT NULL COMMENT '状态',
  `remark` varchar(255)  NOT NULL COMMENT '备注',
  `create_by` bigint(20) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `modify_by` bigint(20) DEFAULT NULL COMMENT '修改人',
  `modify_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
  UNIQUE KEY `key_s` (`serial_no`,`source_type`, `remark`)  COMMENT '保证业务唯一性'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='幂等性校验表';
```

我们注意看如下这几个关键性字段，

* serial_no：唯一序列号的值，在这里我设置的是通过注解`@IdempotentKey`来标识请求对象中的字段，通过对他们 MD5 加密获取对应的值。
* source_type：业务类型，区分不同的业务，订单，支付等。
* remark：是由标识字段的拼接成的字符串，拼接符为 “|”。

由于数据建立了 `serial_no`,`source_type`, `remark` 三个字段组合构成的唯一索引，所以可以通过这个来去重达到接口的幂等性，具体的代码设计如下，

```java
public class PaymentOrderReq {

    /**
     * 支付宝流水号
     */
    @IdempotentKey(order=1)
    private String alipayNo;

    /**
     * 支付订单ID
     */
    @IdempotentKey(order=2)
    private String paymentOrderNo;

    /**
     * 支付金额
     */
    private Long amount;
}
```

因为支付宝流水号和订单号在系统中是唯一的，所以唯一序列号可由他们组合 MD5 生成，具体的生成方式如下：

```java
private void getIdempotentKeys(Object keySource, Idempotent idempotent) {
    TreeMap<Integer, Object> keyMap = new TreeMap<Integer, Object>();
    for (Field field : keySource.getClass().getDeclaredFields()) {
        if (field.isAnnotationPresent(IdempotentKey.class)) {
            try {
                field.setAccessible(true);
                keyMap.put(field.getAnnotation(IdempotentKey.class).order(),
                        field.get(keySource));
            } catch (IllegalArgumentException | IllegalAccessException e) {
                logger.error("", e);
                return;
            }
        }
    }
    generateIdempotentKey(idempotent, keyMap.values().toArray());
}
```

生成幂等Key，如果有多个key可以通过分隔符 "|" 连接，

```ljava
private void generateIdempotentKey(Idempotent idempotent, Object... keyObj) {
     if (keyObj.length == 0) {
         logger.info("idempotentkey is empty,{}", keyObj);
         return;
     }
     StringBuilder serialNo= new StringBuilder();
     for (Object key : keyObj) {
         serialNo.append(key.toString()).append("|");
     }
     idempotent.setRemark(serialNo.toString());
     idempotent.setSerialNo(md5(serialNo));
 }
```

一切准备就绪，则可对外提供幂等性校验的接口方法，接口方法为：

```java
public <T> void idempotentCheck(IdempotentTypeEnum idempotentType, T keyObj) throws IdempotentException {
    Idempotent idempotent = new Idempotent();
    getIdempotentKeys(keyObj, idempotent );
    if (StringUtils.isBlank(idempotent.getSerialNo())) {
        throw new ServiceException("fail to get idempotentkey");
    }
    idempotentEvent.setSourceType(idempotentType.name());
    try {
        idempotentMapper.saveIdempotent(idempotent);
    } catch (DuplicateKeyException e) {
        logger.error("idempotent check fail", e);
        throw new IdempotentException(idempotent);
    }
}
```

当然这个接口的方法具体在项目中合理的使用就看项目要求了，可以通过`@Autowire`注解注入到需要使用的地方，但是缺点就是每个地方都需要调用。我个人推荐的是自定义一个注解，在需要幂等性保证的接口上加上该注解，然后通过拦截器方法拦截使用。这样简单便不会造成代码侵入和污染。

另外，使用数据库防重表的方式它有个严重的缺点，那就是系统容错性不高，如果幂等表所在的数据库连接异常或所在的服务器异常，则会导致整个系统幂等性校验出问题。如果做数据库备份来防止这种情况，又需要额外忙碌一通了啊。

## Redis实现

<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button>[\#](https://www.cnblogs.com/jajian/p/10926681.html#redis%E5%AE%9E%E7%8E%B0)

上面介绍过防重表的设计方式和伪代码，也说过它的一个很明显的缺点。所以我们另外介绍一个Redis的实现方式。

Redis实现的方式就是将唯一序列号作为Key，唯一序列号的生成方式和上面介绍的防重表的一样，value可以是你想填的任何信息。唯一序列号也可以是一个字段，例如订单的订单号，也可以是多字段的唯一性组合。当然这里需要设置一个 key 的过期时间，否则 Redis 中会存在过多的 key。具体校验流程如下图所示，实现代码也很简单这里就不写了。

[![](https://img2018.cnblogs.com/blog/1162587/201905/1162587-20190526224227719-1701958206.png)](https://img2018.cnblogs.com/blog/1162587/201905/1162587-20190526224227719-1701958206.png)

由于企业如果考虑在项目中使用 Redis，因为大部分会拿它作为缓存来使用，那么一般都会是集群的方式出现，至少肯定也会部署两台Redis服务器。所以我们使用Redis来实现接口的幂等性是最适合不过的了。

## 状态机

<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button>[\#](https://www.cnblogs.com/jajian/p/10926681.html#%E7%8A%B6%E6%80%81%E6%9C%BA)

对于很多业务是有一个业务流转状态的，每个状态都有前置状态和后置状态，以及最后的结束状态。例如流程的待审批，审批中，驳回，重新发起，审批通过，审批拒绝。订单的待提交，待支付，已支付，取消。

以订单为例，已支付的状态的前置状态只能是待支付，而取消状态的前置状态只能是待支付，通过这种状态机的流转我们就可以控制请求的幂等。

```java
public enum OrderStatusEnum {

    UN_SUBMIT(0, 0, "待提交"),
    UN_PADING(0, 1, "待支付"),
    PAYED(1, 2, "已支付待发货"),
    DELIVERING(2, 3, "已发货"),
    COMPLETE(3, 4, "已完成"),
    CANCEL(0, 5, "已取消"),
    ;

    //前置状态
    private int preStatus;

    //状态值
    private int status;

    //状态描述
    private String desc;

    OrderStatusEnum(int preStatus, int status, String desc) {
        this.preStatus = preStatus;
        this.status = status;
        this.desc = desc;
    }

    //...
}
```

假设当前状态是已支付，这时候如果支付接口又接收到了支付请求，则会抛异常或拒绝此次处理。

# 总结

<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button>[\#](https://www.cnblogs.com/jajian/p/10926681.html#%E6%80%BB%E7%BB%93)

通过以上的了解我们可以知道，针对不同的业务场景我们需要灵活的选择幂等性的实现方式。

例如防止类似于前端重复提交、重复下单的场景就可以通过 Token 的机制实现，而那些有状态前置和后置转换的场景则可以通过状态机的方式实现幂等性，对于那些重复消费和接口重试的场景则使用数据库唯一索引的方式实现更合理。
