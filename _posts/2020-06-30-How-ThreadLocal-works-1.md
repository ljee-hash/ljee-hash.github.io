---
layout:     post
title:      "ThreadLocal怎样工作的-上篇"
subtitle:   "JVM并发"
date:       2020-06-30 10:15:06
author:     "Ljee"
header-img: "img/economic/post-bg-how-economic-machines-work.jpg"
tags:
    - 并发
---


## 什么是ThreadLocal

先说说java内存模型，它主要是为了解决多线程下的共享内存操作问题，为了保证数据的一致性，我们在自己的工作内存操作修改变量后，会提交到主内存中进行覆盖，并且使其他线程中工作内存中的共享变量删除，使得其他线程在自己的工作内存中访问不到该共享变量副本，只能到主内存中去访问。这样就很好的保证了数据的可见性。但是，有时候我们希望在自己工作内存中修改共享变量副本后，不希望其他工作内存知道，即保持不可见性。那该怎么办呢，这是就要使用ThreadLocal了。

对于从事C、C++程序开发的开发人员来说，在内存管理领域，他们既是拥有最高权力的“皇帝”又是从事最基础工作的“劳动人民”——既拥有每一个对象的“所有权”，又担负着每一个对象生命开始到终结的维护责任。

对于Java程序员来说，在虚拟机自动内存管理机制的帮助下，不再需要为每一个new操作去写配对的delete/free代码，不容易出现内存泄漏和内存溢出问题，由虚拟机管理内存这一切看起来都很美好。不过，也正是因为Java程序员把内存控制的权力交给了Java虚拟机，一旦出现内存泄漏和溢出方面的问题，如果不了解虚拟机是怎样使用内存的，那么排查错误将会成为一项异常艰难的工作。

Java虚拟机在执行Java程序的过程中会把它所管理的内存划分为若干个不同的数据区域。这些区域都有各自的用途，以及创建和销毁的时间，有的区域随着虚拟机进程的启动而存在，有些区域则依赖用户线程的启动和结束而建立和销毁。根据《Java虚拟机规范（Java SE 7版）》的规定，Java虚拟机所管理的内存将会包括以下几个运行时数据区域，如图2-1所示。


## 设计思想

每个 `Thread` 维护维护一个 `ThreadLocalMap` 哈希表，这个哈希表的key 是 `ThreadLocal` 实例本身， value 是要存储的值



```java
public class Thread implements Runnable {
   
    /*为了简洁说明，省略其他代码 ……*/

    /* ThreadLocal values pertaining to this thread. This map is maintained
     * by the ThreadLocal class. */
    ThreadLocal.ThreadLocalMap threadLocals = null;

    /*
     * InheritableThreadLocal values pertaining to this thread. This map is
     * maintained by the InheritableThreadLocal class.
     */
    ThreadLocal.ThreadLocalMap inheritableThreadLocals = null;
    
    /*为了简洁说明，省略其他代码 ……*/
}
```

以下为线程运行时，ThreadLocal的存储状态

