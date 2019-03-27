---
layout:     post
title:      "Spring中的XML解析机制"
date:       2018-09-05 13:45:45
author:     "CaoZhiLong"
header-img: "img/post-bg-2015.jpg"
tags:
    - Spring
---

## 前言

今天先写spring的IOC。IOC的概念控制反转，我的体会是spring通过xml的配置，把一些属性的实例化本来是由我们自己程序做的事情交给了spring的IOC容器。不过这是最简单的，spring还帮我们做了其他很多的工作。不过我认为IOC最核心的工作也就是这个了。

开始我读spring的源代码是根据下载的spring技术内幕pdf资料。由于我下载的是spring3.0的，而这个pdf是2.0的。然后又懵懵懂懂的读下去，遇到不懂的就看源代码和调试。这样下来几天了还没有什么进展。后面我想了一下，觉得不应该这样研究。应该是找到目标，然后再有目的性的研究。这样下来，效率高多了。虽然我以前研究也都是根据问题然后有目的性的研究，但是这些都没有很好的规范。所以执行起来还是比较乱。
  
  
 今天先从以下两个角度细分

1. Spring怎么读取xml配置文件的
2. Spring怎么设置其属性的

## Spring如何读取xml配置

读取配置文件的入口是 ```java XmlBeanDefinitionReader ``` 这个类。其中有一个这样的方法

```java
package org.springframework.beans.factory.xml;
public class XmlBeanDefinitionReader extends AbstractBeanDefinitionReader {

	/**
	 * Actually load bean definitions from the specified XML file.
	 * @param inputSource the SAX InputSource to read from
	 * @param resource the resource descriptor for the XML file
	 * @return the number of bean definitions found
	 * @throws BeanDefinitionStoreException in case of loading or parsing errors
	 * @see #doLoadDocument
	 * @see #registerBeanDefinitions
	 */
	protected int doLoadBeanDefinitions(InputSource inputSource, Resource resource)
			throws BeanDefinitionStoreException {
		try {
			Document doc = doLoadDocument(inputSource, resource);
			return registerBeanDefinitions(doc, resource);
		}
		catch (BeanDefinitionStoreException ex) {
			throw ex;
		}
		catch (SAXParseException ex) {
			throw new XmlBeanDefinitionStoreException(resource.getDescription(),
					"Line " + ex.getLineNumber() + " in XML document from " + resource + " is invalid", ex);
		}
		catch (SAXException ex) {
			throw new XmlBeanDefinitionStoreException(resource.getDescription(),
					"XML document from " + resource + " is invalid", ex);
		}
		catch (ParserConfigurationException ex) {
			throw new BeanDefinitionStoreException(resource.getDescription(),
					"Parser configuration exception parsing XML from " + resource, ex);
		}
		catch (IOException ex) {
			throw new BeanDefinitionStoreException(resource.getDescription(),
					"IOException parsing XML document from " + resource, ex);
		}
		catch (Throwable ex) {
			throw new BeanDefinitionStoreException(resource.getDescription(),
					"Unexpected exception parsing XML document from " + resource, ex);
		}
	}


}
```
