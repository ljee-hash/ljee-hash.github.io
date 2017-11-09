---
layout:     post
title:      "CopyOnWrite容器"
subtitle:   "Atomic,CopyOnWrite,Atomic"
date:       2016-02-22 10:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - Concurrent
    - Atomic 
    - CopyOnWrite
---






# CopyOnWrite容器

## 理论
Copy-On-Write简称COW，是一种程序设计中的优化策略。适用于**读多写少**的场景。JDK1.5+里面的COW容器有两种:CopyOnWriteArrayList和CopyOnWriteArraySet，COW容器非常有用，可以在非常多的并发场景使用到。

## 什么是CopyOnWrite容器？

CopyOnWrite容器即**写时复制**的容器。通俗的理解是当往一个容器添加元素的时候，不直接往当前容器添加，而是先将当前容器进行Copy，复制出一个新的容器，然后新的容器里添加元素，添加完元素之后，再将原容器的引用指向新的容器。这样做的好处是可以对CopyOnWrite容器进行**并发的读，而不需要加锁**，因为当前容器不会添加任何元素。所以CopyOnWrite容器也是一种读写分离的思想，读和写不同的容器。

## 测试代码

```java
package caozhilong.github.io.copyonwrite;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.Test;


public class TestCopyOnWriteArrayList {

	//最大线程数
	 private static final int THREAD_POOL_MAX_NUM = 10; 
	
	 private List mList = new CopyOnWriteArrayList<>();
	
	
//	@Test
	public static void  main(String[] args){
		 new TestCopyOnWriteArrayList().start();  
	}
	
    private void start(){  

        for(int i = 0 ; i <= THREAD_POOL_MAX_NUM ; i ++){  
            this.mList.add("...... Line "+(i+1)+" ......");  
        }  
    	
    	
        ExecutorService service = Executors.newFixedThreadPool(THREAD_POOL_MAX_NUM);  
       
        for(int i = 0 ; i < THREAD_POOL_MAX_NUM ; i ++){  
            service.execute(new ListReader(this.mList));  
            service.execute(new ListWriter(this.mList,i));  
        }  
        service.shutdown();  
    }  
	



	private class ListReader extends Thread{
		
		
	      private List<String> mList ;  
	      
	      public  ListReader(List<String> list) {   
	            this.mList = list;  
	      }  
	      
	      public  ListReader(String threadname,List<String> list) {   
	          this.setName(threadname);  
	    	  this.mList = list;  
	      }  
	        @Override  
	        public void run() {  
	             if(this.mList!=null){  
	                for(String str : this.mList){  
	                 System.out.println(Thread.currentThread().getName()+" : 读取线程 :  "+ str);  
	                }  
	             }  
	        }  
	}
	
	
    /**
     * 写入线程
     * @author admin
     *
     */
    private class ListWriter implements Runnable{  
        private List<String> mList ;  
        private int mIndex;  
        public  ListWriter(List<String> list,int index) {   
            this.mList = list;  
            this.mIndex = index;  
        }  
		@Override  
        public void run() {  
            if(this.mList!=null){  
                //this.mList.remove(this.mIndex);  
            	 System.out.println(Thread.currentThread().getName()+" : ==========写入线程 ========== :  "+ mIndex);  
                 this.mList.add("...... add "+mIndex +" ......");  
             }  
        }  
    }  
}

```
### 测试结论：
CopyOnWrite可以适用于并发读多写少的场景

### 分析写入的方法

**添加元素**

```java
/**
 * CopyOnWriteArrayList在增加元素会加锁
 因此可以支持多个线程添加方法，不会产生索引冲突
 在添加元素时，会将原来的数据拷贝一份，新加入的元素会加在List的后面，添加完成后会将新数组的应用只会给原来的对象，并且触发垃圾回收
 *
 * @param e element to be appended to this list
 * @return <tt>true</tt> (as specified by {@link Collection#add})
 */
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        newElements[len] = e;
        setArray(newElements);
        return true;
    } finally {
        lock.unlock();
    }
}
```


**删除元素**

```java
    /**
     * Removes the element at the specified position in this list.
     * Shifts any subsequent elements to the left (subtracts one from their
     * indices).  Returns the element that was removed from the list.
     *
     * @throws IndexOutOfBoundsException {@inheritDoc}
     */
    public E remove(int index) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            Object[] elements = getArray();
            int len = elements.length;
            E oldValue = get(elements, index);
            int numMoved = len - index - 1;
            if (numMoved == 0)
                setArray(Arrays.copyOf(elements, len - 1));
            else {
                Object[] newElements = new Object[len - 1];
                System.arraycopy(elements, 0, newElements, 0, index);
                System.arraycopy(elements, index + 1, newElements, index,
                                 numMoved);
                setArray(newElements);
            }
            return oldValue;
        } finally {
            lock.unlock();
        }
    }
    
    
    public boolean remove(Object o) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            Object[] elements = getArray();
            int len = elements.length;
            if (len != 0) {
                // Copy while searching for element to remove
                // This wins in the normal case of element being present
                int newlen = len - 1;
                Object[] newElements = new Object[newlen];

                for (int i = 0; i < newlen; ++i) {
                    if (eq(o, elements[i])) {
                        // found one;  copy remaining and exit
                        for (int k = i + 1; k < len; ++k)
                            newElements[k-1] = elements[k];
                        setArray(newElements);
                        return true;
                    } else
                        newElements[i] = elements[i];
                }

                // special handling for last cell
                if (eq(o, elements[newlen])) {
                    setArray(newElements);
                    return true;
                }
            }
            return false;
        } finally {
            lock.unlock();
        }
    }
    
```
### 分析读取的方法

读取元素的时候并未对方法加锁，只有最后一致性，当读取原数组时，另外一个线程产生写入操作且写入操作并未完成时，会产生读取的值还是原来数组中的值，

```
    // Positional Access Operations

    @SuppressWarnings("unchecked")
    private E get(Object[] a, int index) {
        return (E) a[index];
    }

    /**
     * {@inheritDoc}
     *
     * @throws IndexOutOfBoundsException {@inheritDoc}
     */
    public E get(int index) {
        return get(getArray(), index);
    }
```


所以我们可以看到，其实读取的时候是没有加锁的。

最后我们再来看一下CopyOnWriteArrayList的优点和缺点:

**优点**:

1. 解决的开发工作中的多线程的并发问题。

**缺点**:

1. 内存占有问题:很明显，两个数组同时驻扎在内存中，如果实际应用中，数据比较多，而且比较大的情况下，占用内存会比较大，针对这个其实可以用ConcurrentHashMap来代替。

2. 数据一致性:CopyOnWrite容器只能保证数据的最终一致性，不能保证数据的实时一致性(读不加锁的原因)。所以如果你希望写入的的数据，马上能读到，请不要使用CopyOnWrite容器

### 使用场景

CopyOnWrite并发容器用于读多写少的并发场景。比如白名单，黑名单，商品类目的访问和更新场景。

使用CopyOnWriteMap需要注意两件事情：

- 减少扩容开销。根据实际需要，初始化CopyOnWriteMap的大小，避免写时CopyOnWriteMap扩容的开销。

- 使用批量添加。因为每次添加，容器每次都会进行复制，所以减少添加次数，可以减少容器的复制次数。
