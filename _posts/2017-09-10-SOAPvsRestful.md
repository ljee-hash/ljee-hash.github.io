---
layout:     post
title:      "理解RESTful架构和SOAP协议"
subtitle:   "面向对象,REST，SOAP"
date:       2017-01-20 17:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-SOAPvsRestful.pngg"
tags:
    - OOA
    - Tree
---



## 引言

W3C通常将Web服务定义为：
> 一种软件系统，旨在通过网络支持互操作的机器间机器交互。 
Web API也称为服务器端Web API是定义的请求 - 响应消息系统的编程接口，通常以JSON或XML形式，通过Web公开 - 最常见的方式是使用基于HTTP的Web服务器。

但是，到底什么是RESTful架构

## 起源

**REST**（英文：**Representational State Transfer**，又称**具象状态传输**）是Roy Thomas Fielding博士于2000年在他的博士论文[1] 中提出来的一种万维网软件架构风格，目的是便于不同软件/程序在网络（例如互联网）中互相传递信息。

## 优势

&emsp;&emsp;目前在三种主流的Web服务实现方案中，因为REST模式与复杂的SOAP和XML-RPC相比更加简洁，越来越多的web服务开始采用REST分割设计和实现。例如，[Amazon.com](https://zh.wikipedia.org/wiki/Amazon.com)提供接近[REST](https://zh.wikipedia.org/wiki/%E9%9B%85%E8%99%8E)风格的Web服务运行图书查询；雅虎提供的Web服务也是REST风格的。

## 实现和标准

首先针对web服务而言，是一种以服务为导向架构的技术，通过标准的web协议提供服务，目的是保证不同平台的应用服务可以互操作。

> 根据W3C的定义，Web服务(Web service)应当是一个软件系统，用于支持不同机器之间进行互操作。网络服务通常是由很多歌应用程序接口(API)所组成，他们通过网络，例如国际互联网（Internet）的远程服务器，执行客户段提交的请求。

Restful架构主要的目的辨识不同软件/程序在网络(例如互联网)中传递信息。

需要注意的是，REST是**设计风格而不是标准**。REST通常基于使用HTTP，URI，和XML以及HTML这些现有的广泛流行的协议和标准。

传输数据的过程，一般包括资源的定位，针对定位到的资源进行操作(通常有获取、创建、修改和删除操作)，然通过对应的操作进行执行，然后将数据进行组装展现。在Web服务中

- 资源是有URI来指定。
- 对资源的操作包括获取、创建、修改和删除，这些操作正好对应HTTP协议提供的GEP、POST、PUT和DELETE方法。
- 通过执行这些操作行为，对资源进行具体操作
- 资源的展现形式则是XML/JSON或者HTML，其取决与读者人还是机器，是消费web服务的客户软件还是web浏览器。当然也可以是任何其他的格式。


### REST的要求

- 客户端和服务器的结构(服务器架构要求Client-Server)

> 通信只能由客户端单方面发起，表现为请求-响应的形式。

- 连接协议具有无状态性(所有的状态都保存在服务器端Stateless)

> 通信的会话状态（Session State）应该全部由服务器负责维护。

- 能够利用Cache机制增进性能(合理使用HTTP提供静态缓存)

> 响应内容可以在通信链的某处被缓存，以改善网络效率。

- 一致性的操作界面

> 通信链的组件之间通过统一的接口相互通信，以提高交互的可见性。

- 层次化的系统

> 通过限制组件的行为（即每个组件只能“看到”与其交互的紧邻层），将架构分解为若干等级的层。

- 所需代码 - JavaScript（可选）

> 支持通过下载并执行一些代码（例如Java Applet、Flash或JavaScript），对客户端的功能进行扩展。

- 安全

> 此方面RESTful架构并未详细介绍。HTTP协议层提供两个简单的安全性，例如通过TLS的基本认证和通信加密。SOAP安全性通过WS-SECURITY进行了良好的标准化。HTTP并不安全。因此如果RESTful旭泰实现严格的安全性，必须要依赖传输协议实现。安全性并不是简单的认知和加密就可以解决的，还包括授权和完整性。当需要考虑此实现时，SOAP个人认为是最佳的考虑

## 综述

综合上面上述过程，我们总结下什么是RESTful架构
    
    1. 每一个URI代表一种资源
    2. 客户端和服务器之间，传递对资源的操作
    3. 客户单通过HTTP动词，对服务器段资源进行操作，实现状态转化。
    
    
## REST的优点

- 可更高效利用缓存来提高响应速度
- 通讯本身的无状态性可以让不同的服务器的处理一系列请求中的不同请求，提高服务器的扩展性
- 浏览器即可作为客户端，简化软件需求
- 相对于其他叠加在HTTP协议之上的机制，REST的软件依赖性更小
- 不需要额外的资源发现机制
- 在软件技术演进中的长期的兼容性更好

## 如何在Web服务中使用这种架构


匹配REST设计风格的Web API成为RESTful API。它从一下三个方面对资源进行定义
- 直观简短的资源地址：URI 。比如:http://example.com/resources/（资源）
- 传输的资源：Web服务接受与返回的互联网媒体类型，比如：JSON，XML，YAML等。(展现)
- 对资源的操作：Web服务在该资源上所支持的一系列请求方法（比如：POST，GET，PUT或DELETE）。(操作动作)


> 引用wiki上面的记录，现RESTful API时HTTP请求方法的典型用途






资源 | GET | PUT | POST |DELETE
---|---|---|---|---
**一组资源的URI，比如http://example.com/resources/** | **列出**URI，以及该资源组中每个资源的详细信息（后者可选）。| 使用给定的一组资源**替换**当前整组资源。|	在本组资源中**创建/追加**一个新的资源。该操作往往返回新资源的URL。 | **删除**整组资源
**单个资源的URI，比如http://example.com/resources/142**|**获取**指定的资源的详细信息，格式可以自选一个合适的网络媒体类型（比如：XML、JSON等）|**替换/创建**指定的资源。并将其追加到相应的资源组中。|把指定的资源当做一个资源组，并在其下***创建/追加**一个新的元素，使其隶属于当前资源。|**删除**指定的元素。


说明:

```bash
PUT和DELETE方法是幂等方法。GET方法是安全方法（不会对服务器端有修改，因此当然也是幂等的）。
不像基于SOAP的Web服务，RESTful Web服务并没有“正式”的标准[4]。这是因为REST是一种架构，而SOAP只是一个协议。虽然REST不是一个标准，但大部分RESTful Web服务实现会使用HTTP、URI、JSON和XML等各种标准。
```

## 实现参考

例如，一个简单的网络商店应用，列举所有商品，

```bash
GET http://www.store.com/products
```

呈现某一件商品，


```bash
GET http://www.store.com/product/12345
```

下单购买，

```
POST http://www.store.com/order
```

```xml
//xml传输
<purchase-order>
  <item> ... </item>
</purchase-order>
```
```json
//json传输
{
    purchase-order : {
        item : ..
    }
}
```

## 实现框架


- Ruby on Rails1.2以后的版本支持REST model。
- JBoss RESTEasyJBoss的REST实现
- Node.js RESTful APINode.js实现RESTful API

## 参考文献

### 引用
1. https://zh.wikipedia.org/wiki/REST#.E8.A6.81.E7.82.B9.E5.8F.8A.E6.A0.87.E5.87.86
2. http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm Roy Thomas Fielding的博士论文《Architectural Styles and the Design of Network-based Software Architectures》










## RESTful架构有一些典型的设计误区。

**最常见的一种设计错误**，**就是URI包含动词**。因为"资源"表示一种实体，所以应该是名词，URI不应该有动词，动词应该放在HTTP协议中。

举例来说，某个URI是/posts/show/1，其中show是动词，这个URI就设计错了，正确的写法应该是/posts/1，然后用GET方法表示show。

如果某些动作是HTTP动词表示不了的，你就应该把动作做成一种资源。比如网上汇款，从账户1向账户2汇款500元，错误的URI是：

```
　　POST /accounts/1/transfer/500/to/2
```

正确的写法是把动词transfer改成名词transaction，资源不能是动词，但是可以是一种服务：

```
　　POST /transaction HTTP/1.1
　　Host: 127.0.0.1
　　
　　from=1&to=2&amount=500.00
```

另一个设计误区，就是在URI中加入版本号：

```
http://www.example.com/app/1.0/foo
http://www.example.com/app/1.1/foo
http://www.example.com/app/2.0/foo
```

因为不同的版本，可以理解成同一种资源的不同表现形式，所以应该采用同一个URI。版本号可以在HTTP请求头信息的Accept字段中进行区分（参见Versioning REST Services）：

```
　　Accept: vnd.example-com.foo+json; version=1.0
　　Accept: vnd.example-com.foo+json; version=1.1
　　Accept: vnd.example-com.foo+json; version=2.0
```
