---
layout:     post
title:      "Java虚拟机：Metaspace"
subtitle:   "jvm,jdk8"
date:       2019-01-01 10:18:56
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - jvm
    - JDK8
---

# Java虚拟机：Metaspace


**被废弃的持久代**

想起之前面试的时候有面试官问起过我一个问题：Java 8为什么要废弃持久代即Metaspace的作用。由于当时使用的Java 7且研究重心不在JVM上，一下没有回答上来，今天突然想起这个问题，就详细总结一下这个问题。

首先我们看一张JVM内存布局的图：

![JVM内存布局](https://images2018.cnblogs.com/blog/801753/201804/801753-20180401164846766-809607195.png)

![JVM内存布局](/img/arct/hotspot-jvm-construct.png)


注意到里面有一块METHOD AREA，它是一块线程共享的对象，名为方法区，在HotSpot虚拟机中，这块METHOD AREA我们可以认为等同于持久代（PermGen），在Java 6及之前的版本，持久代存放了以下一些内容：

* 虚拟机加载的类信息
* 常量池
* 静态变量
* 即时编译后的代码

到了**Java 7之后，常量池已经不在持久代之中进行分配了，而是移到了堆中**，即常量池和对象共享堆内存。

接着到了Java 8之后的版本（至此篇文章，Java 10刚发布），持久代已经被永久移除，取而代之的是Metaspace。

**为什么要移除持久代**

HotSpot团队选择移除持久代，有内因和外因两部分，从外因来说，我们看一下[JEP 122](http://openjdk.java.net/jeps/122)的Motivation（动机）部分：

<pre>
This is part of the JRockit and Hotspot convergence effort. JRockit customers do not need to configure the permanent generation (since JRockit does not have a permanent generation) and are accustomed to not configuring the permanent generation.
</pre>

这是JRockit和Hotspot融合工作的一部分。JRockit客户不需要配置永久代（因为JRockit没有永久代）并且习惯于不配置永久代。


将Hotspot中永久代的部分内容移动到Java堆，将剩余部分的内容移动到本机内存。

Hotspot对Java类的表示（此处称为类元数据）当前存储在Java堆的一部分中，称为永久生成。此外，实体化的字符串和类静态变量存储在永久代中。永久代由Hotspot管理，并且必须有足够的空间容纳所有类元数据，Java应用程序使用的内部字符串和类静态。类加载类时，在永久代中分配类元数据和静态，并在卸载类时从永久代收集垃圾。当永久代生成GC时，Interned Strings也会被垃圾收集。

建议的实现将在本机内存中分配类元数据，并将实际的字符串和类静态移动到Java堆。Hotspot将为类元数据显式分配和释放本机内存。新类元数据的分配将受可用本机内存量的限制，而不是由-XX：MaxPermSize的值固定，无论是默认值还是在命令行上指定。

用于类元数据的本机存储器的分配将以足够大的块来完成，以适合多个类元数据。每个块都将与一个类加载器相关联，并且该类加载器加载的所有类元数据将由Hotspot从该类加载器的块中分配。根据需要，将为类加载器分配附加块。块大小将根据应用程序的行为而变化。将选择尺寸以限制内部和外部碎片。当类加载器通过释放与类加载器相关联的所有块而死亡时，将释放类元数据的空间。类的元数据在课程期间不会被移动。

从内因来说，持久代大小受到-XX：PermSize和-XX：MaxPermSize两个参数的限制，而这两个参数又受到JVM设定的内存大小限制，这就导致**在使用中可能会出现持久代内存溢出的问题**，因此在Java 8及之后的版本中彻底移除了持久代而使用Metaspace来进行替代。

**Metaspace**

> 上面说了，为了避免出现持久代内存溢出的问题; 并且可以支持不同应用程序之间进行类共享而减少内存开销(可能会降低性能)，，Java 8及之后的版本彻底移除了持久代而使用Metaspace来进行替代。

Metaspace是方法区在HotSpot中的实现，它与持久代最大的区别在于：**Metaspace并不在虚拟机内存中而是使用本地内存**。因此Metaspace具体大小理论上取决于32位/64位系统可用内存的大小，可见也不是无限制的，需要配置参数。

接着我们模拟一下Metaspace内存溢出的情况，前面说了持久代存放了以下信息：

* 虚拟机加载的类信息(类元数据)
* 实体化的字符串
* 静态类变量
* 常量池
* 即时编译后的代码

所以最简单的模拟Metaspace内存溢出，我们只需要无限生成类信息即可，类占据的空间总是会超过Metaspace指定的空间大小的，下面用Cglib来模拟：



```java
public class MetaspaceOOMTest {

    /**
     * JVM参数:-XX:MetaspaceSize=8m -XX:MaxMetaspaceSize=128m -XX:+PrintFlagsInitial
     */
    public static void main(String[] args) {
        int i = 0;
        
        try {
            for (;;) {
                i++;
                
                Enhancer enhancer = new Enhancer();
                enhancer.setSuperclass(OOMObject.class);
                enhancer.setUseCache(false);
                enhancer.setCallback(new MethodInterceptor() {
                    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
                        return proxy.invokeSuper(obj, args);
                    }
                });
                enhancer.create();
            }
        } catch (Exception e) {
            System.out.println("第" + i + "次时发生异常");
            e.printStackTrace();
        }
    }
    
    static class OOMObject {
        
    }
    
}
```
虚拟机参数设置为"-XX:MetaspaceSize=8m -XX:MaxMetaspaceSize=128m"，运行代码，结果为：
```
第15562次时发生异常
net.sf.cglib.core.CodeGenerationException: java.lang.reflect.InvocationTargetException-->null
    at net.sf.cglib.core.AbstractClassGenerator.generate(AbstractClassGenerator.java:345)
    at net.sf.cglib.proxy.Enhancer.generate(Enhancer.java:492)
    at net.sf.cglib.core.AbstractClassGenerator$ClassLoaderData.get(AbstractClassGenerator.java:114)
    at net.sf.cglib.core.AbstractClassGenerator.create(AbstractClassGenerator.java:291)
    at net.sf.cglib.proxy.Enhancer.createHelper(Enhancer.java:480)
    at net.sf.cglib.proxy.Enhancer.create(Enhancer.java:305)
    at org.xrq.commom.test.jvm.MetaspaceOOMTest.main(MetaspaceOOMTest.java:34)
Caused by: java.lang.reflect.InvocationTargetException
    at sun.reflect.GeneratedMethodAccessor1.invoke(Unknown Source)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)
    at java.lang.reflect.Method.invoke(Unknown Source)
    at net.sf.cglib.core.ReflectUtils.defineClass(ReflectUtils.java:413)
    at net.sf.cglib.core.AbstractClassGenerator.generate(AbstractClassGenerator.java:336)
    ... 6 more
Caused by: java.lang.OutOfMemoryError: Metaspace
    at java.lang.ClassLoader.defineClass1(Native Method)
    at java.lang.ClassLoader.defineClass(Unknown Source)
    ... 11 more
```

**针对jvm8优化**

* 在内存较低的机器如(4c8g),jvm本身可能占用较大内存如2g，这将限制元数据的大小可能导致OOM异常,合理计算内存


## 参考文献
 
[Java虚拟机16：Metaspace](https://www.cnblogs.com/xrq730/p/8688203.html)

