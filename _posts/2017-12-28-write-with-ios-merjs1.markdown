---
layout:     post
title:      "流程图测试"
subtitle:   "IOS,OpenSource"
date:       2017-12-28 10:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-markdown.jpg"
tags:
    - IOS
    - OpenSource
---

# 流程图测试



```mermaid
sequenceDiagram
A->>B: How are you?
B->>A: Great!
```




```mermaid
graph LR
A-->B
```

### 带样式的流程图


```mermaid
graph TB
    sq[Square shape] --> ci((Circle shape))

    subgraph A subgraph
        od>Odd shape]-- Two line<br/>edge comment --> ro
        di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
        di==>ro2(Rounded square shape)
    end

    %% Notice that no text in shape are added here instead that is appended further down
    e --> od3>Really long text with linebreak<br>in an Odd shape]

    %% Comments after double percent signs
    e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

    cyr[Cyrillic]-->cyr2((Circle shape Начало));

     classDef green fill:#9f6,stroke:#333,stroke-width:2px;
     classDef orange fill:#f96,stroke:#333,stroke-width:4px;
     class sq,e green
     class di orange
```

### 带样式的流程图22222222222222



```math

x = a_{1}^n + a_{2}^n + a_{3}^n

x^{y^z}=(1+{\rm e}^x)^{-2xy^w}

J_\alpha(x) = \sum_{m=0}^\infty \frac{(-1)^m}{m! \Gamma (m + \alpha + 1)} {\left({ \frac{x}{2} }\right)}^{2m + \alpha} \text {，行内公式示例}

\cos(θ+φ)=\cos(θ)\cos(φ)−\sin(θ)\sin(φ)

```

## 测试Jeffreys prior

在贝叶斯概率，所述杰弗里斯之前，爵士命名的哈罗德杰弗里斯，是一个非信息（目标）先验分布为参数空间; 它与Fisher信息矩阵的行列式的平方根成正比：

```math

p(θ)



```



