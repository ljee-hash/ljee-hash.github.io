---
layout:     post
title:      " 轻量级桌面应用开发nw.js之五--在应用中如何数据持久化"
subtitle:   "nw.js入门,数据持久"
date:       2017-12-06 21:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-app-interface-test.jpg"
tags:
    - IDE
    - nw.js
---

# 在应用中如何数据持久化

## 引言

&emsp;&emsp;在本地应用中**数据持久化**是很常见的，++人们常使用嵌入外部数据库或写入txt文本的方式来保存数据++。然而，在node-webkit有更好的选择，你可以独立使用Web SQL Database, embedded databases, Web Storage 或者 Application Cache 而没有任何额外的依赖。

&emsp;&emsp;此外，nw.js提供了**App.dataPath**的方法可以准确获取到应用存储在本地的数据位置。

### Web SQL Database

&emsp;&emsp;**Web SQL Database**的API并不是HTM5规范的一部分而是自己拥有独立规范，它提供了一套使用SQL操作客户端数据库的方法。在介绍API之前，我们假设你基本熟悉SQL语句和用法。

&emsp;&emsp;**Web SQL Database**的API在node-webkit中**继承于sqlite**，在使用上基本一致：

```
openDatabase：该方法用于打开数据库对象。

transaction：该方法赋予我们执行相关数据库语句或者回滚的能力。

executeSql：该方法用于执行数据库语句。

```

&emsp;&emsp;如需要打开一个数据库，你可以使用一下代码：

```js

var db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
```

&emsp;&emsp;方法中包含了4个参数，分别是**数据库名称**、**版本号**、**数据库描述**和**数据库预估大小**。如果你想打开一个并不存在的数据库，该方法将会自动创建一个新的数据库，同时在你使用完成后并++不需要关闭数据库++。


&emsp;&emsp;创建一个表，插入数据和查询数据，你可以使用**transaction**和**executeSql**：

```
// Create table and insert one line
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)');
  tx.executeSql('INSERT INTO foo (id, text) VALUES (1, "synergies")');
  tx.executeSql('INSERT INTO foo (id, text) VALUES (2, "luyao")');
});

// Query out the data
db.transaction(function (tx) {
  tx.executeSql('SELECT * FROM foo', [], function (tx, results) {
    var len = results.rows.length, i;
    for (i = 0; i < len; i++) {
      alert(results.rows.item(i).text);
    }
  });
});
```
&emsp;&emsp;如果你想更深入了解Web SQL Database，可以参考：

```
http://html5doctor.com/introducing-web-sql-databases/
```

&emsp;&emsp;另外如果你需要了解++更多其他的DB存储++，如IndexedDB、PouchDB、EJDB、NeDB、LinvoDB、MarsDB、StoreDB和LowDB，你可以参考：

```
https://github.com/nwjs/nw.js/wiki/Save-persistent-data-in-app
```

### Web Storage

&emsp;&emsp;**Web storage**是一种简单地使用键值的存储方式，你可以像js对象一样直接使用它，++但是所有的数据都将会保存再你的硬盘里++。


&emsp;&emsp;**Web storage**有两种存储类型，分别是：

- **localStorage** ：++没有任何期限地存储数据++。

- **sessionStorage** ：++只在本次应用中存储数据++，当应用关闭后所有数据自动销毁。


&emsp;&emsp;它们的使用方法很简单，只需直接调用**localStorage** 对象或者**sessionStorage** 对象即可，如下：

**localStorage**
```
localStorage.love = "luyao";
// Love lasts forever
console.log(localStorage.love);

//如需移除一个键值项，可以使用
localStorage.removeItem("love");

```
**sessionStorage**

```
sessionStorage.life = "";
// But life will have an end
console.log(sessionStorage.life);
```

&emsp;&emsp;**注意**，想要使用**Web storage**来++存储大数据并不切合实际++，因为**API调用时同步的**，而且并**没有索引查询**，如果在++大量数据中执行相关操作将会变得非常的慢++。


### Application Cache

&emsp;&emsp;HTML5**支持应用缓存**，这意味着可以在没有任何额外连接的情况下进行数据存储。使用**Application Cache**

主要有以下++3个优势++：

1. 离线浏览：用户可以在断网的情况下继续浏览数据。
2. 速度：使用Application Cache存储速度将会更快。
3. 减少服务器负载：从服务器上下载过的资源可以重复使用。


**总结:**

&emsp;&emsp;**Application Cache**的设计是++主要用于浏览器用户++，**针对node-webkit用户**最好还是使用上面介绍的两种存储方式，如果想要深入了解**Application Cache**，可以参考：http://www.w3schools.com/html/html5_app_cache.asp


## 参考文献

http://m.blog.csdn.net/zeping891103/article/details/51085213