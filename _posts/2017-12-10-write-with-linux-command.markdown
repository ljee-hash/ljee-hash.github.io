---
layout:     post
title:      "Linux常用命令备忘录"
subtitle:   "Atomic,CopyOnWrite,Atomic"
date:       2017-12-10 10:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - Linux
---


# Linux常用命令备忘录


## 1.x Linux初步与环境安装。

> Linux系统出现于1991年，由芬兰大学生李纳斯（Linus Torvalds）和后来陆续加入的众多爱好者共同开发完成。Linux是一个自由软件，是源代码开放的UNIX。当然UNIX是Linux的前辈了，早在Linux出现前20年就产生了。

### Linux优点：
- 稳定的系统
- 开源免费
- 安全性、漏洞的快速修补
- 多任务、多用户
- 良好的可移植性和灵活性
- 可供选择的厂商多
- .....

### Linux用于做什么？
- 网络服务器
- 关键任务的应用（金融数据库、大型企业网管环境等）
- 高性能运算任务
- .....

**推荐使用CentOS6.4 （64bit的操作系统）**

> Linux目前有两种操作模式，一种是图形化界面，一种则为命令行。那么到底是图形界面好还是命令行好？在这里强调下，初学者建议采用图形界面，一些相关的主机操作方便简单，如果有一定基础的可以使用命令行，另外在企业里一般都会使用命令行模式，原因就是图形化界面比较耗资源。

### 如何学习Linux系统？

- 首先放弃Windows系统的概念，要以全新的角度和思维方式去对待
- 多多动手敲命令，实践再实践（如有深入研究兴趣选择一本比较易读的书，增加多Linux的了解）。

### 使用Linux需要什么样配置的机器？

- 一般来说CPU只有不是太老旧i5+已经足够你玩的了
- 对于RAM，当然越大越好，我们可以进行多机环境切换等。
- 硬盘要求不高，有个20G完全够用了。
网卡是必不可少的
- 其他的声卡、显卡等等，我们是进行学习，不是娱乐，不需要这些。

&emsp;&emsp;好吧你已经看到了，如此简单的配置即可，Linux的配置需求门槛特别低，那么还等什么，我们开始Linux之旅吧。

### 安装Linux

&emsp;&emsp;我们使用**VMware虚拟机**软件，他是一款性能各方面都非常不错的软件，官网地址：http://www.vmware.com。**VMware**介绍：是一个虚拟PC的软件，可以在现有的操作系统上虚拟出一个新的硬件环境，相当于模拟出一台新的PC机。
我们使用CentOS6.4版本的Linux系统。
远程登录管理工具，这里有很多比较好的工具，如**Putty、SecureCRT、Xshell**，这里使用Xshell，个人认为使用比较顺手。
使用安装说明：http://www.jb51.net/os/85895.html

### 安装Linux步骤

1. 新建虚拟机，配置对应的硬件参数，然后修改镜像文件，重启。
2. 直接回车进入图形化安装界面，开始安装Linux
3. 注意选择自定义分区，进行分区。注意Linux必须要有根分区和swap分区。一般跟分区存放系统文件，大小5、6个G足够用。swap分区一般1G足够用。
4. 分区完成后选择图形界面安装。
5. 重新启动，用户名root，输入密码。
6. 设置ip地址、禁用防火墙。

