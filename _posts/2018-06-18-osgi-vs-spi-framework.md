---
layout:     post
title:      "OSGi和ServiceLoaders应用"
subtitle:   "OSGi,SPI"
date:       2018-06-18 10:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - OSGi 
    - SPI
---

# OSGi VS  ServiceLoaders

## OSGi架构

由于eclipse-Studio是使用Eclipse构建的，因此它使用OSGi ，“Java的组件和服务模型”。

使用OSGi的一个重要好处是它有助于使用定义良好的接口保持代码模块化。 在Eclipse中，OSGi捆绑映射到Eclipse插件。

OSGi的第二个好处是它对服务的定义。 插件可以通告它提供某种服务，而其他插件请求该服务。 这允许可插拔接口，由此不同的插件可以以不同的方式提供相同的服务。

同时，Project Jigsaw是Java模块系统的一个实现，将在Java 9中实现。

## Java SPI

但是，Java有自己的提供服务的方法，称为Java-SPI（服务提供者接口）。 它可用于启用框架扩展和可替换组件。 SPI基础结构由通过接口定义的服务组成，其具体实现由各种其他第三方提供。 服务提供者jars通过在META-INF/services/<name_of_SPI>下的jar中包含一个简单的文本文件来声明服务实现，其中一行包含实现SPI的类名。 此基础结构的最后一部分由ServiceLoader组成，ServiceLoader在类路径中搜索可用于各种SPI的服务提供程序的所有jar，一旦找到并加载，它们就可供该服务的所有使用者使用。 Java生态系统越来越多地采用java SPI框架，特别是diirt，jdbc，jaxp，jaxrs和javax。

##  OSGi对比SPI

我们发现SPI和OSGi服务机制不能很好地协同工作。 Java SPI在osgi环境中崩溃...每个bundle都有自己的类加载器（在未加载/可见的模块中不会发现服务提供者），即使在发现服务提供者之后，还有与osgi规则相关的各种其他问题包的导入/导出和包的动态生命周期（ http://coderthoughts.blogspot.com/2011/08/javautilserviceloader-in-osgi.html&http://hwellmann.blogspot.com/2009/04/jdbc -drivers-in-osgi.html ）

在CS-Studio中，我们可以遵循Aries项目作者的理念，该项目表明osgi服务在各种可能的方式都是优越的，因此应该在任何地方使用，除非我们重写上面提到的库，我们还需要更多提出了一个如何在CS-Studio中使用java SPI的机制。

**SPI问题**

- JDK 标准的 SPI 会一次性实例化扩展点所有实现，如果有扩展实现初始化很耗时，但如果没用上也加载，会很浪费资源。

- 如果扩展点加载失败，连扩展点的名称都拿不到了。比如：JDK 标准的 ScriptEngine，通过 getName() 获取脚本类型的名称，但如果 RubyScriptEngine 因为所依赖的 jruby.jar 不存在，导致 RubyScriptEngine 类加载失败，这个失败原因被吃掉了，和 ruby 对应不起来，当用户执行 ruby 脚本时，会报不支持 ruby，而不是真正失败的原因。

- 增加了对扩展点 IoC 和 AOP 的支持，一个扩展点可以直接 setter 注入其它扩展点。

https://github.com/ControlSystemStudio/cs-studio/wiki/OSGi-and-ServiceLoaders
