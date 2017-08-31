---
layout:     post
title:      "UML图中类之间的关系:依赖,泛化,关联,聚合,组合,实现"
subtitle:   "uml class string interface java"
date:       2016-08-22 10:02:13
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-uml.jpg"
tags:
    - 设计模式
    - Java
    - OOA
    - uml
    - interface
---



##### 类与类图
1) 类(Class)封装了数据和行为，是面向对象的重要组成部分，它是具有相同属性、操作、关系的对象集合的总称。
2) 在系统中，每个类具有一定的职责，职责指的是类所担任的任务，即类要完成什么样的功能，要承担什么样的义务。一个类可以有多种职责，设计得好的类一般只有一种职责，在定义类的时候，将类的职责分解成为类的属性和操作（即方法）。
3) 类的属性即类的数据职责，类的操作即类的行为职责

## 一、依赖关系(Dependence)
---
**依赖关系**（Dependence）：假设A类的变化引起了B类的变化，则说名B类依赖于A类。

- 依赖关系(Dependency) 是一种使用关系，特定事物的改变有可能会影响到使用该事物的其他事物，在需要表示一个事物使用另一个事物时使用依赖关系。**大多数情况下，依       赖关系体现在某个类的方法使用另一个类的对象作为参数。**
- 在UML中，依赖关系用带箭头的虚线表示，由依赖的一方指向被依赖的一方。

