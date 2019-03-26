---
layout:     post
title:      "原子变量与非阻塞同步机制"
subtitle:   "Atomic,NoBlocked,CAS"
date:       2016-01-11 16:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - JAVA并发合集
    - CAS
---



# 原子变量与非阻塞同步机制

## 引言

&emsp;&emsp;在java.util.concurrent包中的许多类，例如Semaphore和ConcurrentLinkedQueue都提供了比synchronized机制更高的性能和可伸缩性。

&emsp;&emsp;近年来，在并发算法领域的大多数研究都侧重与非阻塞算法，这种算法用底层的原子机器指令(例如比较并交换指定)代替锁来确保数据在并发访问中的一致性。非阻塞算法被广泛应用在操作系统和JVM实现**线程/进程调度机制**、垃圾回收机制以及锁和其他并发数据结构。

&emsp;&emsp;与基于锁的方案相比，非阻塞算法在设计和实现上都要复杂的多，但他们在可**伸缩性**和**活跃性**上缺用于欧巨大的优势。由于非阻塞算法可以使用多个线程在竞争相同的数据时不会发生阻塞，因此它能在粒度更细的层次上进行协调。

&emsp;&emsp;在基于Lock的算法中，如果一个线程在休眠或者自旋的同事持有一个锁，那么其他线程都无法执行下去，而非阻塞算法不会收到单个线程失败的影响。从Java 5.0开始就可以使用原子变量类(例如AtomicInteger和AtomicReference)来构建高效的非阻塞算法。

&emsp;&emsp;即使原子变量没有用于非阻塞算法的开发，他们也可以用做一种**更好的volatile类型变量**。

&emsp;&emsp;原子变量提供了与volatile类型变量相同的内存语义，此外还支持原子的更新操作，从而使他们更加适用于实现计数器、序列发生器和统计数据收集等，同时还能比基于锁的方法提供更高的伸缩性。


## 锁的劣势
    
&emsp;&emsp;通过使用一致的锁定协议开协调对共享状态的访问，可以确保无论那个线程持有守护变量的锁，都能采用独占方式来访问这些变量，并且对变量的任何修改对随后获得这个锁的其他线程都是可见的。
    
现代的许多JVN都对**非竞争锁获取**和**锁释放**等操作进行了极大的优化，但如果有多个线程同时请求锁，那么JVM就需要借助操作系统的功能。如果出现了这种情况，那么一些线程将被挂起并且在稍后恢复运行。

> 当线程在锁上发生竞争时，智能的JVM不一定会挂起线程，而是根据之前获取操作中对锁的持有时间长短来判断是使次线程**挂起**还是**自旋**等待。

