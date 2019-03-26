---
layout:     post
title:      "ORACLE物化视图应用"
subtitle:   "物化视图,Oracle"
date:       2017-09-01 10:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - Oracle 
    - 数据库
---




# ORACLE物化视图应用

> &emsp;&emsp;物化视图是一种特殊的物理表，“物化”(Materialized)视图是相对普通视图而言的。普通视图是虚拟表，应用的局限性大，任何对视图的查询，Oracle都实际上转换为视图SQL语句的查询。这样对整体查询性能的提高，并没有实质上的好处。 


## 1、物化视图的类型：++*ON DEMAND*++、++*ON COMMIT*++ 
 &emsp;&emsp;二者的区别在于刷新方法的不同，ON DEMAND顾名思义，仅在该物化视图“需要”被刷新了，才进行刷新(REFRESH)，即更新物化视图，以保证和基表数据的一致性；而ON COMMIT是说，一旦基表有了COMMIT，即事务提交，则立刻刷新，立刻更新物化视图，使得数据和基表一致。
 ##   2、ON DEMAND物化视图 
 
 
 &emsp;&emsp;物化视图的创建本身是很复杂和需要优化参数设置的，特别是针对大型生产数据库系统而言。但Oracle允许以这种最简单的，类似于普通视图的方式来做，所以不可避免的会涉及到默认值问题。也就是说Oracle给物化视图的重要定义参数的默认值处理是我们需要特别注意的。
 
 ## 物化视图的特点： 
 
1.  物化视图在某种意义上说就是一个物理表(而且不仅仅是一个物理表)，这通过其可以被user_tables查询出来，而得到佐证；
2.  物化视图也是一种段(segment)，所以其有自己的物理存储属性；
3. 物化视图会占用数据库磁盘空间，这点从user_segment的查询结果，可以得到佐证；

创建语句：
```sql
create materialized view mv_name as 
select * from table_name 
```

  &emsp;&emsp;默认情况下，如果没指定刷新方法和刷新模式，则Oracle默认为FORCE和DEMAND。 
 
 ### 物化视图的数据怎么随着基表而更新？ 
 
   &emsp;&emsp;Oracle提供了两种方式，手工刷新和自动刷新，默认为手工刷新。也就是说，通过我们手工的执行某个Oracle提供的系统级存储过程或包，来保证物化视图与基表数据一致性。这是最基本的刷新办法了。自动刷新，其实也就是Oracle会建立一个job，通过这个job来调用相同的存储过程或包，加以实现。 
   
 &emsp;&emsp; ON DEMAND物化视图的特性及其和ON COMMIT物化视图的区别，即前者不刷新(手工或自动)就不更新物化视图，而后者不刷新也会更新物化视图，——只要基表发生了COMMIT。
