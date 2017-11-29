---
layout:     post
title:      "两种自定义XSD文件Eclipse分析验证XML文档合法方式"
subtitle:   "XML,XSD"
date:       2015-09-12 17:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - XSD
    - XML
    - Eclipse
---

# 两种自定义XSD文件Eclipse进行分析验证的方式

## 摘要

&emsp;&emsp;在开发时，常常需要其他的开发人员进行配置XML，然而如验证第N方人员配置的XML是否正确。一般情况下，当XML配置文件内容较少时，使用手工的方式验证XML的内容是否正确非常容易，然而当配置内容和配置的XML非常多时，使用使用手工验证配置文件就有点费劲了。

&emsp;&emsp;基于上述描述的场景，如何让程序进行分析验证XML文档是否正确的方式呢？在这里个人介绍两种自定义XSD文件Eclipse进行分析验证XML文档方式,可以根据情况选择两者之一来完成:

1. **方法1：通过在项目中包含XML Schema文件来实现**
2. **方法2：用Eclipse插件实现**

## **方法1：通过在项目中包含XML Schema文件来实现**

### 第一步，定义一个XSD描述文档限制XML每个标签应该填充的内容

foo.xsd

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:element name="foobar">
    <xsd:complexType>
      <xsd:sequence>
        〜
      </xsd:sequence>
    </xsd:complexType>
  </xsd:element>
</xsd:schema>
```

### 第二步，创建一个xml引入前面创建的foo.xsd文件

XXMap.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<foobar xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="foo.xsd">
  〜
</foobar>
```

### 第三步，以Eclipse为例

&emsp;&emsp;选中XXMap.xml的文件，右键打开验证选项(未汉化的请选择validation)，即可验证XML文档是否符合要求


## **方法2：用Eclipse插件实现**

&emsp;&emsp;假设XMLSchema名称为 http://caozhilong.github.io/sample/XMLSchema/foo.xsd


### 创建一个Eclipse插件(作用使Eclipse有foo.xsd文档)

1. 选择主菜单上的“文件”
2. 从“文件”菜单中选择“新建”
3. 从“新建”菜单中选择“项目...”
4. 从“选择向导”对话框中选择“插件项目”
5. 在标有“插件项目”的页面上写上项目名称
6. 取消选中同一页面上的“创建Java项目”复选框
7. 按下同一页面上的“下一步”按钮
8. 按“完成”按钮
9. 将plugin.xml添加到创建的项目
10. 选择plugin.xml的“Summary”选项卡并选中“Singleton this plugin”复选框
11. 在项目下创建一个xsd文件夹
12. 使xsd/foo.xsd，plugin.xml，build.properties如下
13. 双击plugin.xml并选择出现的屏幕的“Overview”选项卡
14. 在“概览”选项卡上的“导出向导”中创建一个插件
15. 将作为插件创建的jar文件存储在Eclipse的Plugins文件夹中
16. 重新启动Eclipse

**xsd/foo.xsd**
```xml
<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:element name="foobar">
    <xsd:complexType>
      <xsd:sequence>
        〜
      </xsd:sequence>
    </xsd:complexType>
  </xsd:element>
</xsd:schema>
```
**plugin.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?eclipse version="3.4"?>
<plugin>
  <extension point="org.eclipse.wst.xml.core.catalogContributions">
    <catalogContribution>
      <!-- 链接的XML模式名称和XSD文件 -->
      <system systemId="http://caozhilong.github.io/sample/XMLSchema/foo.xsd"
              uri="xsd/foo.xsd"/>
      <!-- 如果你有一个以上的XML模式，填补了系统标签继续在这里 -->
    </catalogContribution>
  </extension>
</plugin>
```
**build.properties**

```properties
# META-INF/MANIFEST.MF和XML模式文件，设置包括在插件在plugin.xml 
bin.includes = META-INF/,\
               .,\
               xsd/,\
               plugin.xml
```


### 编写一个XML文件

&emsp;&emsp;**用XSD编写XML模式**

**XXMap.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<foobar xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="http://caozhilong.github.io/sample/XMLSchema"
        xsi:schemaLocation="http://caozhilong.github.io/sample/XMLSchema http://caozhilong.github.io/sample/XMLSchema/foo.xsd">
  〜
</foobar>
```

### 确认XML存放的目录

&emsp;&emsp;**请从Eclipse设置中显示XML目录。**，设置引入xsd文件存放的目录；请确保列出自己的XSD文件被Eclipse加载

### 使用Eclipse进行验证

&emsp;&emsp;选中XXMap.xml的文件，右键打开验证选项(未汉化的请选择validation)，即可验证XML文档是否符合要求