![依赖关系](http://my.csdn.net/uploads/201206/07/1339063909_4768.png)


```
public class Driver  
{  
    public void drive(Car car)  
    {  
        car.move();  
    }  
    ……  
}  
public class Car  
{  
    public void move()  
    {  
        ......  
    }  
    ……  
}  
```

依赖关系有如下三种情况：

1. **A类是B类中的（某中方法的）局部变量；**
2. **A类是B类方法当中的一个参数；**
3. **A类向B类发送消息，从而影响B类发生变化；**

## 二、泛化关系（Generalization）
---

**泛化关系（Generalization）**：A是B和C的父类，B,C具有公共类（父类）A，说明A是B,C的一般化（概括，也称泛化）
- 泛化关系(Generalization)也就是继承关系，也称为“is-a-kind-of”关系，泛化关系用于描述父类与子类之间的关系，父类又称作基类或超类，子类又称作派生类。在UML中，泛      化关系用带空心三角形的直线来表示。

- 在代码实现时，使用面向对象的继承机制来实现泛化关系，如在**Java**语言中[使用extends关键字]()、在[C++/C#]() 中[使用冒号":"]()来实现。 

![泛化关系（Generalization）](http://my.csdn.net/uploads/201206/07/1339064113_3688.png)

&emsp;&emsp;&emsp;&emsp;Java中的继承**Extends**

```
public class Person   
{  
    protected String name;  
    protected int age;  
    public void move()   
    {  
        ……  
    }  
    public void say()   
   {  
        ……  
    }  
}  
public class Student extends Person   
{  
    private String studentNo;  
    public void study()   
    {  
        ……  
    }  
}  
```

**在UML当中，对泛化关系有三个要求：**

1. 子类与父类应该完全一致，父类所具有的属性、操作，子类应该都有；

2. 子类中除了与父类一致的信息以外，还包括额外的信息；

3. 可以使用父类的实例的地方，也可以使用子类的实例；

## 三、关联关系（Association）
---

**关联关系（Association）**:类之间的联系，如客户和订单，每个订单对应特定的客户，每个客户对应一些特定的订单，再如篮球队员与球队之间的关联（下图所示）。

![关联关系](http://my.csdn.net/uploads/201206/07/1339064197_2222.jpg)

其中，关联两边的"employee"和“employer”标示了两者之间的关系，而数字表示两者的关系的限制，是关联两者之间的多重性。通常有“*”（表示所有，不限），“1”（表示有且仅有一个），“0...”（表示0个或者多个），“0，1”（表示0个或者一个），“n...m”(表示n到m个都可以),“m...*”（表示至少m个）。

- 关联关系(Association) 是类与类之间最常用的一种关系，它是一种结构化关系，**用于表示一类对象与另一类对象之间有联系。**
-  在UML类图中，**用实线连接有关联的对象所对应的类**，在使用Java、C#和C++等编程语言实现关联关系时，**通常将一个类的对象作为另一个类的属性**。
-  在使用类图表示关联关系时可以**在关联线上标注角色名**。
  

1. **双向关联**: 默认情况下，关联是双向的。

&emsp;&emsp;&emsp;&emsp;常见的Hibernate中多对多

![](http://my.csdn.net/uploads/201206/07/1339064456_6833.png)

```
public class Customer  
{  
    private Product[] products;  
    ……  
}  
public class Product  
{  
    private Customer customer;  
    ……  
}  
```


2. **单向关联**:类的关联关系也可以是[单向的]()，单向关联用[带箭头的实线]()表示.

&emsp;&emsp;&emsp;&emsp;常见的Hibernate中一对多，多对一

![单项关联](http://my.csdn.net/uploads/201206/07/1339064543_2384.png)


```
public class Customer  
{  
    private Address address;  
    ……  
}  
  
public class Address  
{  
    ……  
}  
```
3  **自关联:** 在系统中可能会存在[一些类的属性对象类型为该类本身]()，这种特殊的关联关系称为自关联。

![自关联](http://my.csdn.net/uploads/201206/07/1339064668_4517.png)

&emsp;&emsp;&emsp;&emsp;常见的如树结构

```
public class Node  
{  
    private Node subNode;  
    ……  
}  
```

4. **重数性关联:** 重数性关联关系又称为**多重性关联关系(Multiplicity)**，表示一个类的对象与另一个类的对象连接的个数。在UML中多重性关系可以直接在关联直线上增加一个数字表示与之对应的另一个类的对象的个数。



表示方式 | 多重性说明
---|---
1..1 | 表示另一个类的一个对象只与一个该类对象有关系
0..* | 表示另一个类的一个对象与零个或多个该类对象有关系
1..* | 表示另一个类的一个对象与一个或多个该类对象有关系
0..1 | 表示另一个类的一个对象没有或只与一个该类对象有关系
m..n | 表示另一个类的一个对象与最少m、最多n个该类对象有关系 (m<=n)

![1..1](http://my.csdn.net/uploads/201206/07/1339064814_8559.png)


```
//1..1 0..n
public class Form  
{  
    private Button buttons[];  
    ……  
}   
public class Button  
{  
    …  
} 
```

##  四、聚合关系（Aggregation）
---

**聚合关系（Aggregation）**:表示的是整体和部分的关系，***整体与部分** 可以分开.

- 聚合关系(Aggregation) 表示一个**整体与部分**的关系。通常在定义一个整体类后，再去分析这个整体类的组成结构，从而找出一些成员类，该整体类和成员类之间就形成了聚合   关系。

- 在聚合关系中，**成员类是整体类的一部分**，即成员对象是整体对象的一部分，但是成员对象可以脱离整体对象独立存在。**在UML中，聚合关系用带空心菱形的直线表示。** 

&emsp;&emsp;&emsp;&emsp;常见的如为聚合关系，汽车是有方向盘，引擎，车轱辘，底盘等组成的

![聚合关系](http://my.csdn.net/uploads/201206/07/1339065043_2919.png)


```
//聚合关系
public class Car  
{  
    private Engine engine;  
    public Car(Engine engine)  
   {  
        this.engine = engine;  
    }  
      
    public void setEngine(Engine engine)  
    {  
        this.engine = engine;  
    }  
    ……  
}  
public class Engine  
{  
    ……  
}  
```

如：电话机包括一个话筒

       电脑包括键盘、显示器，一台电脑可以和多个键盘、多个显示器搭配，确定键盘和显示器是可以和主机分开的，主机可以选择其他的键盘、显示器组成电脑；

![电脑聚合关系](http://my.csdn.net/uploads/201206/07/1339065099_3986.jpg)       

##  五、组合关系（Composition）

**组合关系具有同生共死的特点，一个整体完蛋，部分也不能幸免；聚合关系没有**

**组合关系（Composition）**:也是整体与部分的关系，[但是整体与部分不可以分开](组合关系和聚合关系的区别！！！).

- **组合关系(Composition)**也表示类之间整体和部分的关系，但是组合关系**中部分和整体具有统一的生存期**。一旦整体对象不存在，部分对象也将不存在，部分对象与整体对象之    间具有**同生共死**的关系。
- 在组合关系中，成员类是整体类的一部分，而且整体类可以控制成员类的生命周期，即成员类的存在依赖于整体类。**在UML中，组合关系用带实心菱形的直线表示。**

![组合关系同生共死](http://my.csdn.net/uploads/201206/07/1339065205_1491.png)


```
//人的头完蛋，嘴也就完蛋了
public class Head  
{  
    private Mouth mouth;  
    public Head()  
    {  
    mouth = new Mouth();  
    }  
    ……  
}  
  
public class Mouth  
{  
    ……  
}  
```

如：公司和部门，部门是部分，公司是整体，公司A的财务部不可能和公司B的财务部对换，就是说，公司A不能和自己的财务部分开； 人与人的心脏.

![桌子的桌面和桌腿的关系](http://my.csdn.net/uploads/201206/07/1339065249_7771.jpg)

桌子是由桌面和四个桌腿组成的，所以桌子 ----<**实心**> 桌腿,桌子 ----<**实心**> 桌面
桌子和四个桌腿有关系，和一个桌面有关系

## 六、实现关系（Implementation)
---

**实现关系（Implementation）**：是用来规定接口和实线接口的类或者构建结构的关系，接口是操作的集合，而这些操作就用于规定类或者构建的一种服务。


- 接口之间也可以有与类之间关系类似的继承关系和依赖关系，但是接口和类之间还存在一种实现关系(Realization)，在这种关系中，类实现了接口，类中的操作实现了接口中所     声明的操作。[**在UML中，类与接口之间的实现关系用带空心三角形的虚线来表示。**]()


![实现关系](http://my.csdn.net/uploads/201206/07/1339065434_3587.png)


```
public interface Vehicle   
{  
    public void move();  
}  
public class Ship implements Vehicle  
{  
    public void move()   
    {  
    ……  
    }  
}  
public class Car implements Vehicle  
{  
    public void move()   
    {  
    ……  
    }  
}  
```
