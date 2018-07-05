---
layout:     post
title:      "CentOS安装Docker CE的最新有效方法"
subtitle:   "Linux,Docker"
date:       2018-06-07 17:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - Linux
    - Docker
---



# CentOS安装Docker CE的最新有效方法

### 背景

centos系统里，以前用yum install docker的方式不管用。（不信你可以试试）   
现在docker分为docker ce和docker ee两种版本，这里以docker ce为例，告诉读者最新的最简单方法。

### 解决方法

#### 前提

**服务器必须能上外网**   
使用公司mirrors是不行的（因为用到第三方repos）

#### 方法

一个好人将docker官网里如何在centos安装docker ce的步骤   
https://docs.docker.com/engine/installation/linux/docker-ce/centos/   
写成了脚本   
https://github.com/liumiaocn/easypack/tree/master/docker   
执行 easypack_docker.sh 即可完成安装
