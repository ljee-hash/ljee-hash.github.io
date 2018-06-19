---
layout:     post
title:      "Apache Access Log中的OPTIONS *的含义"
subtitle:   "Apache,线程唤醒"
date:       2018-06-05 15:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - Linux
    - OpenSource
---


# Apache Access Log中的OPTIONS *的含义

在Apache的Access Log中会看到很多如下的访问日志：

<pre class="prettyprint linenums prettyprinted" style="">
1.  127.0.0.1 - - [05/May/2011:10:54:07 +0800] "OPTIONS * HTTP/1.0" 200 -
2.  127.0.0.1 - - [05/May/2011:10:54:08 +0800] "OPTIONS * HTTP/1.0" 200 -
3.  127.0.0.1 - - [05/May/2011:10:54:09 +0800] "OPTIONS * HTTP/1.0" 200 -
4.  127.0.0.1 - - [05/May/2011:10:54:10 +0800] "OPTIONS * HTTP/1.0" 200 -
</pre>

这是什么意思呢？

Apache的文档中， 有如下的说明：

> When the Apache HTTP Server manages its child processes, it needs a way to wake up processes that are listening for new connections. To do this, it sends a simple HTTP request back to itself. This request will appear in the access_log file with the remote address set to the loop-back interface (typically 127.0.0.1 or ::1 if IPv6 is configured). If you log the User-Agent string (as in the combined log format), you will see the server signature followed by “(internal dummy connection)” on non-SSL servers. During certain periods you may see up to one such request for each httpd child process.

可是，为什么要唤醒呢？ 唤醒是为了做什么呢？

![](https://dn-linuxcn.qbox.me/data/attachment/album/201411/09/162942xy7laaym1h0myq9z.jpg)

在Apache Prefork模式下， 启动的时候，Apache就会fork出一些worker进程， 来准备接受请求， 这些worker进程，在完成准备工作以后， 就会进入block模式的监听沉睡中， 等待请求到来而被唤醒。

另外一方面， 在Prefork模式下， 当请求很多， 目前的worker进程数不够处理的时候， 就会额外再fork一些worker进程出来， 以满足当前的请求。

而在这些请求高峰过后， 如果额外fork出来的进程数大于了MaxSpareServers， Apache就会告诉这些worker进程退出， 那么问题就来了。

这些进程都在沉睡中啊， 怎么告诉他们， 并且让他们自我退出呢？

Apache会首先发送一个退出状态字(GRACEFUL_CHAR !)给这些Work进程：

<pre class="prettyprint linenums prettyprinted" style="">
1.  static apr_status_t pod_signal_internal(ap_pod_t \*pod)
2.  {
3.      apr_status_t rv;
4.      char char_of_death = '!';
5.      apr_size_t one = 1;
6.
7.      rv = apr_file_write(pod->pod_out, &char_of_death, &one);
8.      if (rv != APR_SUCCESS) {
9.          ap_log_error(APLOG_MARK, APLOG_WARNING, rv, ap_server_conf,
10.                       "write pipe_of_death");
11.      }
12.
13.      return rv;
14.  }
</pre>

但此时， Worker进程不会去读这些状态字， 因为他们还在沉睡。

这个时候Apache就会发送一个OPTIONS请求给自己， 唤醒这些沉睡的进程：

<pre class="prettyprint linenums prettyprinted" style="">
1.  static apr_status_t dummy_connection(ap_pod_t \*pod)
2.  {
3.  //...有省略
4.      /* Create the request string. We include a User-Agent so that
5.       \* adminstrators can track down the cause of the odd-looking
6.       \* requests in their logs.
7.       \*/
8.      srequest = apr_pstrcat(p, "OPTIONS * HTTP/1.0\r\nUser-Agent: ",
9.                             ap_get_server_banner(),
10.                             " (internal dummy connection)\r\n\r\n", NULL);
11.  //...有省略
12.  }
</pre>

这些进程在处理完当前请求以后(OPTIONS请求)， 就会发现， oh， 主进程让我退出。

<pre class="prettyprint linenums prettyprinted" style="">
1.  static void child_main(int child_num_arg)
2.  {
3.  //...有省略
4.
5.      while (!die_now && !shutdown_pending) {
6.  //...有省略
7.          //1. listen
8.          //2. accept
9.          //3. process request
10.
11.          /* Check the pod and the generation number after processing a
12.           \* connection so that we'll go away if a graceful restart occurred
13.           \* while we were processing the connection or we are the lucky
14.           \* idle server process that gets to die.
15.           \*/
16.          if (ap_mpm_pod_check(pod) == APR_SUCCESS) { /* selected as idle? */
17.              die_now = 1;
18.          }
19.  //...有省略
20.     }
21.  //...有省略
22.  }
</pre>

于是， 它就做完清理工作， 然后自我消亡了~~~

## 引用参考

> https://linux.cn/article-4190-1.html