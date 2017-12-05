---
layout:     post
title:      "轻量级桌面应用开发nw.js之三--基本程序结构与配置"
subtitle:   "跨平台开发,轻量级桌面应用"
date:       2017-12-04 21:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-app-interface-test.jpg"
tags:
    - IDE
    - DeskTop dev
---





# 轻量级桌面应用开发nw.js之三--基本程序结构与配置

## 引言

&emsp;&emsp;本节开始，部分内容参照我们的nwjs前辈[**玄魂**](http://m.blog.csdn.net/zeping891103/article/details/50728834)的文章，其中也会加入博主在使用nwjs开发项目过程中总结的一些实战经验。我们都是站在巨人的肩上继续努力学习，去其糟粕留其精华，好的技术就应该不断总结和传播，那么我们现在开始吧！

## （一）基本程序结构

![基本程序结构](http://img.blog.csdn.net/20160224113149144?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)


&emsp;&emsp;如上图，是一个nw程序的基本组织结构，在根目录下有**package.json**（程序的配置文件）和**index.html**（可以是任意名称，应用的启动页面）；**js/css/resources**分别是应用的样式、脚本、和资源文件（html、图片等）**；node_modules**存放**node.js**的扩展组件。这只是一个通用的基本组织结构，实际项目的组织结构，不必一定按照此结构进行搭建，如项目使用的是js模块化编程require框架的。最终的组织结构以适应实际项目为准，但++文件package.json和index.html必须放在根目录下++。

## （二）配置文件package.json

&emsp;&emsp;nw在启动应用程序时，首先要读取**package.json**文件，初始化基本属性，下面我们看看**package.json**的完整参数。每个参数配置都标有注释。

```js
{
	/**字符串必须是小写字母或者数字，可以包含.或者_或者-不允许带空格。name必须全局唯一。*/
	"name": "MiniCodeEdit",
	/**程序版本号*/
	"version": "0.1.0",	
	/**程序描述*/
	"description": "简单的代码编辑器.",
	/**指定程序的起始页面。G:\dev\bin\windowsAppDev\bin\my\package.nw\LandDB\demo\info_detail_landdb.html*/
	/**"main": "main.html",	*/
	/** "main": "./LandDB/demo/info_detail_product.html",*/
	"main" : "./examples/LandDB/demo/info_detail_product.html",
	/**关键字*/
	"keywords": ["demo","node-webkit"],
	/**bool值，如果设置为false，将禁用webkit的node支持。*/
	"nodejs": true,
	/**
	* 指定一个node.js文件，当程序启动时，该文件会被运行，启动时间要早于node-webkit加载html的时间。
	* 它在node上下文中运行，可以用它来实现类似后台线程的功能。
	* （不需要可注释不用）
	*/
	//"node-main": "js/node.js",
	/**
	* bool值。默认情况下，如果将node-webkit程序打包发布，那么只能启动一个该应用的实例。
	* 如果你希望允许同时启动多个实例，将该值设置为false。
	*/
	"single-instance": true,
	
	/** 浏览器参数设置 */
	/** "chromium-args" : "--disable-devtools --enable-experimental-web-platform-features -ignore-certificate-errors",*/
	
	/**窗口属性设置 */
	"window": {
		/**字符串，设置默认title。*/
		/** "title": "Mini代码编辑器", */
		"title": "Mini宣传测试",
		/**是否显示标题栏*/
		"show": false,
		/**窗口的icon。*/
		"icon": "link.png",
		/**bool值。是否显示导航栏。*/
		"toolbar": true,
		/**bool值。是否允许调整窗口大小。*/
		"resizable": true,
		
		"transparent" : false,
		
		"frame" : false,
		/**是否全屏*/
		"fullscreen": false,
		/**是否在win任务栏显示图标*/
		"show_in_taskbar": true,
		/**bool值。如果设置为false，程序将无边框显示。*/
		"frame": true,
		/**字符串。窗口打开时的位置，可以设置为“null”、“center”或者“mouse”。*/
		"position": "center",
		/**主窗口的的宽度。*/
		"width": 1366,
		/**主窗口的的高度。*/
		"height": 670,
		/**窗口的最小宽度。*/
		"min_width": 400,
		/**窗口的最小高度。*/
		"min_height": 335,
		/**窗口显示的最大宽度，可不设。*/
		/** "max_width": 800, */
		/**窗口显示的最大高度，可不设。*/
		/** "max_height": 670, */
		/**bool值，如果设置为false，启动时窗口不可见。*/
		"show": true,
		/**是否在任务栏显示图标。*/
		"show_in_taskbar":true,
		/**
		 * bool值。是否使用kiosk模式。如果使用kiosk模式，
		 * 应用程序将全屏显示，并且阻止用户离开应用。
		 * */
		"kiosk": false
	},
	/**webkit设置*/
	"webkit": {
		/**bool值，是否加载插件，如flash，默认值为false。*/
		"plugin": true,
		/**bool值，是否加载Java applets，默认为false。*/
		"java": false,
		/**bool值，是否启用页面缓存，默认为false。*/
		"page-cache": false
	},
	"scripts": {
		"start": "nw ."
	}
}
```

&emsp;&emsp;在上面的配置中，main和name是必须的属性。其他简单明了的就大伙就直接看注释吧，讲几个比较难理解的参数配置。

1. "node-main"配置：指定一个js文件，该js文件是启动程序时最早运行文件，在node-main脚本中还可以访问全局的“window”对象，它指向DOM窗口，但是如果页面导航发生变化，访问到的window对象也会发生变化。因为它执行时间要早于DOM加载，所以要等页面加载完毕，才能使用“window”对象。同时，在DOM页面中，可以通过process.mainModule来获取node-main信息。
2. "single-instance"配置：简单地说，是指是否允许同时打开多个nw应用。
3. "kiosk"配置：如果该配置设为ture，则显示为全屏模式并屏蔽关闭按钮，即该显示器将会一直停留在nw应用的显示界面，类似于银行的排队等待办理业务的取票机界面。

&emsp;&emsp;还有一些++不经常使用++的参数如下：

```
应用发起http请求时，使用的user-agent头信息。下列占位符可以被替换：
%name: 替换配置中的name属性
%ver: 替换配置中的version属性
%nwver: 被node-webkit版本信息替换.
 %webkit_ver: 被WebKit 引擎的版本信息替换.
%osinfo: 被 操作系统和 CPU 信息 替换，在浏览器的 user agent 字符串中可以被看到.
```
**示例配置：**

```json
{
	"user-agent": "测试 %ver  %nwver %webkit_ver  windows7" /* 替换占位符内容即可 */
}
```

**chromium-args**

&emsp;&emsp;string类型，自定义chromium启动参数。详细的参数列表

```

http://src.chromium.org/svn/trunk/src/content/public/common/content_switches.cc [项目已经变更目录]

https://src.chromium.org/viewvc/chrome/trunk/src/content/public/common/content_switches.cc

https://src.chromium.org/viewvc/chrome/trunk/src/content/public/common/content_switches.cc?view=log
```

**js-flags**

&emsp;&emsp;string类型，传递给js引擎（V8）的参数。例如，想启用Harmony Proxies和 Collections功能，可以使用如下配置方式：

```
{
<span style="white-space:pre">	</span>"js-flags": "--harmony_proxies --harmony_collections"
}
```

**inject-js-start / inject-js-end**

&emsp;&emsp;string 类型。指定一个js文件。

&emsp;&emsp;对于inject-js-start，该js文件会在所有css文件加载完毕，dom初始化之前执行。

&emsp;&emsp;对于inject-js-end，该js文件会在页面加载完毕，onload事件触发之前执行。


**snapshot**

&emsp;&emsp;string类型，应用程序的快照文件路径。包含编译的js代码。使用快照文件可以有效的保护js代码。后续文章会详细介绍。


**dom_storage_quota**

&emsp;&emsp;int类型，dom 存储的限额（以自己为单位）。建议限制为你预想大小的2倍。

**no-edit-menu**

&emsp;&emsp;bool值，Edit菜单是否显示。仅在Mac系统下有效。

**maintainers**

&emsp;&emsp;软件维护者信息，是一个数组，每个维护人的信息中，name字段是必须字段，其他两个（email和web）是可选字段。示例如下：

```js
{
	"maintainers":[ {
   		"name": "Bill Bloggs",
   		"email": "billblogs@bblogmedia.com",
   		"web": "http://www.bblogmedia.com",
	}]
}
```

**contributors**

&emsp;&emsp;贡献者信息，格式同maintainers，按照约定，第一个contributor是该应用的作者。

**bugs**

&emsp;&emsp;提交bug的url。可以是“mailto：”或者“http://”格式。

**licenses**

&emsp;&emsp;一个数组，可以包含多个声明。每个声明包含“type”和“url”两个属性，分别指定声明的类型和文本。示例如下：

```js
{
	"licenses": [
  	 {
       		"type": "GPLv2",
       		"url": "http://www.example.com/licenses/gpl.html",
   	}]
}
```

**repositories**

&emsp;&emsp;程序包的存储地址数组，type和url指定可以下载或者克隆程序包的地址，如果程序包不在根目录中，需要在path属性指定相对目录。示例如下：

```js
{
	"repositories": [
       		{
            		"type": "git",
            		"url": "http://github.com/example.git",
           		"path": "packages/mypackage"
       		}]
}
```


**小贴士**：想更全面地了解配置信息：可参考https://github.com/nwjs/nw.js/wiki/Manifest-format