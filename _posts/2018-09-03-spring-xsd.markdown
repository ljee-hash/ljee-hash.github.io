---
layout:     post
title:      "Spring中的XML schema扩展机制"
date:       2018-09-03 13:45:45
author:     "CaoZhiLong"
header-img: "img/post-bg-2015.jpg"
tags:
    - Spring
---

## 前言

很久没有写关于 Spring 的文章了，最近在系统梳理 Dubbo 代码的过程中发现了 XML schema 这个被遗漏的知识点。由于工作中使用 SpringBoot 比较多的原因，几乎很少接触 XML，此文可以算做是亡羊补牢，另一方面，也为后续的 Dubbo 源码解析做个铺垫。。

XML schema 扩展机制是啥？这并不是一块很大的知识点，翻阅一下 Spring 的文档，我甚至没找到一个贯穿上下文的词来描述这个功能，XML Schema Authoring 是文档中对应的标题，简单来说：

> Spring 为基于 XML 构建的应用提供了一种扩展机制，用于定义和配置 Bean。 它允许使用者编写自定义的 XML bean 解析器，并将解析器本身以及最终定义的 Bean 集成到 Spring IOC 容器中。

```xml

<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:dubbo="http://code.alibabatech.com/schema/dubbo"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.5.xsd
    http://code.alibabatech.com/schema/dubbo http://code.alibabatech.com/schema/dubbo/dubbo.xsd
    ">

    <!-- current application configuration -->
    <dubbo:application name="demo-provider"/>

    <!-- registry center configuration -->
    <dubbo:registry address="N/A"/>

    <!-- service configuration -->
    <dubbo:service id="service" interface="com.alibaba.dubbo.config.spring.api.DemoServiceSon" ref="demoService"/>

    <bean id="demoService" class="com.alibaba.dubbo.config.spring.impl.DemoServiceSonImpl"/>

</beans>

```



Dubbo 依赖了 Spring，并提供了一套自定义的 XML 标签，<dubbo:application> ,<dubbo:registry> ,<dubbo:protocol>,<dubbo:service>。作为使用者，大多数人只需要关心这些参数如何配置，但不知道有没有人好奇过，它们是如何加载进入 Spring 的 IOC 容器中被其他组件使用的呢？这便牵扯出了今天的主题：Spring 对 XML schema 的扩展支持。


## 自定义 XML 扩展


**完成XML自定义扩展，需要下面几个步骤:**