![Linux磁盘默认分区结构](https://caozhilong.github.io/img/arct/post-arct-linux-parti-constructs.png)

### Linux规范

1. 除了/之外，所有的字符都合法，尽量不要使用如空格、制表符、退格符号、@、#、￥、&、（）、“.”、“-”等特殊字符 ，他们很多都有特殊的含义，并且linux的大小写敏感，表示不同的文件。
2. 命令格式：命令 -选项 参数 例如：

```
ls -la /usr
//当有多个选项时可以写在一起。
```

3. 使用**cd命令**进行前进和后退，在linux里面有俩个特殊的目录： “.”表示当前目录  ".."表示当前目录的上一级目录。
4. 使用**ls命令**查看当前目录内容，使用ll命令查看详细信息。
5. 使用**pwd命令**查看当前所在文件全路径。

### Linux文件说明（规范）

**文件的详细说明：**

![文件的详细说明](https://caozhilong.github.io/img/arct/post-arct-linux-parti-constructs-details.png)

![详细说明](https://caozhilong.github.io/img/arct/post-arct-linux-parti-constructs-details-info.png)

**文件的权限说明：**

![文件的权限](https://caozhilong.github.io/img/arct/post-arct-linux-parti-constructs-details-rights.png)

```shell
d：开始为d，表示目录 directory
d: 表示文件夹
- : 开始为-，表示普通的二进制文件
l : 开始为l，表示软连接文件（link）	
r: read 读权限。  w：write 写权限。  x：execute 执行权限。
Linux中的文件如：drwxr-xr-x 可以看做三个部分（rwx r-x r-x），分别是文件的所有者rwx（user）的权限、所属组r-x（group）的权限和其他人r-x（others）的权限。

```


## 2.x 常用命令介绍。

### 2.1 文件处理命令

```
命令：cp （copy）
语法：cp  [源文件] [目标文件]  
           cp -r [源目录] [目标目录]
描述：复制文件或目录 

命令：rm（remove）
语法：rm -f [文件] 
           rm -r [目录]
           rm -rf [目录，包含目录下内容]
描述：删除文件或目录


命令：cat
语法：cat [文件名称]
描述：查看文件内容（内如过多，显示内容可能不全）

命令：more
语法：more [文件名称]
描述：查看文件内容，可完全显示
用法：使用空格进行翻页，回车显示下一行，q退出（或者ctrl+c）

命令：head
语法：head -number [文件名]
描述：查看文件的前多少行

命令：tail
语法：tail -number [文件名]
描述：查看文件的后多少行

mv 1 修改文件名称的功能 ： mv [源文件名称] [新文件名称]
	       2  移动文件位置	: mv [源文件名称] [新文件位置+ 新文件名称]

```

```
命令：ln（link）
语法：ln -s [源文件] [目标文件] （硬链接则不需要-s选项）
描述：创建软链接文件
```
![ln（link）详情](https://caozhilong.github.io/img/arct/post-arct-linux-f-process-ln-command.png)


**软链接特点**：权限是++所有人都可以访问++，并且软连接文件指向源文件。软链接就像windows系统中的快捷方式一样，特点也都类似。

**硬链接**：类似copy，硬链接大小和源文件一样，并且是同步更新的。

![硬链接](https://caozhilong.github.io/img/arct/post-arct-linux-f-process-solidln-command.png)

**另外：硬链接不能跨文件系统分区，而软连接可以。**

### 2.2 权限处理命令

**权限处理命令**

```
命令：chmod
语法：chmod [{ugo}{+-=}{rwx}] [文件或目录]
           chmod [mode=421] [文件目录]
描述：改变文件或目录的权限
形如：chmod g+w filename
形如：chmod 761 filename

```

**问题示例**: 新建一个新目录，下面一个新文件，尝试用普通用户去删除新目录下的新文件。

1. **尝试修改**：新文件的读写权限设置为 777，进行删除文件操作
2. **尝试修改**：新目录的读写权限设置为 777，进行删除文件操作

**文件的rwx权限：**

```
r：可以执行catch、more等读操作。
w：修改文件的内容等写操作，但是不代表你可以把这个文件删除。
x：对文件进行执行操作。
```

**目录的rwx权限：**

```
r：可读操作，可以列出目录的内容，比如ls命令。
w：表示可以在目录下创建或删除文件的权限。
x：表示可以进入这个目录（基本上所以的目录都会有rx权限）。
```

&emsp;&emsp;**所以：删除文件的权限，是拥有你当前文件所在的目录的写权限**

![文件目录权限总结](https://caozhilong.github.io/img/arct/post-arct-linux-f-process-rights-for-df.png)

```
命令：chown
语法：chown user 文件
描述：改变文件的所有者
示例：chown newuser t1.sh
useradd username 添加用户
passwd  username 为用户设置密码

命令：chgrp
语法：chgrp group 文件
描述：改变文件的所属组 
示例：chgrp adm t1.sh

```

**查看系统默认的权限**：umask -S （umask查看权限掩码值022 使用777-022得到真实权限）
```shell
[root@iZ252580q83Z software]# umask -S
u=rwx,g=rx,o=rx
```

### 2.3 文件搜索命令


```bash
命令：find
语法：find [搜索范围路径] -name 【文件名称】（根据文件名查找）
           find [搜索范围路径] -size [（+-）文件大小] （根据文件大小查找，大于+ 小于-）
           find [搜索范围路径] -user（文件的所有者）
           find [时间查找] [以天为单位]
[以天为单位] 1 ctime、atime、mtime 
[以分钟为单位] 2 cmin、amin、mmin
           。。。。。			
描述：查找任何文件或目录（所有）

```

**find命令示例**：find [搜索范围路径] -name

```shell
[root@iZ252580q83Z /]# find /etc -name init
/etc/selinux/targeted/active/modules/100/init
/etc/sysconfig/init
```

**匹配任意字符***

```shell
[root@iZ252580q83Z /]# find /etc -name *init
/etc/selinux/targeted/active/modules/100/init
/etc/sysconfig/init
/etc/security/namespace.init
```

**匹配指定字符 ？**

```shell
[root@iZ252580q83Z /]# find /etc -name ?init
[root@iZ252580q83Z /]# find /etc -name *?init
/etc/security/namespace.init
```

**匹配指定文件大小：**
```
find [搜索范围路径] -size [+-文件大小] （根据文件大小查找，大于+小于-）
注意，对于文件的大小是以数据块为单位。数据块大小是512bit
形如：如需查找100M的文件，那么就要知道100M为多少block？
100M = ? block
1M = 1024K
100M = 102400K
1K = 2 block
100M = 2*102400 block

```

```shell
[root@iZ252580q83Z /]# find /etc -size +2000
/etc/udev/hwdb.bin
/etc/selinux/targeted/contexts/files/file_contexts.bin
/etc/selinux/targeted/active/policy.kern
/etc/selinux/targeted/policy/policy.30

```

**查找隶属于某个用户的文件**

```
find [搜索范围路径] -user（文件的所有者）
描述：查找隶属于某个用户的文件
```

```shell
[root@iZ252580q83Z /]# find /etc  -user root -name in*
/etc/rc.d/init.d
/etc/inputrc
/etc/yum/vars/infra
/etc/selinux/targeted/contexts/initrc_context
/etc/selinux/targeted/active/modules/100/init
/etc/selinux/targeted/active/modules/100/inn
/etc/selinux/targeted/active/modules/100/inetd
/etc/init.d
/etc/sysconfig/network-scripts/init.ipv6-global
/etc/sysconfig/init
/etc/inittab

```

**查找指定时间范围内的文件**

```
find [时间查找] [以天为单位]
 天： ctime、atime、mtime
 分钟：cmin、amin、mmin
c表示：change 改变文件属性的意思（比如所有者、所属组、权限变更）。
a表示：access 表示被访问过的意思（比如被查看过等）。
m表示：modify 更改内容的意思。
在时间前面添加：-表示之内，+表示之外

```

```shell
[root@iZ252580q83Z /]# find /etc -mmin +120 

```

**查找指定逻辑连接的文件，AA或BB**

```
find应用的连接符：
 -a （and的意思，逻辑与）
 -o（or的意思，逻辑或）

```



```shell
## 查询文件大于80M小于100M的文件
[root@iZ252580q83Z /]# find -size +163840 -a -size -204800
./usr/local/src/mysql-5.6.24/libmysqld/examples/mysql_embedded
./usr/local/src/mysql-5.6.24/libmysqld/examples/mysql_client_test_embedded
...
```

```shell
[root@iZ252580q83Z /]# find /etc -size +1024 -a -name -ca*

```

**find查找：根据文件类型进行查找**

```
find查找：根据文件类型进行查找：
-type  其中：f表示二进制文件，l表示软连接文件 d表示目录
```

```shell
[root@localhost /]# find /test1 -type d
/test1
[root@localhost /]# find /test1 -type d -o -name t1
/test1
```


#### 命令：which

```
命令：which
语法：which [命令名称]
描述：查看命令所在的目录位置
```

&emsp;&emsp;在linux里面一般只有两种命令，第一种是所有用户都可以使用，第二种则是只允许管理员使用，还有一个命令叫whereis，和which使用类似

&emsp;&emsp;比如： rm命令，其实我们可以使用 which rm查看其命令内容：

```shell
[root@localhost /]# which rm
alias rm='rm -i'
	/bin/rm
[root@localhost /]#
```

&emsp;&emsp;alias就是别名的意思，说明我们使用的rm命令在默认的情况下加了 -i选项，意思是在删除的时候进行询问是否需要删除，那么添加"\"就使用真正的rm命令而不是别名，直接就可以删除不需要提示询问。
find的连接执行符号：
find ... -exec [执行命令] {} \;

注意：**“{}"表示find命令查找的结果，而"\"表示转义符**

**find -exec执行命令**

&emsp;&emsp;find ... -exec [执行命令] {} \;

```
[root@localhost /]# find /test1 -name t1.sh -exec -rm -f {} \;
[root@localhost /]#
```
**find -ok [执行命令]**

&emsp;&emsp;find ... -ok [执行命令] {} \;

**ok和exec的区别就是ok有询问确认的意思**。


```shell
[root@localhost /]# find /test1 -name t1.sh -ok -rm -f {} \;
[root@localhost /]#
```

&emsp;&emsp;有时候我们看到find命令非常的长，这样你可能会很晕，其实其中的道理非常简单，就是使用之前我们所学习的命令，把这些弄清楚，完全可以应付别人离开写的很长的命令操作。

```shell
[root@localhost /]# find /etc -name init* -a -type f -exec ls -la {} \;
-rw-r--r--. 1 root root 30 Jan 26 15:51 /etc/selinux/targeted/contexts/initrc_context
-rw-r--r--. 1 root root 0 May 11  2016 /etc/init.conf
-rwxr-xr-x. 1 root root 4623 Jan 18  2017 /etc/sysconfig/network-scripts/init.ipv6-global
-rw-r--r--. 1 root root 1154 Oct  4  2017 /etc/sysconfig/init
-rw-r--r--. 1 root root 884 Oct  4  2017 /etc/inittab
-rw-r--r--. 1 root root 130 May 11  2016 /etc/init/init-system-dbus.conf

```
**find 根据文件节点ID查找**

&emsp;&emsp;find -inum [i节点标号]

&emsp;&emsp;根据i节点查找文件，在linux系统中，所有的文件都有一个唯一的标识，方便linux内核去调用，这就是i节点

```shell
[root@localhost test1]# ls -li
total 4
652858 drwxr-xr-x. 2 root root 4096 Jun 16 13:27 my
652868 -rw-r--r--. 1 root root    0 Jun 16 13:27 t1.sh
[root@localhost test1]# find /test1 -inum 652858
/test1/my

```

**locate 查找文件**

```
命令：locate
语法：locate [文件名称]
描述：查找文件，根据linux数据库内部的索引（updatedb命令，
可以手工更新updatedb数据库，一般和locate配合使用）
```


```shell
[root@localhost test1]# ll
total 4
drwxr-xr-x. 2 root root 4096 Jun 16 13:27 my
-rw-r--r--. 1 root root    0 Jun 16 13:27 t1.sh
-rw-r--r--. 1 root root    0 Jun 16 13:29 t2.sh
[root@localhost test1]# locate t2.sh
-bash: locate: command not found
[root@localhost test1]# find -name t2.sh
./t2.sh

```

**辅助命令**

```
命令：man
语法：man [命令或者配置文件]，
描述：帮助命令，非常的有用，可以获得命令的帮助文档，如何使用等。

命令：whatis
语法：whatis [命令]
描述：查看命令的描述。

命令：--help
语法：[命令] --help
描述： 查看命令的选项用法。

```



**注意：locate的查找速度非常快，比find查找快很多，原因是locate查找的是linux系统构建的文件数据库的索引值，所以速度非常快，但是有的时候新创建的文件使用locate命令查找不到，原因是这个文件的索引没有马上更新到linux系统文件数据库里。**




### 2.4 压缩解压缩命令

**压缩解压缩命令**

```
命令：gzip
语法：gzip [文件名称]
描述：压缩的时候不保留原文件，并且只能压缩文件不能压缩目录

命令：gunzip
语法：gunzip [已压缩的文件]
描述：解压缩文件，不不保留源文件
```

```
命令：tar
语法：tar [zcvf]  [zxvf] [打包文件名.tar.gz] [源文件]
           -c 产生tar打包文件（必选）
           -x 产生的解压缩文件（必选）
           -v 显示详细信息
           -f 指定压缩后的文件名
           -z 打包同时压缩
描述：打包目录 生成的后缀名 .tar.gz，或者进行解压
最后配置加-C 表示文件解压后存放的路径
file命令可以查看任何文件的类型


```


```
命令：zip
语法：zip 选项[-r] [压缩后文件名称] [源文件]
描述：zip的格式是windows和linux通用的格式，可以压缩文件和目录，压缩目录时需要选项-r。

命令：unzip
语法：unzip [解压缩的文件]
描述：进行解压缩
最后配置加-d 表示文件解压后存放的路径

```





### 2.5 其他命令


**其他命令**

```shell
ping
（注意：ping 不通对方网络的原因有很多种，需要一步步详细排查）
（1）首先ping一下回环地址 127.0.0.1 检查自己本机的网络协议是否正确
（2）再ping一下本机ip 查看自己本机的网络是否正确
（3）然后检查对方网络设置、防火墙、插件等等
（4）如果发现丢包率里有丢失数据包，可能是网络、网线的原因
（5）ping 配置选项 ping -c 6 192.168.80.100（表示ping 6次之后断开）
（6）ping 配置选项 ping -s  60000 （最大65507）

查看网卡信息：ifconfig
关机：shutdown -h now
重启：reboot
ctrl + l 清屏。
ctrl + c 退出应用。
tab键，信息补全。

```



```
过滤：grep，可以将指定内容进行过滤然后输出。

管道：
将一个命令的输出传送给另一个命令，作为另外一个命令的输入。管道可以连接N个命令。
ls -l /etc | more （表示将ls -l /etc的输出，当做more命令的输入，即more命令浏览的内容为前面命令的输出结果）
ls -l /etc | grep init（表示将ls -l /etc的输出结果进行过滤，显示为init的结果）
ls -l /etc | grep init | wc -l (最后进行统计显示的个数)

```


```
逻辑与（&&）
形如：ls && pwd（第一个命令如果执行成功。第二个命令才会执行）
逻辑或（||）
形如：ls || pwd （第一个命令执行成功，则第二个不执行，第一个命令执行失败，则执行第二个）

```


```shell
输入输出重定向：
Shell对每一个进程预先定义了3个文件描述字（0,1,2）
0 （stdin） 标准输入      1 （stdout）标准输出       2 （stderr）标准错误输出
输出重定向：就是把输出的结果显示到一个文件上 （>表示输出重定向）


[root@localhost test1]# ll /test1 > /test1/a.log
[root@localhost test1]# vim a.log

```

**如果想进行结果的追加，使用">>"**

```
[root@localhost test1]# ll /test1 >> /test1/a.log
[root@localhost test1]#
```

**输入重定向：就是把输入的信息重定向，比如把一个文件里的内容，进行发出**

```shell
[root@localhost test1]# wall < /test1/a.log
[root@localhost test1]#
Broadcast message from root@localhost.localdomain (Sat Jun 16 13:43:02 2018):

total 4
-rw-r--r--. 1 root root    0 Jun 16 13:40 a.log
drwxr-xr-x. 2 root root 4096 Jun 16 13:27 my
-rw-r--r--. 1 root root    0 Jun 16 13:27 t1.sh
-rw-r--r--. 1 root root    0 Jun 16 13:29 t2.sh
total 8
-rw-r--r--. 1 root root  197 Jun 16 13:40 a.log
drwxr-xr-x. 2 root root 4096 Jun 16 13:27 my
-rw-r--r--. 1 root root    0 Jun 16 13:27 t1.sh

```

**错误重定向：一般是把程序执行的错误日志信息存放到指定的log日志中去。**


```
[root@localhost test1]# ll /dasads 2> /test1/b.log
[root@localhost test1]# vim b.log

ls: cannot access /dasads: No such file or directory
~
```





## 3.x vi/vim文本编辑器介绍。
## 4.x 用户管理。
## 5.x 进程管理。

[操作系统之进程管理](https://www.jianshu.com/p/b3fec37ee616)
Linux 进程管理剖析_创建、管理、调度和销毁<https://www.ibm.com/developerworks/cn/linux/l-linux-process-management/index.html>


## 6.x 系统文件构成。
## 7.x 软件包管理。
## 8.x Shell编程。
