---
layout:     post
title:      "轻量级桌面应用开发的捷径——nw.js"
subtitle:   "跨平台开发,轻量级桌面应用"
date:       2017-12-01 21:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-app-interface-test.jpg"
tags:
    - IDE
    - DeskTop dev
---



# 轻量级桌面应用开发的捷径——nw.js

## 引言

&emsp;&emsp;每个程序员都希望用自己喜欢的语言，自己喜欢的平台、工具，写自己喜欢的程序。于是我们会看到有人在Win下用Visual Studio愉快地coding，也会看到有人在OS X下用Xcode来开发，或者是用Sublime Text不受平台限制地玩。

&emsp;&emsp;当然了，愿望往往是美好的，然而事与愿违的情况时有发生。如果你基本都是用OS X，却有人让你写一个带有简单界面的小程序，保证在他的Win系统上一定可以运行，那么你是不是有点抓狂。

![艰难的选择](http://upload-images.jianshu.io/upload_images/938179-05913b8a4039054d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)

---

## 路在何方

&emsp;&emsp;当然，我可以在Visual Studio（已经有Mac OS X版）下用MFC或者其他框架来写，但是总感觉有点重量级，并且不能移植到其他平台（万一哪天让我写个OS X下的界面呢，想想都不寒而栗啊！）

&emsp;&emsp;所以我想找的就是一个可以跨平台的、轻量级的图形界面开发的库，于是想到了喜欢的Python，然后发现它下面的GUI开发框架还真不少：wxPython, tkInter, PyGtk, PyQt。

- wxPython: 首先官网相当简洁（丑陋），然后快速浏览了一下文档，发现有这块：[Cross-Platform Development Tips](https://link.jianshu.com/?t=http://docs.wxwidgets.org/stable/page_multiplatform.html)，告诉你跨平台要注意哪些东东，看来不是我心中想的那样只需要写一份代码，在不同平台编译一下就可以，于是放弃。
- TkInter: 也在其他地方看到有人推荐这个，但是感觉文档特别乱，网上一些教程也相当简陋，里面界面丑的掉渣，也放弃了。

&emsp;&emsp;后面两个我甚至都没耐心继续看下去了，因为我不经意看到了nw.js，他就像一座灯塔，冥冥之中照亮了前进的方向啊。

## nwjs——路在脚下！

&emsp;&emsp;Github上nw.js有32.8k多Star和接近4K的Fork，说明它已经相当成熟，不会是某个人随兴放的一个并不成熟的技术。并且在Github项目的最后面，显示Intel有赞助这个项目，看起来很牛的样子。而且关于nw.js的资料也特别齐全，首先来看看它的特点：

- 支持用HTML5, CSS3, JS和WebGL来写应用程序，包括桌面端和移动端；
- 完全支持Node.js APIs和所有的第三方模块；
- 性能也不会很差，对于轻量级的应用足够了；
- 对应用进行打包和发布十分简单，也就是说写一份代码很容易移植到不同的平台（包括主流的Linux, Mac OS X 和 Windows）；


&emsp;&emsp;然后作者怕你认为它很难打交道，进而“知难而退”，就在项目主页里用许多slides来介绍它。

![如何运行？](http://xuelangzf-github.qiniudn.com/20151015_what_is_nw.png)

&emsp;&emsp;下面这张slide解决了“怎么用nw.js完成任务？”的问题，

![怎么用nw.js完成任务?](http://xuelangzf-github.qiniudn.com/20151015_how_package.png)

&emsp;&emsp;最后，开发者怕你怀疑nw.js的强大，又提供了几个[Demo](https://link.jianshu.com/?t=https://github.com/zcbenz/nw-sample-apps)和[许多成功的案例](https://link.jianshu.com/?t=https://github.com/nwjs/nw.js/wiki/List-of-apps-and-companies-using-nw.js)来打消我们的顾虑。

## nwjs——目标就在前方！

&emsp;&emsp;nwjs由于采用V8引擎，所以对于web开发人员是友好的。

&emsp;&emsp;决定用nw.js之后，就开始补充相应的知识啦。首先自己没有怎么去学过JavaScript, HTML, CSS这类web方面的语言，不过想来也不会比C++难。学习的成本也应该比学习MFC, wxPython低很多，并且这些语言太基础、使用场景太多了，所以早晚都得了解一下，干脆借这个机会一边学一边做具体的东西。于是买了{《JavaScript DOM编程艺术(第2版)》}(https://link.jianshu.com/?t=https://book.douban.com/subject/6038371/)这本书拿来入门。

> 上面引用别人博客原文，此处过于JS,CSS,HTML5，推荐JS使用 <<深入理解ECMA5>>，如果想要深入推荐学习ECMA6，ECMA5就是JavaScript




&emsp;&emsp;讲了这么多，还没说我具体要做什么呢，其实要做的事情特别简单，就是统计一本书的页码中一共有多少个0，1，2，3，4，5，6，7，8，9。关于这个问题，详细看前面的那篇博客：讲得明白，但写的明白吗？(https://link.jianshu.com/?t=http://zhaofei.tk/2015/10/13/pages_count/)。

**参考下面引用的博客例子，非本人实现**

&emsp;&emsp;实现一个简单的例子，在输入正确的数字时，给出统计结果；输入错误的数字时，则给出错误提示，重置输入框和统计结果。如下：

![计算器](http://xuelangzf-github.qiniudn.com/20151015_input.png)

&emsp;&emsp;实现过程相当简单，特别是对于那些做过web开发的，详细过程就不在这里给出了，只提供一个简单的程序逻辑图吧。

![简单的程序逻辑图](http://xuelangzf-github.qiniudn.com/20151015_nwjs_process.png)

&emsp;&emsp;**源码十分简单，可以在这里(https://gist.github.com/xuelangZF/ce8a570a8e7453c76fd7)找到，结构如下：**

```shell
 tree
.
├── index.html
├── main.js
├── package.json
└── style.css

0 directories, 4 files
```


## nwjs——写完打包成安装包！

&emsp;&emsp;打包到各个平台也有详细的文档，以Win为例，只需要三步即可：

https://github.com/nwjs/nw.js/wiki/how-to-package-and-distribute-your-apps

1. 将所有工程文件，放在一个文件夹下，确保package.json在根目录，然后压缩为.zip格式，并将压缩文件的后缀由.zip改为.nw；
2. 在nw.js的环境目录下执行copy /b nw.exe+you_nw_name.nw you_app_name.exe （这一步之后，就可以在生成的目录中直接运行you_app_name.exe，它依赖同目录下的一些其他库）；
3. 用[Enigma Virtual Box](https://link.jianshu.com/?t=http://enigmaprotector.com/en/aboutvb.html)将you_app_name.exe和依赖的库打包到单个exe文件中，这样我们的应用在没有任何编程环境的win机器上都可以运行。

## nwjs——超值的服务，免费！

&emsp;&emsp;不得不提nw.js开发出的应用已经涵盖了许多领域：

1. [WhatsApp](https://link.jianshu.com/?t=https://web.whatsapp.com/) 经典的聊天应用，还有[Messenger](https://link.jianshu.com/?t=http://messengerfordesktop.com/)；
2. [Powder Player](https://link.jianshu.com/?t=https://github.com/jaruba/PowderPlayer) 种子下载，以及视频播放器；
3. [Boson Editor](https://link.jianshu.com/?t=https://github.com/isdampe/BosonEditorExperimental) 代码编辑器，甚至还有一款Markdown编辑器叫[Story-writer](https://link.jianshu.com/?t=http://soft.xiaoshujiang.com/)；
4. [Leanote Desktop App](https://link.jianshu.com/?t=https://github.com/leanote/desktop-app) 类似Evernote的笔记类应用程序；
5. [Mongo Management Studio](https://link.jianshu.com/?t=http://www.litixsoft.de/english/mms/) 数据库管理应用。

&emsp;&emsp;来欣赏一下一些应用的截图吧，不得不说nw.js开发出的应用一点不比原生的丑陋啊。

[Mongo Management Studio ](https://link.jianshu.com/?t=http://www.litixsoft.de/english/mms/)

![上第二张图](http://mms.litixsoft.de/img/mms_perspective.png)

![Mongo Management Studio](http://xuelangzf-github.qiniudn.com/20151015_apps_mongo.png)

[Soundnode App  ](https://link.jianshu.com/?t=http://www.soundnodeapp.com/)

![Soundnode App](http://xuelangzf-github.qiniudn.com/20151015_apps_soundnode.png)

[交叉编译多个平台](https://www.sitepoint.com/cross-platform-desktop-app-nw-js/)

![交叉编译多个平台](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/12/1480968680NW-js.png)



**看来nw.js赢得了很多青睐，那么还有什么能阻止我们拥抱nw.js呢？。**

---

## 附录

- 如果有的链接打不开，先检查打开的姿势对不对。

-更多文章，请移https://link.jianshu.com/?t=http://selfboot.cn



## 参考博客

http://www.jianshu.com/p/7c66ee28ce51 

https://github.com/nwjs

https://github.com/nwjs

**nw.js项目的源码地址**

https://github.com/nwjs/nw.js

**打包分发APP**

https://github.com/nwjs/nw.js/wiki/how-to-package-and-distribute-your-apps

**参考nw.js的例子**

https://github.com/zcbenz/nw-sample-apps