![XML自定义扩展步骤](https://upload-images.jianshu.io/upload_images/1329440-740c239f41566b16.png)

1. 创建一个 XML Schema 文件，描述自定义的合法构建模块，也就是xsd文件

2. 自定义个处理器类，并实现NamespaceHandler接口(比较容易)

3. 自定义一个或多个解析器，实现BeanDefinitionParser接口(最关键的部分)

4. 注册上面的组件到Spring IOC容器中


我们的目的便是想要实现一个 myns XML schema，我们的项目中可以自定义 demo.xml，在其中会以 myns 为标签来定义不同的类，并在最终的测试代码中验证这些声明在 demo.xml 的类是否被 Spring 成功加载。大概像这样，是不是和 dubbo.xml 的格式很像呢？


```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:myns="http://code.jd.com/schema/myns"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.3.xsd
    http://code.xxx.com/schema/myns http://code.xxx.com/schema/myns.xsd
    ">

<myns:dateformat id="testDateFormat"
                 pattern="yyyy-MM-dd HH:mm"/>
</beans>
```

## 动手实现

有了明确的目标，我们逐步开展自己的工作。

## 编写my.xsd


resources/META-INF/my.xsd

```xsd
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="http://code.jd.com/schema/myns"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:beans="http://www.springframework.org/schema/beans"
            targetNamespace="http://code.xxx.com/schema/myns"
            elementFormDefault="qualified" attributeFormDefault="unqualified">
    <xsd:import namespace="http://www.springframework.org/schema/beans"/>
    <!--
        用法:
        <myns:dateformat id="dateFormat" pattern="yyyy-MM-dd HH:mm" />
        或
        <bean id="dateFormat" class="java.text.SimpleDateFormat">
            <constructor-arg value="yyyy-HH-dd HH:mm"/>
        </bean>
    -->
    <xsd:element name="dateformat">
        <xsd:complexType>
            <xsd:complexContent>
                <xsd:extension base="beans:identifiedType">
                    <xsd:attribute name="pattern" type="xsd:string" use="required"/>
                </xsd:extension>
            </xsd:complexContent>
        </xsd:complexType>
    </xsd:element>

</xsd:schema>
```
① 注意这里的 targetNamespace="http://code.xxx.com/schema/myns" 这便是之后 myns 标签的关键点。
② my.xsd 定义了元素： dateformat，出于简单考虑，都只有一个 pattern 字段。


> schema 的意义在于它可以和 eclipse/IDEA 这样智能化的集成开发环境形成很好的搭配，在编辑 XML 的过程中，用户可以获得告警和提示。 如果配置得当，可以使用自动完成功能让用户在事先定义好的枚举类型中进行选择。

2 编写DateformatNamespaceHandler

```java

import org.springframework.beans.factory.xml.NamespaceHandlerSupport;

public class DateformatNamespaceHandler extends NamespaceHandlerSupport{

    public void init() {
        registerBeanDefinitionParser("dateformat", new DeteformatDefinitionParser());
    }

}

```

完成 schema 之后，还需要一个 NamespaceHandler 来帮助 Spring 解析 XML 中不同命名空间的各类元素。


```xml
<myns:dateformat id="testDateFormat" pattern="yyyy-MM-dd HH:mm"/>
```


不同的命名空间需要不同的 NamespaceHandler 来处理，在今天的示例中，我们使用 DateformatNamespaceHandler 来解析 myns 命名空间。DateformatNamespaceHandler 继承自 NamespaceHandlerSupport 类，并在其 init() 方法中注册了两个 BeanDefinitionParser ，用于解析 myns 命名空间/myns.xsd 约束中定义的元素：dateformat。BeanDefinitionParser 是下一步的主角，我们暂且跳过，将重心放在父类 NamespaceHandlerSupport 之上。

```java
public interface NamespaceHandler {
   void init();
   BeanDefinition parse(Element element, ParserContext parserContext);
   BeanDefinitionHolder decorate(Node source, BeanDefinitionHolder definition, ParserContext parserContext);
}
```

NamespaceHandlerSupport 是 NamespaceHandler 命名空间处理器的抽象实现，我粗略看了NamespaceHandler 的几个实现类，parse 和 decorate 方法可以完成元素节点的组装并通过 ParserContext 注册到 Ioc 容器中，但实际我们并没有调用这两个方法，而是通过 init() 方法注册 BeanDefinitionParser 来完成解析节点以及注册 Bean 的工作，所以对于 NamespaceHandler，我们主要关心 init 中注册的两个 BeanDefinitionParser 即可。


3 编写DeteformatDefinitionParser
在文章开始我们便标记到 BeanDefinitionParser 是最为关键的一环，每一个 BeanDefinitionParser 实现类都负责一个映射，将一个 XML 节点解析成 IOC 容器中的一个实体类。


```java
import org.springframework.beans.factory.xml.AbstractSingleBeanDefinitionParser;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.w3c.dom.Element;
import java.text.SimpleDateFormat;

/**
 * 解析定义的标签
 * <myns:dateformat id="dateFormat" pattern="yyyy-MM-dd HH:mm" />
 */
public class DeteformatDefinitionParser extends AbstractSingleBeanDefinitionParser{

    @Override
    protected Class<?> getBeanClass(Element element) {
        return SimpleDateFormat.class;
    }

    @Override
    protected void doParse(Element element, BeanDefinitionBuilder beanDefinitionBuilder) {

        //解析pattern配置项
        String pattern = element.getAttribute("pattern");
        beanDefinitionBuilder.addConstructorArgValue(pattern);
    }

}

```



由于我们的实体类是非常简单的，所以不存在很复杂的解析代码，而实际项目中，往往需要大量的解析步骤。parse 方法会解析一个个 XML 中的元素，使用 RootBeanDefinition 组装成对象，并最终通过 parserContext 注册到 IOC 容器中。

至此，我们便完成了 XML 文件中定义的对象到 IOC 容器的映射。

### 4 注册schema和handler

最后一步还需要通知 Spring，告知其自定义 schema 的所在之处以及对应的处理器。

resources/META-INF/spring.handlers

```shell
http\://code.xxx.com/schema/myns=com.xxx.app.server.spi.config.schema.DateformatNamespaceHandler
```

resources/META-INF/spring.schemas

```shell
http\://code.xxx.com/schema/myns.xsd=META-INF/my.xsd
```


没有太多可以说的，需要遵守 Spring 的约定。

至此一个自定义的 XML schema 便扩展完成了，随后来验证一下。

## 验证扩展

我们首先定义好 demo.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:myns="http://code.jd.com/schema/myns"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.3.xsd
    http://code.xxx.com/schema/myns http://code.xxx.com/schema/myns.xsd
    ">

<myns:dateformat id="testDateFormat"
                 pattern="yyyy-MM-dd HH:mm"/>
</beans>
```
使用 Spring 去加载它，并验证 IOC 容器中是否存在注册成功的 Bean。


```java
public class ConfigTest {


    @Test
    public void testSpringDateFormat() {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext(ConfigTest.class.getPackage().getName().replace('.', '/') + "/demo.xml");
        ctx.start();
        try {
            SimpleDateFormat dateFormat = (SimpleDateFormat) ctx.getBean("testDateFormat");
            assertNotNull(dateFormat);
            try {
                String date = "2010-10-10 11:12:14";
                SimpleDateFormat ymdhms = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date time = ymdhms.parse(date);
                String dateFormatStr = dateFormat.format(time);
                assertTrue("2010-10-10 11:12".equals(dateFormatStr));
            } catch (ParseException e) {
                //执行解析发生异常
                e.printStackTrace();
            }
        } finally {
            ctx.stop();
            ctx.close();
        }
    }


}

```

观察控制台的输出：

2010-10-10 11:12

一个基础的基于 XML schema 的扩展便完成了。

### Dubbo中的XML schema扩展

最后我们以 Dubbo 为例，看看一个成熟的 XML schema 扩展是如何被应用的。

![Dubbo中的应用](http://kirito.iocoder.cn/image-20180903190429383.png)

刚好对应了四个标准的扩展步骤，是不是对 XML 配置下的 Dubbo 应用有了更好的理解了呢？

顺带一提，仅仅完成 Bean 的注册还是不够的，在“注册”的同时，Dubbo 还进行了一系列其他操作如：暴露端口，开启服务器，完成注册中心的注册，生成代理对象等等行为，由于不在本文的范围内，后续的 Dubbo 专题会专门介绍这些细节，本文便是了解 Dubbo 加载流程的前置文章了。




