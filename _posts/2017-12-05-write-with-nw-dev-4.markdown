---
layout:     post
title:      " 轻量级桌面应用开发nw.js之四-- 如何让 nw.js 支持mp3/mp4"
subtitle:   "nw.js入门,支持mp3/mp4"
date:       2017-12-04 21:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-app-interface-test.jpg"
tags:
    - IDE
    - nw.js
---

# 轻量级桌面应用开发nw.js之三-- 如何让 nw.js 支持mp3/mp4

## 引言

&emsp;&emsp;由于**版权限制**，从nw.js的0.13版本，内置的chrome浏览器就不在默认支持一些受版权保护的音视频格式，如mp3/mp4。

&emsp;&emsp;官网说明如下：

```
 In the pre-built NW.js, following codecs are supported:

theora,vorbis,vp8,pcm_u8,pcm_s16le,pcm_s24le,pcm_f32le,pcm_s16be,pcm_s24be
and following demuxers are supported:

ogg,matroska,wav

```
https://github.com/iteufel/nwjs-ffmpeg-prebuilt/releases


&emsp;&emsp;官方给出的解决方案是自己动手重新编译nw.js，然而编译nw.js光是下载资源就要20G+，更不要说ffmpeg还有一堆坑。其实需要的只是一个FFmpeg的库文件而已。(下载替换dll即可支持)


&emsp;&emsp;好在有这种需求的人不少，网上已经有大神编译好了,[支持各个平台版本](https://github.com/iteufel/nwjs-ffmpeg-prebuilt)

&emsp;&emsp;具体操作如下：（windows）

1. 到https://github.com/iteufel/nwjs-ffmpeg-prebuilt/releases下载对应nw.js的 ffmpeg 库文件
2. 打开本地的nw目录至：

```
G:\DEV\BIN\WINDOWSAPPDEV\BIN\MY
│  1.txt
│  credits.html
│  d3dcompiler_47.dll
│  **ffmpeg.dll** (替换此文件)
│  icudtl.dat
│  libEGL.dll
│  libGLESv2.dll
│  my.exe
│  natives_blob.bin
│  node.dll
│  nw.dll
│  nw_100_percent.pak
│  nw_200_percent.pak
│  nw_elf.dll
│  resources.pak
│  snapshot_blob.bin
```

## 参考文献

http://docs.nwjs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/

https://github.com/iteufel/nwjs-ffmpeg-prebuilt/releases