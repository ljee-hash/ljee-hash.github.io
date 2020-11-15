---
layout:     post
title:      "轻量级桌面应用开发nw.js之七"
subtitle:   "nw.js入门"
date:       2017-12-07 21:15:06
author:     ""
header-img: ""
tags:
    - nw.js
---

#  轻量级桌面应用开发nw.js之七

## NodeJs如何调用Dll模块的方法

当我使用nw.js开发桌面应用程序是，会涉及到与底层硬件设备的通信，而sdk封装基本上都是通过 C/C++ 动态链接库实现的。

有两种方案可供选择：

- 方案一

&nbsp;&nbsp;使用node-ffi

- 方案二


&nbsp;&nbsp;使用C/C++编写一个node addoh，通过LoadLibary实现调用


### 快速开始


### 准备工作

