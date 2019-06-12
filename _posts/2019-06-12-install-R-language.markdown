---
layout:     post
title:      "linux下R 3.6.0的安装手册"
date:       2019-06-12 13:45:45
author:     "CaoZhiLong"
header-img: "img/post-bg-2015.jpg"
tags:
    - 技术杂谈
---




# linux下R 3.6.0的安装手册

## 前言：

在RHEL 7.2部署R3.6.0的时候，踩过了不少坑，其中系统的某些组件版本过低导致R安装不成功，此篇文章总结了一下正确安装R3.6.0的正确姿势，希望对想进行部署环境的人有所帮助。

## 1. 相关环境配置：


### Gcc 4.4.7

```shell
[root@localhost ~]# gcc -v
Using built-in specs.
Target: x86_64-redhat-linux
Configured with: ../configure --prefix=/usr --mandir=/usr/share/man --infodir=/usr/share/info --with-bugurl=http://bugzilla.redhat.com/bugzilla --enable-bootstrap --enable-shared --enable-threads=posix --enable-checking=release --with-system-zlib --enable-__cxa_atexit --disable-libunwind-exceptions --enable-gnu-unique-object --enable-languages=c,c++,objc,obj-c++,java,fortran,ada --enable-java-awt=gtk --disable-dssi --with-java-home=/usr/lib/jvm/java-1.5.0-gcj-1.5.0.0/jre --enable-libgcj-multifile --enable-java-maintainer-mode --with-ecj-jar=/usr/share/java/eclipse-ecj.jar --disable-libjava-multilib --with-ppl --with-cloog --with-tune=generic --with-arch_32=i686 --build=x86_64-redhat-linux
Thread model: posix
gcc version 4.4.7 20120313 (Red Hat 4.4.7-23) (GCC) 

```

### 操作系统：

```shell
[root@localhost ~]# uname -a
Linux localhost.localdomain 2.6.32-696.20.1.el6.x86_64 #1 SMP Fri Jan 26 17:51:45 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux

```

### R版本：3.6.0

linux64下面安装R的环境发现，有一些组件太旧了，所以需要先升级一些组件，才能安装R的3.6.0版本。



**根据踩过的坑，罗列了一下需要升级IDE安装包。**


## 2.R 3.6.0依赖升级的包

- bzip2>=1.0.6，下载路径：https://nchc.dl.sourceforge.net/project/bzip2/bzip2-1.0.6.tar.gz
- curl version 7 and >= 7.22.0，下载路径：https://curl.haxx.se/download/curl-7.22.0.tar.gz
- PCRE version >= 8.20, < 10.0 and has UTF-8 support：ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/
- xz-lzma version >= 5.0.3，下载路径：https://nchc.dl.sourceforge.net/project/lzmautils/xz-5.2.3.tar.gz
- zlib version >= 1.2.5，下载路径：https://zlib.net/zlib-1.2.11.tar.gz


## 下载好后的安装包结果如下：

```shell
[root@localhost R-depends]# ll
total 7740
drwxr-xr-x.  2 root root     4096 Jun  1 01:52 bzip2-1.0.6
-rw-r--r--.  1 root root   782025 Nov  4  2018 bzip2-1.0.6.tar.gz
drwxr-xr-x. 11 1000  1000    4096 Jun  1 01:56 curl-7.22.0
-rw-r--r--.  1 root root  2957090 Jun  1 01:54 curl-7.22.0.tar.gz
drwxr-xr-x.  9 1169  1169   12288 Jun  1 01:58 pcre-8.38
-rw-r--r--.  1 root root  2053336 Jun  1 01:49 pcre-8.38.tar.gz
drwxr-xr-x. 14 root root     4096 Jun  1 01:59 xz-5.2.3
-rw-r--r--.  1 root root  1490665 Dec 30  2016 xz-5.2.3.tar.gz
drwxr-xr-x. 14  501 games    4096 Jun  1 02:14 zlib-1.2.11
-rw-r--r--.  1 root root   607698 Jan 16  2017 zlib-1.2.11.tar.gz

```


### 解决bzip2从1.0.5升级到1.0.6的方法

在linux64的系统上，下载好后的bzip2默认不是用64位进行编译的，所以直接安装的时候回出错，如果你用的是linux32位的就没有问题，以下罗列了出现的安装错误：

Ø libbz2.a: could not read symbols: Bad value------>把/usr/local/lib中的libbz2.a删掉

Ø /usr/local/lib/libz.a: could not read symbols-------->操作同上，删掉libz.a;

#### 1. 修改bzip2-1.0.6的"Makefile"文件：

```

CC=gcc -fPIC  << 新增 -fPIC，默认是64位编译的；
AR=ar
RANLIB=ranlib
LDFLAGS=
BIGFILES=-D_FILE_OFFSET_BITS=64
CFLAGS=-fPIC -Wall -Winline -O2 -g  $(BIGFILES)   # 这里也可以加上

```

#### 2. 用命令行安装bzip2：

```
yum remove bzip2-devel.x86_64 0:1.0.5-7.el6_0  #　先remove掉原来的bzip-1.0.5文件：
cd bzip2-1.0.6
make -f Makefile-libbz2_so
make clean <------------保守建议，还是clean一下 
make
make install PREFIX= xxx/xxx   # prefix表示的安装的路径前缀

```

