---
layout:     post
title:      "动手写autotools编译"
date:       2020-04-04 09:45:45
author:     "动手写autotools"
tags:
    - 架构备考
---


## 基础知识准备


### 编译原理


```mermaid
graph TB
start[start]-- Source Code<br/> <.c,.cpp,.h><br/> Preprocessor <br/> <cpp>-->od
od[Preprocessing]-- Include Header,Expand Macro<br/>.i,.ii-->A
A[Compilation]-- Assembly Code <br/>.s-->B
B[Assemble]-- Machine Code < .o, .obj> -->C
C[Linking]-- Executable Machine Code <.exe>-->D[]
```

- Step1: Preprocessor (cpp)
- Step2: Compiler (gcc,g++)
- Step3: Assemble (as)
- Step4: Linker (ld)




### 编译环境

- 引擎

    - 编译语言： C/C++
    - Make工具： autotools
    - 第三方库： boost
    - CLI: C/C++
    - 平台： Linux x86_64
    - 链接方式: 静态

- 客户端驱动

1. Java


#### 操作系统

- Ubuntu

- 所需组件
    - 编译器： gcc , g++ ,gdb
    - 编辑器:  vim,eclipse
    - 自动编译工具: autotools
    - 源码包: boost,bson,gson
    - X11: x11-apps
    - Java: java1.6,log4j


#### 编译目录

- 主目录
    - prjName

- Boost目录
    - prjName/boost
    
- 源代码目录
    - prjName/src

- 编译脚本
    - Boost: build_boost.sh
    - 源代码: build.sh

- 授权协议
    - GNU-AGPL-3.0.txt






## 开始编码

**目录**

- 网络原理

- TCP/IP网络编程

- 客户端服务器模型

- 建立OSS层的套接字封装

- 客户端结构

- 服务器结构


### 网络原理


1. 计算机网络

> 是一种允许计算机之间实时通讯的机制


1. 计算机之间的物理连接可以是电缆，也可以是无线介质

1. 生成、转发以及销毁数据的网络设备被称为"网络节点"。网络节点可以为计算机、服务器、或者网络硬件、包括路由器、交换机等



#### 网络发展历史



![网络发展历史](img/arct/network-develop.png)



#### OSI模型

- Open System Interconnection model (ISO/IEC-7498-1)

- OSI将网络通讯抽象成7层

[自行google之]




#### IP协议

- IP网络互联协议

    - 为计算机网络互相连接进行通讯而设计的协议
    - 是一套由软件、程序所组成的协议，把不同系统的信息转换成统一的格式，使所有的网络节点能够实现互通
   
- IP协议在OSI模型建立之前存在，与OSI没有严格的关系

- 四层模型
    - 第一层： 链路层
    - 第二层： 连接层
    - 第三层： 传输层
    - 第四层： 应用层
    
 没有图、google之
 
 
**TCP协议**

- TCP协议是IP协议组件中的重要组成部分

    - Tcp 基于IP协议，提供了可靠、有序、错误校验的数据流，用于局域网和广域网中程序之间的信息交换
    - 坐落于IP四层协议中的传输层
    
[协议状态码图，自行google之]
  
 
 
**Socket套接字**

- 程序之间通讯流的终端

- 套接字API是一种应用程序开发的接口，一般由操作系统提供

    - 如今大多数系统使用IP协议，因此套接字主要是为Internet Socket
    
- 套接字地址一般为IP地址与端口的结合

    - 类似电话号码+分机号
    
- 主要由基本分构成

    - 本地IP地址与端口
    
    - 远程IP地址与端口（只实用于以及建立的TCP连接）
    
    - 协议（例如TCP、UDP）
    



程序建立流程



![程序建立流程](img/arct/socket-build-diagram.png)



**函数接口**

- socket() 创建一个新的套接字并分配系统资源

- bind() 一般用于服务端，将套接字与套接字地址（例如本地端口以及IP地址）绑定

- listen() 一般用于服务端，将绑定的Tcp置于监听状态

- connect() 一般用于客户端，分配一个本地的空闲端口，并且与远程地址建立连接

- accept() 一般用于服务端，接受一个新的连接请求，并创建一个与该链接绑定的套接字

- send() 与 recv() 或者 write() 与 read()，或 sendto()与recvfrom() 用于发送和接收数据

- close() 关闭一个打开的套接字并释放资源

- gethostbyname() 与 gethostbyaddr() 在IPv4协议中解析域名和地址

- select() 用于等待一个或者多个指定的套接字的下一个读写事件

- poll() 用于测试一个或者多个套接字的读写状态

- getsockopt() 得到指定套接字的参数

- setsockopt() 配置指定套接字的参数



**典型的服务端**