> [自旋锁和互斥锁的优缺点](http://www.cnblogs.com/kuliuheng/p/4064680.html)***自旋锁比较适用于锁使用者保持锁时间比较短的情况***。++正是由于自旋锁使用者一般保持锁时间非常短，因此选择自旋而不是睡眠是非常必要的，自旋锁的效率远高于互斥锁++。信号量和读写信号量适合于保持时间较长的情况，++它们会导致调用者睡眠++，因此只能在进程上下文使用，而***自旋锁适合于保持时间非常短的情况，它可以在任何上下文使用***。子璇所是一种比较低级的保护数据结构或代码片段的原始方式，自旋锁可能存在两个问题(1)死锁，由于轮训(2)过多占用cpu资源，轮训；因此得加以限制

---


&emsp;&emsp;当线程恢复执行时，必须等待其他线程执行完他们的时间以后，才能被调度执行。在挂起和恢复线程等过程中存在很大的开销，并且通常存在这个较长时间的中断。如果在基于锁的类包中包含有细粒度的操作，(例如同步容器类，在其大多数方法中只包含少量的并发操作),那么当在锁上存在激烈的竞争时，调度开销和工作开销的比值会非常高。


&emsp;&emsp;与锁相比，volatile变量是一种更轻量级的同步机制，因为在使用这些变量时不会发生上下文切换和线程调度等操作。然而，volatile变量同样存在一些局限:虽然和锁机制相似的都提供了可见性保证，但是不能用于构建原子的复合操作。因此，当一个变量依赖其他变量时，或者当变量的新值依赖旧值是，就不能使用volatile变量。这些都限制了volatile变量的使用，因此volatile不能用来实现一些常用的操作，比如计数器或者互斥量。

> 虽然理论上可以基于volatile的语义来构造互斥体和其他同步器，但是在实际情况下很难实现。

例如，虽然自增操作(++i)看起来想一个原子操作，但是事实上它包括了三个独立的操作—— 获取变量的当前值，将这个值加1，然后在写入新值。为了确保更新操作不被丢失，整个的读-改-写操作必须是原子的。到目前位置，我们实现这种原子操作的的唯一方式就是使用锁定方法。如下Counter中

```java

import net.jcip.annotations.*;

/**
 * Counter
 * <p/>
 * Simple thread-safe counter using the Java monitor pattern
 *
 * @author Brian Goetz and Tim Peierls
 */
@ThreadSafe
public final class Counter {
    @GuardedBy("this") private long value = 0;

    public synchronized long getValue() {
        return value;
    }

    public synchronized long increment() {
        if (value == Long.MAX_VALUE)
            throw new IllegalStateException("counter overflow");
        //事实上它包括了三个独立的操作—— 获取变量的当前值，将这个值加1，然后在写入新值
        return ++value;
    }
}
```

&emsp;&emsp;锁定还存在其他的一些缺点。但一个线程正在等待锁时，他不能做任何其他事情。如果一个线程在持有锁的情况下被延迟执行(例如发生了缺页错误，调度延迟，或者其他类似情况)，那么所有需要这个锁的线程都无法执行下去。如果被阻塞线程的优先级很高，而持有锁的线程有限级较低，那么这个将是一个很严重的问题——也被称为优先级反转(Priority Inversion)。即使高有限级的线程可以抢先执行，但是仍然需要等待锁被释放，从而导致它的有限级会降至低优先级线程的级别。如果持有锁的线程被永久的阻塞(例如出现了无线循环，死锁，活锁或者其他活跃性故障)，所有等待这个锁的线程就会永远无法执行下去。**幸运的是，在现代的处理器中提供了这种机制。**


&emsp;&emsp;即使忽略这些风险，锁定方式对于细粒度的操作(例如递增计数器)来说任然是一种高开消的机制。在管理线程之间的竞争是应该有一种粒度更细的技术，类似于volatile变量的机制，同时还要支持原子的更新操作。



> 优先级翻转是当一个高优先级任务通过信号量机制访问共享资源时，该信号量已被一低优先级任务占有，因此造成高优先级任务被许多具有较低优先级任务阻塞，实时性难以得到保证。

例如：有优先级为A、B和C三个任务，优先级A>B>C，任务A，B处于挂起状态，等待某一事件发生，任务C正在运行，此时任务C开始使用某一共享资源S。在使用中，任务A等待事件到来，任务A转为就绪态，因为它比任务C优先级高，所以立即执行。当任务A要使用共享资源S时，由于其正在被任务C使用，因此任务A被挂起，任务C开始运行。如果此时任务B等待事件到来，则任务B转为就绪态。由于任务B优先级比任务C高，因此任务B开始运行，直到其运行完毕，任务C才开始运行。直到任务C释放共享资源S后，任务A才得以执行。在这种情况下，优先级发生了翻转，任务B先于任务A运行。

![优先级翻转现象（无优先级继承）](https://github.com/caozhilong/caozhilong.github.io/blob/master/img/arct/JavaConcurrent_PriorityInversion.png)

 - T0时刻，只有**C线程**处于可运行状态，运行过程中，**C线程**拥有了一个++同步资源SYNCH1++；
 - T1时刻，**B线程**就绪进入可运行状态，由++于B线程优先级高于正在运行的C线程++，C线程被抢占（未释++放同步资源SYNCH1++），**B线程**被调度执行；
 - 同样地T2时刻，**A线程**抢占**B线程**；
 - **A线程**运行到T3时刻，需要++同步资源SYNCH1++，但SYNCH1被更低优先级的**C线程**所拥有，**A线程**被挂起等待该资源，而此时处于可运行状态的线程**B线程**和**C线程**中，++B的优先级大于C的优先级++，B线程被调度执行。
 
上述现象中，优先级最高的A既要等优先级低的B运行完，还要等优先级更低的C运行完之后才能被调度，如果B和C执行的很费时的操作，显然Thread1的被调度时机就不能保证，整个实时调度的性能就很差了。

### 解决优先级翻转

解决优先级翻转问题有优先级天花板(priority ceiling)和优先级继承(priority inheritance)两种办法。



## 硬件对并发的支持

&emsp;&emsp;独占锁是一项悲观的技术——他假设最坏的情况(如果你不锁门，那么捣蛋鬼就会闯入并搞破坏)，并且只有在确保其他线程不会造成干扰(通过获取正确的锁)的情况下才能执行下去。

&emsp;&emsp;对于细粒度的操作，还有另外一种更高效的方法，也是一种乐观的方法。通过这种方法可以在不发生干扰的情况下完成更新操作。这种方式需要借助冲出检查机制来判断在更新的过程中是否存在来自其他线程的干扰，如果存在，这个操作将会失败，并且可以c重试(也可以不重试)。这种乐观的方法就好像一句谚语:"原谅被准许更容易得到"，其中"更容易"在这里相当于""更高效"。

&emsp;&emsp;在针对多处理器操作而设计的处理器中提供了一些特殊的指令，用于管理对共享数据的并发操作。在早起的处理器初中支持原子的测试并设置(Test-and-Set),获取并递增(Fetch-and-Increment)以及交换(Swap)等指令，这些指令足以实现各种互斥量，而这些互斥量又可以实现更复杂的并发对象。现在几乎所有的现代处理器中都包含了某种形式的原子读-改-写执行，例如病娇交换(Compare-and-Swap)或者关联加载/条件存储(Load-Linked/Store-Conditional),操作系统和JVM使用这些指令来实现锁和并发的数据结构，但在Java 5.0之前，在Java类中还不能直接使用这些指令。


### 比较并交换(CAS)

&emsp;&emsp;在大多数处理器架构(包括IA32和Sparc)中采用的方法是实现一个比较并交换(CAS)指令。(在其他处理器中，例如PowerPC，采用一对指令实现相同的功能:关联加载与条件存储。)CAS包含三个操作数——需要读写的内存位置V，进行比较的值A和待写入的新值B。当且精当V的值等于A时，CAS才会通过原子方式用性质B来更新V的值，负责不会执行任何操作。无论位置V的值是否等于A，都将返回V原有的值。（这种变化形式被成为比较并返回，无论操作是否成功都会返回。）CAS的含义是:"我认为V的值应该为A，如果是，那么将V的值更新为B，负责不修改并告诉V实际的值为多少"。CAS是一项乐观的技术，他希望能成功的执行更新操作，并且如果有另外一个线程在最近一次检查后更新了改变量，那么CAS能检测到这个错误。程序清单SimulatedCAS说明了CAS语义(而不是实现或性能)。

```java

import net.jcip.annotations.*;

/**
 * SimulatedCAS
 * <p/>
 * Simulated CAS operation
 *
 * @author Brian Goetz and Tim Peierls
 */

@ThreadSafe
public class SimulatedCAS {
    @GuardedBy("this") private int value;

    public synchronized int get() {
        return value;
    }

    public synchronized int compareAndSwap(int expectedValue,
                                           int newValue) {
        int oldValue = value;
        if (oldValue == expectedValue)
            value = newValue;
        return oldValue;
    }

    public synchronized boolean compareAndSet(int expectedValue,
                                              int newValue) {
        return (expectedValue
                == compareAndSwap(expectedValue, newValue));
    }
}

```

&emsp;&emsp;当多个线程尝试使用CAS同事更新同一个变量时，只有其中一个线程能更新变量的值，而其他线程豆浆失败。然而，失败的线程并不会被挂起(这与获取锁的情况不同:当获取锁失败时，线程将被挂起)，而是被告知在这次竞争中失败，并可以再次尝试。由于一个线程在竞争CAS时失败不会阻塞，因此它可以决定是否重新尝试，或者执行一些恢复操作，也或者不执行任何操作。这种灵活性就大大减少了与锁相关的活跃性风险(尽管在一些不常见的情况下，任然存在活锁风险)。


&emsp;&emsp;CAS的典型使用模式是:首先从V中读取值A，并根据A计算新值B，然后再通过CAS以原始方式将V中的值由A变成B(只要在这个起见没有任何线程将V的值修改为其他值).由于CAS能检测到来自其他线程的干扰，因此即使不使用锁也能够实现原子的读-改-写操作序列。

### 非阻塞的计数器

&emsp;&emsp;程序清单中的CasCounter使用CAS实现了一个线程安全的技术器。递增操作采用了标准形式——读取旧的值，根据它计算出新值(加1)，并使用CAS来设置这个新值。如果CAS失败，那么改操作将立即重试。通常，反复的重试是一种合理的策略，但是存在一些竞争很激烈的情况下，更好的方式是在重试之前首先等待一段时间或者回退，从而避免造成活锁问题。

基于CAS实现的非阻塞计数器
---

```java


import net.jcip.annotations.*;

/**
 * CasCounter
 * <p/>
 * Nonblocking counter using CAS
 *
 * @author Brian Goetz and Tim Peierls
 */
@ThreadSafe
public class CasCounter {
    private SimulatedCAS value;

    public int getValue() {
        return value.get();
    }

    public int increment() {
        int v;
        do {
            v = value.get();
        } while (v != value.compareAndSwap(v, v + 1));
        return v + 1;
    }
}

```

CasCounter不会阻塞，但如果其他线程同事更新计数器，那么会多次执行重试操作。(在实际情况中，如果仅需要一个计数器或序列生成器，那么可以直接使用AtomicInteger或者AtomicLong，他们能提供原子的递增方法以及其他算术方法。)

>  如果在CAS失败时不执行任何操作，那么是一种明智的做法。在非阻塞算法中，例如链表队列中，当CAS失败时，以为这其他线程已经完成了你想要执行的操作。

> 理论上，如果其他线程在每次竞争CAS时总是获胜，那么这个线程每次都会重试，但在实际中很少发生这种类型的饥饿问题。

&emsp;&emsp;初看起来，基于CAS的技术器似乎比基于锁的计数器在性能上更差一些，因为他需要执行更多的操作和更复杂的控制流，并且还依赖看似复杂的CAS操作。但实际上，当实际上竞争程度不高时，基于CAS的计数器在性能上远远超过了基于锁的计数器，二在没有竞争是甚至更高。如果要快速获取无竞争的锁，那么至少需要一次CAS操作再加上与其他锁相关的操作，因此基于锁的技术器即使在最好的情况下也会笔记与CAS的计数器在一般情况下会执行更多的操作。由于CAS在多多数情况下都能成功执行(假设竞争程度不高)，因此硬件能够正确的预测while循环中的分支，从而吧复杂控制逻辑的开销降至最低。

&emsp;&emsp;虽然Java语言的锁定语法比较简洁，但JVM和操作在管理锁时需要完成的工作却并不简单。在实现锁定时需要遍历JVM中一条非常复杂的代码路径，并可能导致操作系统级的锁定、线程挂起以及上下问切换等操作。在最好情况下，在锁定时至少需要一次CAS，因此虽然在使用锁时没有用到CAS，但实际上也发节约任何执行开销。另一方面，在程序内部执行CAS是不需要执行JVM代码、系统调用或者线程调度操作。在应用级看起来越长的代码路径，如国家上JVM和操作系统中的代码调用，那么事实上CAS代码却比较少。CAS的主要缺点是，它将使调动者处理竞争问题(通过重试、回退、放弃)，而在锁中能自动处理竞争问题(线程在获得锁之前将一致阻塞)。

> 事实上，CAS最大的缺陷在于比较难以围绕这CAS正确的构建外部算法。

&emsp;&emsp;CAS的性能会随着处理器数量的不用而变化很大。在单CPU系统中，CAS通常只需要很少的时钟周期，因为不要处理处理器之间的同步。在据并发编程书中描述，非竞争的CAS在多CPU系统中需要10到150个时钟周期的开销。CAS的执行性能不仅在不同的体系架构之间变化很大，甚至在相同处理器的不同版本之间也会有不同。生产厂商迫于竞争的压力，在接下来几年内还会继续提高CAS的性能。一个很管用的经验法则是:在大多数处理器上，在无精症的锁获取和释放的"快速代码路径""上的开销，大约是CAS开销的两倍。


### JVM对CAS操作的支持

&emsp;&emsp;那么，Java代码如何确保处理器执行CAS操作?在Java 5.0 之前，如果不编写明确的代码，那么就无法执行CAS。在Java 5.0 中引入了底层的支持，在int、long和对象的应用等类型上都公开了CAS操作，并且JVM把他们编译为底层硬件提供的最有效方法。在支持CAS的平台上，运行时把他们便以为相应的(多条)机器指令。在最坏的情况下，如果不支持CAS指令，那么JVM将使用自旋锁，在原子变量类(例如java.util.concurrent.atomic中的AtomicXXX)中使用了这些底层的JVMN支持为数字类型和应用类型提供一种高效的CAS操作，二在java.util.concurrent中的大多数类在实现时则直接或者简介的使用了这些原子变量类。


```c++
/*
*hotspot 1.7实现的CAS方法
*/
jbyte Atomic::cmpxchg(jbyte exchange_value, volatile jbyte* dest, jbyte compare_value) {
  assert(sizeof(jbyte) == 1, "assumption.");
  uintptr_t dest_addr = (uintptr_t)dest;
  uintptr_t offset = dest_addr % sizeof(jint);
  volatile jint* dest_int = (volatile jint*)(dest_addr - offset);
  jint cur = *dest_int;
  jbyte* cur_as_bytes = (jbyte*)(&cur);
  jint new_val = cur;
  jbyte* new_val_as_bytes = (jbyte*)(&new_val);
  new_val_as_bytes[offset] = exchange_value;
  while (cur_as_bytes[offset] == compare_value) {
    jint res = cmpxchg(new_val, dest_int, cur);
    if (res == cur) break;
    cur = res;
    new_val = cur;
    new_val_as_bytes[offset] = exchange_value;
  }
  return cur_as_bytes[offset];
}
```

## 原子变量类

&emsp;&emsp;原子变量比锁的粒度更细，量级更轻，并且对于在多处理器系统上实现高性能的并发代码来说是非常关键的。原子变量将发生竞争的范围缩小到单个变量上，这是我们可以获得的粒度最细的情况，假设算法能够使用这个粒度来实现。











    
    
    
    
    
    
    
    