#### 3. 具体的安装步骤

首先依次升级低版本的包，具体安装步骤如下：

- 新建一个文件夹，然后把需要依赖的组件安装这个路径下
- 安装相应的依赖包，把包都安装在制定路径上；
- 修改一下path，新增这个文件夹路径，可以找到相应的环境；
- 最后安装R；

#### 首先看第一步，进入linux系统：

```
cd ~
mkdir packages
```

#文件夹packages可以自行定义，这里


## 各安装包的安装的报错和安装方法

### bzip2

报错结果：

```
checking bzlib.h presence... yes
checking for bzlib.h... yes
checking if bzip2 version >= 1.0.6... no
checking whether bzip2 support suffices...
configure: 
error: bzip2 library and headers are required
```

具体命令，把bzip2的文件

```
tar xzvf bzip2-1.0.6.tar.gz
cd bzip2-1.0.6
make -f Makefile-libbz2_so
make clean
make
make -n install PREFIX=$HOME/packages
make install PREFIX=$HOME/packages
```

### curl

报错：

```
checking libcurl version ... 7.19.7
checking curl/curl.h usability... yes
checking curl/curl.h presence... yes
checking for curl/curl.h... yes
checking if libcurl is version 7 and >=
7.28.0... no
configure: error: libcurl >= 7.28.0
library and headers are 
required with support for https

```

安装方法：

```
tar –xvf curl-7.54.1.tar.gz
cd curl
./configure --prefix=$HOME/packages   # 这个是之前设置的packages路径
make -j3
make install

```

### pcre


报错内容：

```
checking for pcre/pcre.h... no
checking if PCRE version >= 8.10, <
10.0 and has UTF-8 support... no checking whether PCRE support suffices...
configure: error: pcre >= 8.10 library and headers are required

```

安装方法：

```
tar –xvf pcre-8.41.tar.gz
cd pcre
./configure --enable-utf8  --prefix=$HOME/packages \
# 这个是之前设置的packages路径，一定要设置enable-utf8;
make
make install

```

### xz

报错方法：

```
checking whether bzip2 support suffices...
no
checking for lzma_version_number in
-llzma... no
configure: error: "liblzma library and
headers are required"

```

安装方法：

```
tar xzvf xz-5.2.3.tar.gz
cd xz-5.2.3
./configure --prefix=$HOME/packages
make -j3
make install

```

### zlib

报错信息：

```
checking if zlib version >= 1.2.5... no
checking whether zlib support suffices...
configure: error: zlib library and headers are required

```

安装方法：


```
tar -zxvf zlib-1.2.11.tar.gz

cd zlib-1.2.11/

./configure --prefix=/usr/local/zlib

make

make check

make install

echo "/usr/local/zlib/lib" >> /etc/ld.so.conf 

ldconfig -v

```


## 4. 设置环境变量，安装R devel的时候需要找到相应的组件

### 设置path，CFLAGS，LDFLAGS等路径；


```shell
export PATH=$HOME/packages/bin:$PATH
export LD_LIBRARY_PATH=$HOME/packages/lib:$LD_LIBRARY_PATH 
export CFLAGS="-I$HOME/packages/include" 
export  LDFLAGS="-L$HOME/packages/lib"

```

## 5. 安装R3.6.0

安装R-liunx版本：


```
tar –xvf R-3.6.0.tar.gz
cd R-3.6.0
sudo  ./configure --prefix=/usr/local/lib64/R  --enable-R-shlib  --with-readline=yes --with-libpng=yes --with-x=no  # --enable-R-shlib一定要设置，否则安装不上Rserve;  prefix是安装路径，可以自定义；
make -j3
make install

```

## 6. 安装R的包或者Rserve，用来进行外部通讯

### 启动R

Rserve #在R的console里面执行下面的命令

1.下载安装包复制到服务器上 地址：Rserve - Binary R server - download/files - RForge.net(http://www.rforge.net/Rserve/files/)

2.install.packages("Rserve安装包的绝对路径") 或者 **在终端执行**：

```
sudo R CMD INSTALL Rserve_1.8-3.tar.gz
```

3.library("Rserve")，进入R界面，然后启动library(Rserve)启动；Rserve

或者用命令行，用命令行可以用进程控制，R client只能是线程控制，退出界面后就无法访问了

```
/usr/local/lib64/R/bin/R CMD /home/op1/R/x86_64-unknown-linux-gnu-library/3.2/Rserve/libs/Rserve

```

4.查看后台进程

```

ps aux | grep Rserve # 命令查看Rserve进程

```

5.开启远程访问

```
R CMD  /home/op1/R/x86_64-unknown-linux-gnu-library/3.2/Rserve/libs//Rserve  --RS-enable-remote #开启远程访问
```

## 附录：

### 参考资料：　

- Building R-devel on RedHat Linux (https://link.zhihu.com/?target=http%3A//pj.freefaculty.org/blog/%3Fp%3D315)　写的也和详细，我把我碰到的问题做了一些顺序的调整；
- linux下R3.4.1的安装手册 (https://zhuanlan.zhihu.com/p/28055351)











