---
layout:     post
title:      "Elasticsearch的快速安装"
subtitle:   "搜索引擎"
date:       2022-02-23 10:15:06
author:     "Ljeehash"
tags:
    - 搜素引擎
    - Elasticsearch
---

# Elasticsearch的快速安装

- 集群规格选型
- 快速安装



## 集群规格选型

> 集群规格评估，Elasticsearch的单机规格在一定程度上限制了集群的能力，根据使用经验给出如下建议：

- **集群最大节点数** ：集群最小节点数 ~ 集群最大节点数 = 单节点CPU * 1 ~ 单节点CPU * 2。
- **单节点最大数据量**:使用场景不同，单节点最大承载数据量也会不同，具体如下：

1. 数据加速、查询聚合等场景：单节点磁盘最大容量 = 单节点内存大小（GB）* 5。
2. 日志写入、离线分析等场景：单节点磁盘最大容量 = 单节点内存大小（GB）* 25。
3. 通常情况：单节点磁盘最大容量 = 单节点内存大小（GB）* 15。

集群规格参考列表如下
<table>
<thead>
<tr>
<th>规格</th>
<th>最小节点数~最大节点数</th>
<th>单节点磁盘最大容量（查询）</th>
<th>单节点磁盘最大容量（日志）</th>
<th>单节点磁盘最大容量（通常）</th>
</tr>
</thead>
<tbody><tr>
<td>4核8G</td>
<td>4~8</td>
<td>40 GB</td>
<td>200 GB</td>
<td>120 GB</td>
</tr>
<tr>
<td>8核16G</td>
<td>8~16</td>
<td>80 GB</td>
<td>400 GB</td>
<td>240 GB</td>
</tr>
<tr>
<td>16核32G</td>
<td>16~32</td>
<td>160 GB</td>
<td>800 GB</td>
<td>480 GB</td>
</tr>
<tr>
<td>32核64G</td>
<td>32~64</td>
<td>320 GB</td>
<td>1.6 TB</td>
<td>1 TB</td>
</tr>
</tbody></table>





