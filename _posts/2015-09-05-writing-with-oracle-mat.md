---
layout:     post
title:      "物化视图的快速刷新测试与物化视图日志"
subtitle:   "物化视图,Oracle"
date:       2017-09-01 10:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - Oracle 
    - database
    - SQL
---

# 物化视图的快速刷新测试与物化视图日志

## 前言
> &emsp;&emsp;一般在创建物化视图的时候，在数据量不大的时候，刷新的方式都是采用完全刷新的。随着系统的使用一些物化视图的源表的数据量在不断的增长，原本采用完全方式几秒就能刷新完成的物化视图，现在需要等待很久的时间才能刷新完成。其实物化视图从一开始就帮我们想好了解决方法：通过物化视图日志来实现物化视图的快速刷新；

## 一、物化视图日志的介绍

### 1.1 物化视图快速刷新的原理

&emsp;&emsp;要先了解完全刷新的原理是先把物化视图的数据全部删除，然后再把基表的数据插入到物化视图中；但是当数据达到百万级别的数据时，如果源表更新了一条数据，完全刷新就得删除物化视图的所有数据再进行插入;

&emsp;&emsp;而快速刷新，会保留物化视图的数据，然后基表的所有数据的变更记录到物化视图日志中。这样如果源表数据还是百万级别，且这个时候更新了一条数据，物化视图刷新的过程中根据物化视图的日志，只要更新修改的那条特定记录，便可达到快速刷新的作用;

&emsp;&emsp;简单来讲，物化视图日志就是一个数据库引擎自动伟华的表，用来跟踪基表发生的变更；


### 1.2 物化视图的刷新方式、

&emsp;&emsp;我们知道如果需要进行快速刷新，则需要建立物化视图日志。Oracle物化视图日志根据不同物化视图的快速刷新的需要，可以建立为ROWID或PRIMARY KEY类型的。还可以选择是否包括SEQUENCE、INCLUDING NEW VALUES以及指定列的列表。

## 二、物化视图快速刷新的测试

### 2.1 创建一个基表

```sql
CREATE TABLE T_JOHN
(
  NAME          VARCHAR2(20 BYTE),
  SALE            VARCHAR2(20 BYTE),
)
TABLESPACE USERS
RESULT_CACHE (MODE DEFAULT)
PCTUSED    0
PCTFREE    10
INITRANS   1
MAXTRANS   255
STORAGE    (
            INITIAL          64K
            NEXT             1M
            MINEXTENTS       1
            MAXEXTENTS       UNLIMITED
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
            FLASH_CACHE      DEFAULT
            CELL_FLASH_CACHE DEFAULT
           )
LOGGING
NOCOMPRESS
NOCACHE
NOPARALLEL
MONITORING;
```

### 2.2 创建物化视图MV_JOHN

```sql
CREATE MATERIALIZED VIEW MV_JOHN (NAME,SALE)
TABLESPACE USERS
PCTUSED    0
PCTFREE    10
INITRANS   2
MAXTRANS   255
STORAGE    (
            INITIAL          64K
            NEXT             1M
            MINEXTENTS       1
            MAXEXTENTS       UNLIMITED
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
            FLASH_CACHE      DEFAULT
            CELL_FLASH_CACHE DEFAULT
           )
NOCACHE
LOGGING
NOCOMPRESS
NOPARALLEL
BUILD IMMEDIATE
USING INDEX
            TABLESPACE USERS
            PCTFREE    10
            INITRANS   2
            MAXTRANS   255
            STORAGE    (
                        INITIAL          64K
                        NEXT             1M
                        MINEXTENTS       1
                        MAXEXTENTS       UNLIMITED
                        PCTINCREASE      0
                        BUFFER_POOL      DEFAULT
                        FLASH_CACHE      DEFAULT
                        CELL_FLASH_CACHE DEFAULT
                       )
REFRESH FAST ON DEMAND
WITH ROWID
AS
SELECT NAME,SALE
  FROM T_JOHN;
```


### 2.3 创建物化视图日志

```sql

CREATE MATERIALIZED VIEW LOG ON T_JOHN
TABLESPACE USERS
PCTUSED    0
PCTFREE    10
INITRANS   2
MAXTRANS   255
STORAGE    (
            INITIAL          64K
            NEXT             1M
            MINEXTENTS       1
            MAXEXTENTS       UNLIMITED
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
            FLASH_CACHE      DEFAULT
            CELL_FLASH_CACHE DEFAULT
           )
NOCACHE
LOGGING
NOPARALLEL
WITH ROWID
/*WITH ROWID*/
EXCLUDING NEW VALUES;
/*
WITH ROWID：通过ROWID的方式，刷新物化视图；
*/
```

### 2.4 以上完成后,便可以在基表上面进行数据的修改;

&emsp;&emsp;运行手工刷新后，可以查看物化视图的数据也更新了；

```sql
Begin
    Dbms_mView.Refresh('MV_JOHN');
End;
```

## 三、物化视图管理

### 3.1 ORACLE提供了视图USER_MVIEW_LOGS可以查看，用户下物化视图的刷新情况

![](http://blog.itpub.net/attachment/201411/12/12679300_1415783878KaT3.png)

&emsp;&emsp;物化视图日志的名称为MLOG$_后面跟基表的名称，如果表名的长度超过20位，则只取前20位，当截短后出现名称重复时，Oracle会自动在物化视图日志名称后面加上数字作为序号。

### 3.2 MLOG$_T_WZQ

```sql
--这是一个primarykey的物化视图日志：
desc  MLOG$_T_WZQ

/*
相关解释如下：
SNAPTIME$$：用于表示刷新时间。
DMLTYPE$$：用于表示DML操作类型，I表示INSERT，D表示DELETE，U表示UPDATE。
OLD_NEW$$：用于表示这个值是新值还是旧值。N（EW）表示新值，O（LD）表示旧值，U表示UPDATE操作。
CHANGE_VECTOR$$：表示修改矢量，用来表示被修改的是哪个或哪几个字段。
*/

```
&emsp;&emsp; 当刷新完成后MLOG$_T_WZQ相应的日志也会被清除了,因为这些日志已经没有保存的必要了;

## 四、总结
&emsp;&emsp;物化视图是一把利器，在调优的过程中会经常用到，快速刷新也只是物化视图众多功能中很小的一个，随着业务场景的增加和数据量的增长相信用到物化视图的地方也会越来越多；