[](https://app.diagrams.net/?lightbox=1&target=blank&highlight=0000ff&edit=_blank&layers=1&nav=1&title=JVM%E8%99%9A%E6%8B%9F%E6%9C%BA.drawio#R7V1bc6M4Fv41VM0%2BxCUhro8mcaZrqzPbM93VO7svU8SWbbqx8WJym1%2B%2FEkhcJGFwApjEzlRNYwEC9H06OufoHElD15vnX2N%2Ft76LFjjUdLB41tCNpusIuPrEJAe07CUr04FrZCWrOFhkZbAo%2BBr8jVkhYKUPwQLvKxcmURQmwa5aOI%2B2WzxPKmV%2BHEdP1cuWUVh96s5fYang69wPeSn%2FAlr%2B72CRrFk5tNzixCccrNbs4Y5uZSfu%2FfnPVRw9bNkTt9EWZ2c2Pq%2BGfeV%2B7S%2Bip1IRmmnoOo6iJDvaPF%2FjkLYtbzN%2BX%2FLCX1RD3jrZhOQHJIfp6duam60v0a9%2FXf3%2B8rz%2F12%2FbP%2BazhzuAr9jnP%2FrhA6vxx%2BNGm5maC7TpLT1wptrU0WaW5pFjqM1s%2BtPxeCvEeJtUXu4x2Af3%2FPXA8W%2BkS2%2F0z%2B93ijfq6%2FlIej6c0M93SQu4aTsgzTXT97jWvKmGpvPQ3%2B%2FZJY6tzQzN8zTP0mau5iDNu0lPOaWXB9rMoeX0FCkhx%2BDQE3QrJJ%2Fo3ccV6K3%2FPVCeeMtom1zt0x5ELgUQ7p5TJvDz5GhF%2F9XTryDPJs8jV5Jjx9WmNn2VKaRPUrxB%2FgHkk641d5q%2B963mekVVIiFT5mPawIA89GkdJPjrzp%2FTs09EXFT56ofBakuOQ7ykr%2FiI4yQgnXDKijfBYkHr9dZRHPxNvtPnN9KPZlID5sSvsOEgt8hz8HOp%2FzN6%2FIqjDU7iF3IJO2swUjE5ZvHfT4VIQLxsXZIG0GSFPhNEq7zqgo%2FkgFHyCHqaEj0PUWeGNAek3dZM8bJKJRxB0qMJso6RMuFW8wzGV2cmgUtaLVEjOCcNj%2BNDGMaYkNTPeialxi4KtknaOqanmTe0rock2jNQOcbs2bAvgKGIMJQRhiqE9Q4A%2Ft1fJzf4IQRf479%2B%2FxEmj%2F%2F9dqOQyL%2F88B%2F9FFPSZ1NwpzcUIIpg2nmpcJx1JJOV7yTLZC6UyDf7dBxe%2B%2FEeJxXB9JAsrxxZDvE79zt%2FqxRo8yiM4kyYxav7XyzyLNKSoPj3H2ktIBV8S38ThC%2FZ1aQKf0MlDKtojcNHTMlIzm0xeXPhfFZf6aprVSVB7K%2BCbURf1d%2FuqW5yr65ILN0E8zjaR0SyEXb5hDvq2%2Fw4IGItPaQPuNrjOFiWvrAk2k0m2tmJrOXomW0Ub6hszM89MabSkwYA2ZkQJ6SPXpGGnwfbVXZS51XSrn0VENG9ZbeBypkkJu%2B2JI%2FhD9zi7OxTFC9qqiw0oSsBU900sy8uHzBYF8F%2BF%2FoM0mAbBvxJyzDyE%2BHxIrmO6CoZC0lHyIjIyamWeA3jWI3UqfbF%2Bt5eL52qwkklm5BCNqG%2BZBOS2gcviN7MfkZxso5W0dYPZ0WpV1UIims%2BR9GONd8PQswXNpzTQaDauPg5SP4sHf%2BHVkX08%2BzXzTOrOf3xwn9syef%2BWf5Ruov%2BLG5Lf%2FH7aOe5zrhKvg6B9C8HmH7sK%2BAlDRY9xHN84DpmHSV%2BvMKH6tMNNV9iHPpJ8Fh9u87hNy3FOCAQgtg0O3q4DPHzlFpiXVBgGYShCpYC5gkyrArUDUCnv74QUUtahuotOYWy2gzTLLENTgC0DvON%2FBBrGwtn7DdSht36heprhWi6sgGsCKcrqBtutZbsE9iNAvfyN3k9HY1mNhbMg81SfJ%2FE0U9c4tnCdu9TnmVnuB9AFwwQU6UHC5S9vfVMu2BF90PFlWsCAQ8TyOMFfQlZl%2B3CWlFLDIW1kpmQoGp42qnBbFHjJTOGnRttOivZwI2WSBU9piGUUWBF7S0WFV2qoix34NAfq9QNkB3PI6L98Ysq5EGMPLdMcb35lOufoslTZRm9MfTvcejlapXwZXGUkB4dbdlzlUZzhZL0r09K2lwg5JQ0XIUKY7sKA9rpiZGKIUzhCjFTf4eZMhKpLOG3CRZHv0eW1ShYUAvBsjCxszAU3OlP0HA5m6MKVajqCkFj9SZnFILmeFV1UN2lb%2FXAbqkeQPekKqXsQewFhUK1s%2FSyapdrckq1rlbvPIG615MaZ%2FGuU6hxojaQUag3Nc5WSmT3WpumgpgcUI3ApFoAkcVUWM%2B0aebjvNWmskl6xqLZRvnE1YiEs9zFR%2Bo1OJX177YU1Sc1%2Fl11NxX09To%2FG528ylxsN37qMWbTxp32Xdeykd9N38WQ9F57yL4L8w5YaMu2I3ddlcPPsnoCHdagLghn1QRUJq4vwjkH2DREfE8vml%2BlJp%2BVbNbRexDOuhy18A1vduTReC%2BL4O935NKSrCbd94Y6ZaQLL%2FL5oHxG6NTyWVf4QOl8vscHY5BGpNg0IiVTnsmoTIS2hPS3jN4XBhxggO5KAzQ4OQGOiweR8L3DRHovSAXTGPsdg23NHXy%2F7Ga09rGznA%2Fq5QKWZEoZBjo13Cr3paO5bhqcZVGF271lGpo3LUVpKYeAr4k%2F%2F9kx6PeOaZjNcyZtQF86czwfFHTbkO3nEYDezkMi9%2Fpa9H%2FLVBJihfHuf6GCqK3bkrBXEcEclAiOggg8sE8C%2BRMmCF0k%2BkGJjsyWITX9YaqysHmMdWZGO7fpzNSM6%2Bomc4gSqT9VdO4vcbSK%2FQ2p85qATRtfB3%2FgVbBPDy89%2FJCwV%2FEBFdkAgzDCUIh7ETY6%2F7urbRmWFeELIZ9vl4mSAgwUHgxdGRBt9OXCMFpM%2Fb0lKF0M5DDpf2%2FipVEzlXO6NkQtKPeRR446RFg1epX2lsx5SwFXbxHiSKEGnJNcPw4tCGwuvk8GmNqL7rg0FSPT5Mkx9dJMqRuuPPw7ZLCHaf7NVJt6pVyNIUOlmtJzmgOlegNbGJFMGWmlOsfdJt2PRkABtQxsaq%2B7RlpiUefcBdjDwEJFLOPAyKpcLyZ1tXqztIMWGTiji1PsDaXmBIVBc6dMeRpEQgRvFyyq6CZN3KRxmq1izQdMQ1CFQGUf0t9EF6P3a8PJyzHGCsh52VvDlRwomSDi5GhN1Lkigl2a0IFQqKvn0CdLb%2BbrJaGikwi77iPnHJsolqD4k9IhxDi61sR0bGviIJGbfAmFobgpB2%2BcY2RmD7wx9IleG6V3PFkMMLFPHcMpa73f1jH2F58jorCkqiygYZvZjIRnp45NO43iNOj6AsQAyhVgCZtX5CvbchJ19j6k7DeZ1k%2FBJvRTpauip%2Fkxt3T1lHJhsPvE6UeOv79ZuQJqgrFaHCGhx1D5qh2VeuX0pV9B0LWzTXI95D35oGMhTwB%2BbdPbx637oMstDxQtD%2FtrebOFqvBa1baSj%2FQdxwt%2Fy7ORKvlCluWhisSu6sKO7Rw9ppcUjlwpbqNuvFam1%2BE%2BjPoqKJxEtk0Acos%2FYUqh7RjgVsU%2FGjqAv076kzKFPjtOaZsnS45J2rYwZ9%2BHtD3c9uOTtkAVcqFTLWZqFQcfzdlzGCVbhAlYEk7DrpQDFYKHQtCMS4%2FLFvXV%2FGToQuJ8tQvl%2BMOBIWghorLJ6lo1o7bBXj2NfbghdUHSOyrXsquSN72lyUOgmCHqVtKPPHUi49FBvUyJSX9DAJQV7tmW1zw%2Bqa9YLa1TILiaZE5sCA1inNrp%2F51KV7LdCVFiyT%2FAcm3LNgypY5nGJL%2BX%2Fl%2BR%2Bo%2BMieMgWwcuAjoiT%2BwtuQmqrNmG1cnqVx0jPQPRXlFaUEw4I69XVfaStFyR6m1iIF%2FSRJymX2IrnaaXONkflwRXvm5PSsQi%2F5fIo1K%2Fe1vrCkLVakcZRpQE5MzSn1fJUYZeQDqtBZZAzuroBeQ8y6IuZWJIkI9GWbVCTY8oy5r%2BTzxmIa%2FyyPQHHxJ0%2FlOrm3LoU3b4TvBCyHX77W7CzMLJAWuxSNdbZ%2BTBRNeOmJPvcIaINVvz2h1tM%2FyZIXAq%2FyQCRpU9rl2toq1HEgrhO44YutqzSxKqQu7UdunA1qchtkxr6xNSvbivfop6dzWO3ABFzR1vYAMUyaLzHAzQOiBqDNCqwBINUCj1rVEZoOhigPZqgDZwqcE0kckzrAGKLgZoFyAfjfKwBqgi9%2BasDNAG%2BEZmgCpyb87MAG3qbiMzQA29WbE9iSHgGKM0BIxzNwQywozJEDDO0xCoA%2BIjGgLKJOaLIdCZjtjApZEbAqrUs4shcDTIIzcEFOs%2BnJUh0ADfyAwB4%2BwNgabuNjZDYKwzAmI82ggijy25rfKIbii12skiuhmmh3X1YVvOkTOPhmKZddgwF5bFUJFMtfRwf0HWdgtLs0StsllBaTNfB%2BHis%2F8SPdA33dP16%2FgveeubChlFfYSJ2%2BKmbDG87DFp%2FC%2F%2BwhsfCkV3%2FnPlws%2F%2BPuEvGIWhv%2BMbb9IbN368CrZelCTRhl3Uof7jHLWXoC4H3qiD7HszeuwWoQFs8HzN4JjQ%2FFOP7Uz5OV3o4sYoSv5gn0iLInLvMkwDENZkSMVbjW2mVBv37ZGWuqaRBuYN3b%2FS9GDxOw0K30UxGW%2B3ZKj3gxQ1TIjxhPeJSksWFrN%2BVYZFTVgIR1sefZVo672B3SJx8AJ2N2DzVMHTgd1iObEL2N2ArdoiYliwW6xGdgG7G7AhaDlq94e2bBkc9EVfIH8r5EihqA8KOTcATrL7O8i2B%2Bf%2F1G39vi5toqnJG6fnW5J3t3F6%2Bc7u9k7Pbzywdzr1PKVbplPrN9s7HXSxd3ppBuCOrhzd5QbpA5g5TYZsf45bU9VBhGa6LM3QWTB1nhbfHE2NmrMKe4ymFpcUsF%2B7IJQprARji4sF9R1NrVhXryQtZI9gR2sFH1r4V9EpOhQyTTHcVdc2BHpLb1pvG3lBPv9ds5NXvkV0D1t3wYOipSvJVkgjfVziiGeRNosjs0YcDbNHGOSL4w5EkSIRp5kk9Yp1R%2FTpnQXo3bBAXrdkLCwo9XH7qD7%2B%2FuljvBv6tN6dYrQLfkCoWMF%2F6BU%2FzKMW8f%2BAcZZm80LCA8dZmkf6tkYQ0tFFnGUdEB9xxQ%2Br3pd1ibPsIASvgUsjX%2FHDUgVvXOIsjwV55Ct%2BKBZdP6s4ywb4RhZnacmupzOLs2zqbiOLs7RahPWMYuWFI8yAXjOurN7X1B65JZAxZkyWgCUnXJyDJVAHxEfMuLJUfoyLJdCZktjApZFnXFkq78zFEjgW5JFnXCnSHM7KEmiAb2SWgGKbgTOzBJq628gsAcUuPBJWo1h6YSyWgC17JjoeHUZuCbTYnWVgS0CRpHQOlkDD9kgfyhJQ5iFdLIHOlMQGLo3cElAmLl0sgWNBHrklYMsOn7OyBBrgG5slIPtuzswSaOpuY7MEZHdKacw7pOS%2BJn74nigkpmp0c%2BZ4Psr4YeQo7I9h44d5Ytclfnjo%2BGGOaXPoX9aNThb6x0k6wsjR9x8Ayucjxs8COd1jLCw44%2FhhbsSOnz7ytvJl%2BhRMmRWlXbLJcFGJT1dgQnteS1IdxamOmLPw9%2BtcE5J4en0NQOrPUybwhfdpwiFXXUnR%2FCF%2BzGvrm5Rc62sR0%2F5WTqa3TuPYfyldwBK%2Fi5rFTUqkfWeNMr8br3fZLrF114v72h57fe6WLjpc9olF9%2Bsiuc85nDnWe48sy3fSPx330h37GSPa581mIUlv7Y8ywW13wlo%2B%2FdOF7ocmlmkXu6FXq2%2BbLCvuhl5M7jRkyx4rPkz3OPFhHCluxOtdExy83rLfdv1Q4uZwFmJf4uZ9iI0GEVEITXSc0DzBnmcQtE5py%2BY9Oxc3UPQ6W6KHq3UCvjOQTIHAEV4ZHO7E0g18bYD6G%2Bw33jCUnJBd8t%2BKabKZozkzzbO1mak5t5pr0YPprea59JQHtamCzzyAJOCLMuZlxafEEZ2wKb4k9nfru2iB6cv%2FHw%3D%3D)


既然要使用到哈希表，那么它是如何解决hash冲突的呢？

与 `HashMap` 不同，它并没有采用链地址发的思想，而是采用了开放地址法。简单的说，就是根据 hashcode 计算得到数组地址下标时，如果该位置已经被占用了，那么它向后一位或多位再进行判断。


那它为什么要使用开放地址法呢？

1). ThreadLocal中有一个神奇的属性 `HASH_INCREMENT = 0x61c88647`， 并利用 `AtomicInteger` 进行累加，它能够将哈希值均匀的分布再2的N次方的数组里。

