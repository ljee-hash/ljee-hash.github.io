---
layout:     post
title:      "java+Opencv环境搭建"
subtitle:   "面向对象,Opencv"
date:       2017-11-21 17:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-SOAPvsRestful.pngg"
tags:
    - OOA
    - Tree
---

# java+Opencv环境搭建

## 引言

**java环境为：**

&emsp;&emsp;Opencv版本为opencv2.4.4

&emsp;&emsp;按照上面的方法，在每次使用时都需要建立libs及其子文件夹，并需要添加各种jar文件，在OpenCV的官网上给出了配置流程：

http://docs.opencv.org/2.4.4-beta/doc/tutorials/introduction/desktop_java/java_dev_intro.html


1 创建一个Java项目：

File -> New -> Java Project, 命名为"HelloCV"

2 配置Java Build Path:

2.1 右击项目 -> Build Path -> Configure Build Path -> Libraries -> Add Library

2.2 选择 User Library，依次点击Next -> User Libraries -> New

2.3 在弹出来的对话框中输入OpenCV-2.4.4，然后点击OK

2.4 选择Add External JARs, 找到opencv-244.jar文件并添加

（我的OpenCV2.4.4安装路径为：D:OpenCV-2.4.4

opencv-244.jar文件的路径为：D:OpenCV-2.4.4opencvbuildjava）


**2.5 然后选择Native library location:(None),点击右侧Edit**

**添加 D:OpenCV-2.4.4opencvbuildjavax86[此处版本跟随JDK的版本]**

**然后点击OK，配置完毕(避免错误)**

## 输入测试代码：
&emsp;&emsp;添加Java class文件，

Main.java

```java
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;

public class Main {

    public static void main(String[] args) {
        System.out.println("Welcome to OpenCV " + Core.VERSION);
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        Mat m  = Mat.eye(3, 3, CvType.CV_8UC1);
        System.out.println("m = " + m.dump());
    }

}

```

**输出结果:**

```java
Welcome to OpenCV 2.4.11.0
m = [1, 0, 0;
  0, 1, 0;
  0, 0, 1]
```



http://www.aizhuanji.com/a/DVZKg5nW.html