[23:05](https://www.bilibili.com/video/BV1ct411k7jn?p=4)

**典型的客户端逻辑**

[25:00](https://www.bilibili.com/video/BV1ct411k7jn?p=4)



套接字封装

ossSocket

[00:00](https://www.bilibili.com/video/BV1ct411k7jn?p=5)



### Tcp程序间的通讯

## 锁 Lock


- 和普通数据库的"锁"有严格的区别

    - 关系型数据库中的记录锁一般在数据库代码中实现
    - 系统锁很多在操作系统内核，结合硬件实现

- 锁的类型

    - 自旋锁SpinLock
    - 信号量Semaphore
    - 互斥量Mutex


- 为什么需要锁

    - 当多个并行任务同时读写共享资源
        -   需要确保资源在同一时间只被一个任务使用
        -   确保一个任务修改资源时其他任务不可访问
        
    - CPU架构的区别
        -   单CPU结构
        -   多CPU结构
        
        
 [05:27]https://www.bilibili.com/video/BV1ct411k7jn?p=8
 
- CPU缓存

    -   缓存散列机制 - 导致代码的乱序执行
    
      Q1: 为什么需要缓存？
      Ans1: 现代的计算缓存的处理速度远远高于总线的处理速度，缓存1ns可以处理几十条指令
    
    -   Cache miss
    
    -   Capacity miss
    
    -   Associativity miss
    
    -   Write miss 
    
    -   Communication miss
    
    -   MESI
        - modified
        - Exclusive
        - Share
        - Invalid
        
        
        
 
 
 [07:10]https://www.bilibili.com/video/BV1ct411k7jn?p=8



### MESI 协议


- Modified


- Exclusive


- Shared



- Invalid


- MESI消息

zzz 省略 6哥

 [14:30]https://www.bilibili.com/video/BV1ct411k7jn?p=8



### 队列

- 先进先出
- 支持多线程
- ossQuene

 [02:30]https://www.bilibili.com/video/BV1ct411k7jn?p=9
 
**条件变量(Condition Variable)**

- 利用线程间共享的全局变量进行同步的一种机制

    - 线程等待
    - 线程唤醒
    - 总是和一个互斥锁结合使用
    

- POSIX

    - pthread_cond_wait
    - pthread_cond_timedwait
    - pthread_cond_signal
    - pthread_cond_broadcast
    
    
 
 
## 信号机制 Signal

- 信号是Unix与类Unix系统中的一种进程间通讯的机制

- 1970年贝尔实验室发布UNIX就已经存在

- 信号是一种进程间异步通讯的机制

    - 当信号被发送，操作系统中断目标进程的正常执行流程并发送信号
    - 执行中断必须在原子指令之间
    - 如果进程定义了信号处理函数，该函数会被执行
    - 否则默认信号处理函数执行
    


## 内核控制块 KRCB

- Kernel Control Block 内核控制块
- 包含所有重要的模块信息









# 编译基础

## gdb调试动态链接库


https://blog.csdn.net/yasi_xi/article/details/18552871

在 Linux 可以用 gdb 来调试应用程序，当然前提是用 gcc 编译程序时要加上 -g 参数。我这篇文章里将讨论一下用 gdb 来调试动态链接库的问题。首先，假设我们准备这样的一个动态链接库：引用：库名称是： ggg 动态链接库文件名是： libggg.so 头文件是： get.h 提供这样两个函数调用接口：
```c
 int get ();
 int set (int a);
```
  
要生成这样一个动态链接库，我们首先编写这样一个头文件:

```c
/************关于本文档********************************************
*filename: get.h
*********************************************************************/
int get ();
int set (int a);
然后准备这样一个生成动态链接库的源文件：

/************关于本文档********************************************
*filename:  get.cpp
*********************************************************************/
#include <stdio.h>
#include "get.h"

static int x=0;
int get ()
{
        printf ("get x=%d\n", x);
        return x;
}

int set (int a)
{
        printf ("set a=%d\n", a);
        x = a;
        return x;
}
```
然后我们用 GNU 的 C/C++ 编译器来生成动态链接库，编译命令如下：

```c
g++ get.cpp -shared -g -DDEBUG -o libggg.so
g++ get.cpp -shared -g -fPIC -DDEBUG -o libggg.so (64位机器)
```
这样我们就准备好了动态链接库了，下面我们编写一个应用程序来调用此动态链接库，源代码如下：

```c
/************关于本文档********************************************
*filename: pk.cpp
*********************************************************************/
#include <stdio.h>
#include "get.h"
int main (int argc, char** argv)
{
        int a = 100;
        int b = get ();
        int c = set (a);
        int d = get ();

        printf ("a=%d,b=%d,c=%d,d=%d\n",a,b,c,d);

        return 0;
}
```
编译此程序用下列命令，如果已经把上面生成的 libggg.so 放到了库文件搜索路径指定的文件目录，比如 /lib 或 /usr/lib 之类的，就用下面这条命令：
```c
g++ pk.cpp -o app -Wall -g -lggg
```
否则就用下面这条命令：
```c
g++ pk.cpp -o app -Wall -g -lggg -L`pwd`
```
下面我们就开始调试上面命令生成的 app 程序吧。如果已经把上面生成的 libggg.so 放到了库文件搜索路径指定的文件目录，比如 /lib 或 /usr/lib 之类的，调试就顺利完成，如下：

```c
#gdb ./app
GNU gdb 6.4-debian
Copyright 2005 Free Software Foundation, Inc.
GDB is free software, covered by the GNU General Public License, and you are
welcome to change it and/or distribute copies of it under certain conditions.
Type "show copying" to see the conditions.
There is absolutely no warranty for GDB.  Type "show warranty" for details.
This GDB was configured as "i486-linux-gnu"...Using host libthread_db library "/lib/tls/i686/cmov/libthread_db.so.1".

(gdb) b main    /* 这是在程序的 main 处设置断点 */
Breakpoint 1 at 0x804853c: file pk.cpp, line 7.
(gdb) b set      /* 这是在程序的 set 处设置断点 */
Function "set" not defined.
Make breakpoint pending on future shared library load? (y or [n]) y /* 这里必须选择 y 调试程序才会跟踪到动态链接库内部去 */
Breakpoint 2 (set) pending.
(gdb) run /* 开始运行我们的程序，直到遇见断点时暂停 */
Starting program: /data/example/c/app
Breakpoint 3 at 0xb7f665f8: file get.cpp, line 11.
Pending breakpoint "set" resolved

Breakpoint 1, main (argc=1, argv=0xbf990504) at pk.cpp:7
7               int a = 100;
(gdb) n     /* 继续执行程序的下一行代码 */
8               int b = get ();
(gdb) n      /* 程序执行到了我们断点所在的动态链接库了 */
get x=0
9               int c = set (a);
(gdb) n

Breakpoint 3, set (a=100) at get.cpp:11
11              printf ("set a=%d\n", a);
(gdb) list   /* 查看当前代码行周围的代码，证明我们已经跟踪到动态链接库的源代码里面了 */
6               printf ("get x=%d\n", x);
7               return x;
8       }
9       int set (int a)
10      {
11              printf ("set a=%d\n", a);
12              x = a;
13              return x;
14      }
(gdb) n
set a=100
12              x = a;
(gdb) n
13              return x;
(gdb) n
14      }
(gdb) n
main (argc=1, argv=0xbf990504) at pk.cpp:10
10              int d = get ();
(gdb) n
get x=100
11              printf ("a=%d,b=%d,c=%d,d=%d\n",a,b,c,d);
(gdb) n
a=100,b=0,c=100,d=100
12              return 0;
(gdb) c
Continuing.

Program exited normally.
(gdb) quit  /* 程序顺利执行结束 */
```

如果我们没有把动态链接库放到指定目录，比如/lib里面，调试就会失败，过程如下：

```c
# gdb ./app
GNU gdb 6.4-debian
Copyright 2005 Free Software Foundation, Inc.
GDB is free software, covered by the GNU General Public License, and you are
welcome to change it and/or distribute copies of it under certain conditions.
Type "show copying" to see the conditions.
There is absolutely no warranty for GDB.  Type "show warranty" for details.
This GDB was configured as "i486-linux-gnu"...Using host libthread_db library "/lib/tls/i686/cmov/libthread_db.so.1".

(gdb) b main
Breakpoint 1 at 0x804853c: file pk.cpp, line 7.
(gdb) b set
Function "set" not defined.
Make breakpoint pending on future shared library load? (y or [n]) y
Breakpoint 2 (set) pending.
(gdb) run  /* 虽然调试操作都一样，但程序执行失败 */
Starting program: /data/example/c/app
/data/example/c/app: error while loading shared libraries: libggg.so: cannot open shared object file: No such file or directory

Program exited with code 0177.
(gdb) quit 

```
调试失败的原因是因为gdb不能找到libggg.so，可以通过下面的方法解决：

1) 将库路径加到LD_LIBRARY_PATH里
2) 执行：ldconfig YOUR_LIB_PATH
3) 在/etc/ld.so.conf里加入库所在路径。然后执行：ldconfig

上面3个方法任意一个都可以，然后再去用gdb调试就没有问题了。
另:

1、假设我的可执行程序是ServerName，共享库为worker.so
2、我用gdb调试ServerName，想在B的某个源文件（比如worker.cpp，worker.cpp与ServerName不在同一个目录下）中设置断点，使用下面的命令行break worker.cpp:123

若找不到源文件可使用如下命令设定源文件目录：

设定gdb环境变量 LD_PRELOAD，在执行程序前先把共享库代码load进来
指定你的链接库的位置，可以通过设定环境变量LD_LIBRARY_PATH来实现

拷贝到标准的lib搜寻目录下，例如/usr/lib等

b main, r,然后再设置断点就可以了，共享库只有当程序运行才开始加载的 
`


## Mac系统下lipo, ar, nm等工具的使用简介

https://www.jianshu.com/p/e0ef5146bd7a?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation







