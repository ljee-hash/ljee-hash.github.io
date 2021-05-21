---
layout:     post
title:      "轻量级桌面应用开发nw.js之六"
subtitle:   "nw.js入门,轻量级桌面应用"
date:       2017-12-07 21:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-app-interface-test.jpg"
tags:
    - IDE
    - nw.js
---

#  轻量级桌面应用开发nw.js之六 

## 如何打包和分发您的应用程序

## 快速开始

&emsp;&emsp;只需将文件与NW文件放在同一目录中，然后将其发送给用户。nw.exe和package.json应该在同一个目录下。

&emsp;&emsp;**在不同的操作系统上，分发方式不相同**

&emsp;&emsp;在OSX上它是不同的：把你的应用程序的树放在一个名为nwjs.app/Contents/Resources/app.nw, 需要了解更多[请移步](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps)


## 准备工作

&emsp;&emsp;nw目录下，建立以下文件夹:

- **node_modules** —— 程序部署需要使用的node模块
- **plugins** —— NPAPI 的插件，可

&emsp;&emsp;在下载nw的版本时，正式环境请不要使用snapshot



&emsp;&emsp;**注意:**构建时为了保证平台无关性，请使用npm install安装配置文件依赖的库

> Caution: do not assume your node_modules that target one platform work as is in all platforms. For instance node-email-templates has specific Windows & Mac os x npm install commands. Besides, it requires python to install properly, which is not installed by default on Windows.

> As a rule of thumb npm install your package.json on each platform you target to ensure everything works as expected.

## 步骤1：将完成的程序打成压缩包

&emsp;&emsp;由于我们的软件包系统与LÖVE类似，因此以下指南从Wiki中修改。

&emsp;&emsp;**注意将打成的zip文件，修改后缀名为.nw，至少需要包含以下三个部分:**

-  必须有一个package.json描述文件,此文件为程序依赖的清单文件
-  package.json必须在要打包的应用程序的根目录下
-  在zip文件和程序根目录区分大小写。对于Windows和Mac OS X用户,这种操作系统不区分文件大小写,单由于本质是web项目因此需要符合URI规范

## **创建.nw文件的步骤:**

### Windows操作系统

1. 创建一个zip压缩文件
2. 将应用程序包含的文件全部打包到zip文件中，保留程序的目录结构，并且确保package.json文件位于ZIP的根目录下
3. 将zip压缩文件的后缀名修改为.nw。默认情况下，文件的后缀名会被操作系统隐藏，请自行设置

```shell
zip -q -r file-explorer.zip file-explorer
```
### Linux / OS X操作系统

&emsp;&emsp;从命令行进入到程序的根目录

```
1. 切换到程序根目录下,``cd /project/my_app```
2. 执行 ```zip -r ../XXX.nw *```
3. 将准备好的.nw文件放置在项目目录之外
4. 可以了
```

## 步骤2：将应用程序打包成可执行文件


### 方法1：将应用程序打包成可执行文件

### 方法2：从.nw文件中创建可执行文件

&emsp;&emsp;在了解终端用户为了运行应用程序需要做什么。如果用户单独得到.nw文件，需要用户具备.nw的运行环境才能执行。(此方式可能**开发人员使用较多**);

&emsp;&emsp;除此之外，还有一个简单的方式，由系统开发人员将.nw文件和nw环境集成,打包成可执行文件,如exe

&emsp;&emsp;**在正常的生产环境下,建议将.nw文件和可选的nw环境集成,分发给用户**

**分发时需要注意两点:**

-  最终结果不会只有一个可执行文件,还必须在zip文件中包含一些DLL
-  从合并结果得到的可执行文件任然可以通过winZip读取

### Windows操作系统

&emsp;&emsp;在windows上完成打包需要以下几部,在控制台输入:

```cmd
copy /b nw.exe+helloworld.nw helloworld.exe
```


### Windows操作系统



## 参考文献

https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps

http://m.blog.csdn.net/zeping891103/article/details/52222554