---
layout:     post
title:      "轻量级桌面应用开发nw.js之一--HelloWorld"
subtitle:   "nw.js入门,轻量级桌面应用"
date:       2017-11-30 21:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-app-interface-test.jpg"
tags:
    - IDE
    - nw.js
---

# 轻量级桌面应用开发nw.js之一--HelloWorld

## 引言

&emsp;&emsp;为了开始我们对nwjs的介绍，我们将从最简单的程序开始。

## 环境准备

```shell
nw.js v0.26.6
Node v9.1.0
Chromium 62.0.3202.94
commit hash: b12ee45-2da8f18-05043ec-58095c1
```

### **下载nw.js**

&emsp;&emsp;由于笔者的环境为win7 X64 ，笔者为了在win7的32位系统下也能使用，下载如下版本

[nwjs-v0.26.6-win-ia32.zip](https://dl.nwjs.io/v0.26.6/nwjs-v0.26.6-win-ia32.zip)

### 解压zip，如下到windowsAppDev目录

目录结构

```
G:\dev\bin\windowsAppDev:.
├─locales
├─swiftshader
└─workwin
    └─test2
        └─helloworld
```

## HelloWorld程序编写

&emsp;&emsp;在nw.js根目录下建立如下工作区workwin

![运行效果图](https://camo.githubusercontent.com/501265468152b9ec91c724962d74a1906037c9eb/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323839313432342f3237393531362f35666261306363612d393132622d313165322d393833642d6332653861363663333730362e504e47)

&emsp;&emsp;在workwin下建立test2目录,在test2目录下创建helloworld目录，

**第一步，新建index.html:**

index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```
**第二步，新建package.json:**

package.json

```json
{
  "name": "nw-demo",//app的名称
  "main": "index.html" //app的首页
}
```

**第三步，运行helloworld程序**

&emsp;&emsp;进入helloworld目录，执行cmd命令

```bat
cd G:\dev\bin\windowsAppDev\workwin\test2\helloworld

G:\dev\bin\windowsAppDev\nw .
```
&emsp;&emsp;运行效果图，如前面的截图所示


![运行效果图](https://camo.githubusercontent.com/501265468152b9ec91c724962d74a1906037c9eb/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323839313432342f3237393531362f35666261306363612d393132622d313165322d393833642d6332653861363663333730362e504e47)




## 参考文档

nw官方文档 https://github.com/nwjs/nw.js/wiki/Getting-Started-with-nw.js#basics