2). ThreadLocal往往存放的数据量不是特别大，而且key是弱引用，会被垃圾回收、采用开放定址法会更节省空间，而且查询效率更高


```java
/**
 * Increment i modulo len.
 */
private static int nextIndex(int i, int len) {
    return ((i + 1 < len) ? i + 1 : 0);
}

/**
 * Decrement i modulo len.
 */
private static int prevIndex(int i, int len) {
    return ((i - 1 >= 0) ? i - 1 : len - 1);
}

```

## 重要方法


**get()方法**

```java
    /**
     * Returns the value in the current thread's copy of this
     * thread-local variable.  If the variable has no value for the
     * current thread, it is first initialized to the value returned
     * by an invocation of the {@link #initialValue} method.
     *
     * @return the current thread's value of this thread-local
     */
    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }


    /**
     * Get the map associated with a ThreadLocal. Overridden in
     * InheritableThreadLocal.
     *
     * @param  t the current thread
     * @return the map
     */
    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }

    /**
     * Variant of set() to establish initialValue. Used instead
     * of set() in case user has overridden the set() method.
     *
     * @return the initial value
     */
    private T setInitialValue() {
        T value = initialValue();
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
        return value;
    }
    
    
    /**
     * Returns the current thread's "initial value" for this
     * thread-local variable.  This method will be invoked the first
     * time a thread accesses the variable with the {@link #get}
     * method, unless the thread previously invoked the {@link #set}
     * method, in which case the {@code initialValue} method will not
     * be invoked for the thread.  Normally, this method is invoked at
     * most once per thread, but it may be invoked again in case of
     * subsequent invocations of {@link #remove} followed by {@link #get}.
     *
     * <p>This implementation simply returns {@code null}; if the
     * programmer desires thread-local variables to have an initial
     * value other than {@code null}, {@code ThreadLocal} must be
     * subclassed, and this method overridden.  Typically, an
     * anonymous inner class will be used.
     *
     * @return the initial value for this thread-local
     */
    protected T initialValue() {
        return null;
    }

```


主要步骤：

1) 获取当前线程的 `ThreadLocalMap`, 以当前的 `ThreadLocal` 为 key，调用 `getEntry()` 查找，如果找到，就返回该值

2) 如果当前的 map 不为空的话，则设置当前 ThreadLocal 为key的value为 null

3) 如果 map 为空，则要创建一个 map，并设置当前 `ThreadLocal` 为 key,value 为 null

```java
    private final int threadLocalHashCode = nextHashCode();

    private static AtomicInteger nextHashCode =
        new AtomicInteger();

    private static final int HASH_INCREMENT = 0x61c88647;
    
    private static int nextHashCode() {
        return nextHashCode.getAndAdd(HASH_INCREMENT);
    }
    
    private Entry getEntry(ThreadLocal<?> key) {
        int i = key.threadLocalHashCode & (table.length - 1);
        Entry e = table[i];
        if (e != null && e.get() == key)
            return e;
        else
            return getEntryAfterMiss(key, i, e);
    }

```

 从代码可以看到 `ThreadLocal` 的 `hashcode()` 是 `AtomicInteger` 加上 `0x61c88647` 来实现找地址




