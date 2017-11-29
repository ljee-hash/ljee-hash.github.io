---
layout:     post
title:      "OCR字体训练集wiki"
subtitle:   "OCR,tessdata"
date:       2017-11-29 17:15:06
author:     "CaoZhiLong"
header-img: "img/post-bg-write-with-opencv-ocr-tessdata.jpg"
tags:
    - OCR
---

# OCR字体训练集wiki

## 数据文件

- 特殊数据文件
- 更新版本4.00的LSTM数据文件
- 数据文件的版本4.00
- 数据文件为版本3.04 / 3.05
- 3.04 / 3.05版的多维数据集数据文件
- Fraktur数据文件
- 数据文件为版本3.02
- 2.0x版数据文件
- 受过训练的数据文件的格式

## 特殊数据文件


代码 | 描述 |	4.0 / 3.0x训练数据
---|---|---|---
OSD|方向和脚本检测|osd.traineddata
EQU|数学/方程式检测|equ.traineddata

**注意：这两个数据文件与旧版本的Tesseract兼容。osd与3.01版本兼容，并equ与3.02版本兼容。**


## 更新数据文件的版本4.00（2017年9月15日）

&emsp;&emsp;在三个独立的仓库中，我们在GitHub上有三组.traineddata文件。

- https://github.com/tesseract-ocr/tessdata_best
- https://github.com/tesseract-ocr/tessdata_fast
- https://github.com/tesseract-ocr/tessdata

大多数用户会希望 **tessdata_fast** 这是Linux发行版的一部分。 **tessdata_best**对于那些愿意交易很多速度的人来说，准确度稍高一点。高级用户的某些再训练方案也更好。

第三组**tessdata**是用于遗留识别器。++2016年11月的4.00文件既有LSTM也有旧版本。++

**注：当使用在新车型tessdata_best和tessdata_fast资料库，只有新的基于LSTM-OCR引擎支持。传统的引擎不支持这些文件，所以Tesseract的oem模式“0”和“2”不适用于它们。**

## 用于版本4.00的数据文件（2016年11月29日）

&emsp;&emsp;这组训练数据文件支持使用--oem 0的遗留识别器和使用--oem 1的LSTM模型。

注意：kur数据文件没有从3.04更新。对于Fraktur，请参阅Fraktur数据文件部分，或使用新的Fraktur.traineddata。

语言代码|语言|4.0训练数据
---|---|---|---
AFR|南非荷兰语|afr.traineddata
AMH|阿姆哈拉语|amh.traineddata
ARA|阿拉伯|ara.traineddata
ASM|阿萨姆|asm.traineddata
aze|阿塞拜疆|aze.traineddata
aze_cyrl|阿塞拜疆西里尔文|	aze_cyrl.traineddata
BEL|白俄罗斯|bel.traineddata
本|孟加拉|ben.traineddata
BOD|藏|bod.traineddata
BOS|波斯尼亚|bos.traineddata
BUL|保加利亚语|bul.traineddata
cat|加泰罗尼亚语; 巴伦西亚|	cat.traineddata
CEB|宿务|ceb.traineddata
CES|捷克|ces.traineddata
chi_sim|简体中文|chi_sim.traineddata
chi_tra|中国传统的|chi_tra.traineddata
CHR|切诺基|chr.traineddata
CYM|威尔士语|cym.traineddata
担|丹麦|dan.traineddata
申|德语|deu.traineddata
dzo|不丹文|dzo.traineddata
埃尔|希腊，现代（1453-）|ell.traineddata
工程|英语|eng.traineddata
ENM|英文，中文（1100-1500）|enm.traineddata
EPO|世界语|epo.traineddata
美东时间|爱沙尼亚语|est.traineddata
EUS|巴斯克|eus.traineddata
FAS|波斯语|fas.traineddata
鳍|芬兰|fin.traineddata
FRA|法国|fra.traineddata
FRK|法兰克|frk.traineddata
FRM|法国，中东（约1400-1600）|frm.traineddata
GLE|爱尔兰的|gle.traineddata
GLG|加利西亚|glg.traineddata
GRC|希腊文，古代（-1453）|grc.traineddata
GUJ|古吉拉特语|guj.traineddata
帽子|海地-意大利语海地克里奥尔人|hat.traineddata
希伯来书|希伯来语|heb.traineddata
欣|印地语|hin.traineddata
HRV|克罗地亚|hrv.traineddata
勋|匈牙利|hun.traineddata
育|因纽特语|iku.traineddata
IND|印度尼西亚|ind.traineddata
ISL|冰岛的|isl.traineddata
ITA|意大利|ita.traineddata
ita_old|意大利语-老|ita_old.traineddata
JAV|爪哇|jav.traineddata
日本|日本|jpn.traineddata
根|卡纳达语|kan.traineddata
吉|格鲁吉亚|kat.traineddata
kat_old|格鲁吉亚-老|kat_old.traineddata
哈萨克斯坦|哈萨克人|kaz.traineddata
KHM|中央高棉|khm.traineddata
KIR|柯尔克孜-吉尔吉斯|kir.traineddata
KOR|朝鲜的|kor.traineddata
库尔|库尔德|kur.traineddata
老挝|老挝|lao.traineddata
LAT|拉丁|lat.traineddata
盥洗室|拉脱维亚|lav.traineddata
发光的|立陶宛|lit.traineddata
发作|马拉雅拉姆语|mal.traineddata
损伤|马拉|mar.traineddata
MKD|马其顿|mkd.traineddata
MLT|马耳他语|mlt.traineddata
MSA|马来语|msa.traineddata
妙|缅甸语|mya.traineddata
NEP|尼泊尔|nep.traineddata
NLD|荷兰-佛兰芒语|nld.traineddata
也不|挪威|nor.traineddata
ORI|奥里亚语|ori.traineddata
泛|旁遮普语-旁遮普|pan.traineddata
POL|抛光|pol.traineddata
POR|葡萄牙语|por.traineddata
脓|普什图语-普什图语|pus.traineddata
罗恩|罗马尼亚-摩尔多瓦-摩尔多瓦|ron.traineddata
RUS|俄语|rus.traineddata
SAN|梵文|san.traineddata
罪|僧伽罗语-僧伽罗语|sin.traineddata
SLK|斯洛伐克|slk.traineddata
SLV|斯洛文尼亚|slv.traineddata
温泉|西班牙语-卡斯蒂利亚|spa.traineddata
spa_old|西班牙语-卡斯蒂利亚-老|spa_old.traineddata
SQI|阿尔巴尼亚人|sqi.traineddata
SRP|塞尔维亚|srp.traineddata
srp_latn|塞尔维亚语-拉丁语|srp_latn.traineddata
SWA|斯瓦希里|swa.traineddata
SWE|瑞典|swe.traineddata
SYR|叙利亚|syr.traineddata
TAM|泰米尔人|tam.traineddata
联系电话|泰卢固语|tel.traineddata
TGK|塔吉克|tgk.traineddata
TGL|他加禄语|tgl.traineddata
THA|泰国|tha.traineddata
TIR|提格雷语|tir.traineddata
TUR|土耳其|tur.traineddata
UIG|维吾尔-维吾尔|uig.traineddata
UKR|乌克兰|ukr.traineddata
urd|乌尔都语|urd.traineddata
uzb|乌兹别克|uzb.traineddata
uzb_cyrl|乌兹别克语-西里尔文|uzb_cyrl.traineddata
vie|越南|vie.traineddata
yid|意第绪语|yid.traineddata

**数据文件为版本3.04 / 3.05**

> 注意：对于阿拉伯语和印地语，您需要训练的数据文件和立方体数据文件。

语言代码|语言|3.04/3.05训练数据
---|---|---|---
AFR|南非荷兰语|afr.traineddata
AMH|阿姆哈拉语|amh.traineddata
ARA|阿拉伯|ara.traineddata
ASM|阿萨姆|asm.traineddata
阿塞拜疆|阿塞拜疆|aze.traineddata
aze_cyrl|阿塞拜疆-西里尔文|aze_cyrl.traineddata
BEL|白俄罗斯|bel.traineddata
本|孟加拉|ben.traineddata
BOD|藏|bod.traineddata
BOS|波斯尼亚|bos.traineddata
BUL|保加利亚语|bul.traineddata
cat|加泰罗尼亚语-巴伦西亚|cat.traineddata
CEB|宿务|ceb.traineddata
CES|捷克|ces.traineddata
chi_sim|简体中文|chi_sim.traineddata
chi_tra|中国传统的|chi_tra.traineddata
CHR|切诺基|chr.traineddata
CYM|威尔士语|cym.traineddata
担|丹麦|dan.traineddata
申|德语|deu.traineddata
dzo|不丹文|dzo.traineddata
埃尔|希腊，现代（1453-）|ell.traineddata
工程|英语|eng.traineddata
ENM|英文，中文（1100-1500）|enm.traineddata
EPO|世界语|epo.traineddata
美东时间|爱沙尼亚语|est.traineddata
EUS|巴斯克|eus.traineddata
FAS|波斯语|fas.traineddata
鳍|芬兰|fin.traineddata
FRA|法国|fra.traineddata
FRK|法兰克|frk.traineddata
FRM|法国，中东（约1400-1600）|frm.traineddata
GLE|爱尔兰的|gle.traineddata
GLG|加利西亚|glg.traineddata
GRC|希腊文，古代（-1453）|grc.traineddata
GUJ|古吉拉特语|guj.traineddata
hat|海地;海地克里奥尔人|hat.traineddata
heb|希伯来语|heb.traineddata
hin|印地语|hin.traineddata
HRV|克罗地亚|hrv.traineddata
hun|匈牙利|hun.traineddata
iku|因纽特语|iku.traineddata
IND|印度尼西亚|ind.traineddata
ISL|冰岛的|isl.traineddata
ITA|意大利|ita.traineddata
ita_old|意大利语|ita_old.traineddata
JAV|爪哇|jav.traineddata
日本|日本|jpn.traineddata
根|卡纳达语|kan.traineddata
吉|格鲁吉亚|kat.traineddata
kat_old|格鲁吉亚|kat_old.traineddata
哈萨克斯坦|哈萨克人|kaz.traineddata
KHM|中央高棉|khm.traineddata
KIR|柯尔克孜-吉尔吉斯|kir.traineddata
KOR|朝鲜的|kor.traineddata
库尔|库尔德|kur.traineddata
老挝|老挝|lao.traineddata
LAT|拉丁|lat.traineddata
盥洗室|拉脱维亚|lav.traineddata
发光的|立陶宛|lit.traineddata
发作|马拉雅拉姆语|mal.traineddata
损伤|马拉|mar.traineddata
MKD|马其顿|mkd.traineddata
MLT|马耳他语|mlt.traineddata
MSA|马来语|msa.traineddata
妙|缅甸语|mya.traineddata
NEP|尼泊尔|nep.traineddata
NLD|荷兰-佛兰芒语|nld.traineddata
也不|挪威|nor.traineddata
ORI|奥里亚语|ori.traineddata
pan|旁遮普语-旁遮普|pan.traineddata
POL|抛光|pol.traineddata
POR|葡萄牙语|por.traineddata
pus|普什图语-普什图语|pus.traineddata
ron|罗马尼亚;|ron.traineddata
RUS|俄语|rus.traineddata
SAN|梵文|san.traineddata
sin|僧伽罗语-僧伽罗语|sin.traineddata
SLK|斯洛伐克|slk.traineddata
SLV|斯洛文尼亚|slv.traineddata
spa|西班牙语-卡斯蒂利亚|spa.traineddata
spa_old|西班牙语;卡斯蒂利亚老|spa_old.traineddata
SQI|阿尔巴尼亚人|sqi.traineddata
SRP|塞尔维亚|srp.traineddata
srp_latn|塞尔维亚语拉丁语|srp_latn.traineddata
SWA|斯瓦希里|swa.traineddata
SWE|瑞典|swe.traineddata
SYR|叙利亚|syr.traineddata
TAM|泰米尔人|tam.traineddata
联系电话|泰卢固语|tel.traineddata
TGK|塔吉克|tgk.traineddata
TGL|他加禄语|tgl.traineddata
THA|泰国|tha.traineddata
TIR|提格雷语|tir.traineddata
TUR|土耳其|tur.traineddata
UIG|维吾尔-维吾尔|uig.traineddata
UKR|乌克兰|ukr.traineddata
urd|乌尔都语|urd.traineddata
uzb|乌兹别克|uzb.traineddata
uzb_cyrl|乌兹别克西里尔文|uzb_cyrl.traineddata
vie|越南|vie.traineddata
yid|意第绪语|yid.traineddata


**3.04 / 3.05版的多维数据集数据文件**

&emsp;&emsp;在Tesseract 3.0x阿拉伯语和印地语中使用立方体OCR引擎。您需要下载多维数据集文件并将其移动到<ara / hin> .traineddata文件所在的同一个文件夹中。

&emsp;&emsp;在Tesseract 4.0中，Cube OCR引擎已从代码库中删除，因此如果您使用的是4.0或更新的版本，则不需要这些文件。

```
印地文：
hin.cube.bigrams， hin.cube.fold， hin.cube.lm， hin.cube.nn， hin.cube.params， hin.cube.word-频率， hin.tesseract_cube.nn

阿拉伯语：
ara.cube.bigrams， ara.cube.fold， ara.cube.lm， ara.cube.nn， ara.cube.params， ara.cube.word-频率， ara.cube.size， ara.tesseract_cube。 NN
```

Fraktur数据文件

这些数据文件是由@paalberti为一些旧版本的Tesseract准备的。dan_frak，deu_frak并swe_frak准备3.00版本， slk_frak准备3.01。paalberti / tesseract-dan-fraktur提供这些文件的更新。

语言代码|语言|4.0训练数据
---|---|---|---
dan_frak	丹麦语 - Fraktur	dan_frak.traineddata
deu_frak	德语 - Fraktur	deu_frak.traineddata
slk_frak	斯洛伐克语 - Fraktur	slk_frak.traineddata
swe_frak	瑞典语 - Fraktur	SWE-frak.traineddata
数据文件为版本3.02

语言代码|语言|4.0训练数据
---|---|---|---
AFR|南非荷兰语|正方体-OCR-3.02.afr.tar.gz
ARA|阿拉伯|正方体-OCR-3.02.ara.tar.gz
阿塞拜疆|阿塞拜疆|正方体-OCR-3.02.aze.tar.gz
BEL|白俄罗斯|正方体-OCR-3.02.bel.tar.gz
ben|孟加拉|正方体-OCR-3.02.ben.tar.gz
BUL|保加利亚语|正方体-OCR-3.02.bul.tar.gz
cat|加泰罗尼亚语-巴伦西亚|正方体-OCR-3.02.cat.tar.gz
CES|捷克|正方体-OCR-3.02.ces.tar.gz
chi_sim|简体中文|正方体-OCR-3.02.chi_sim.tar.gz
chi_tra|中国传统的|正方体-OCR-3.02.chi_tra.tar.gz
CHR|切诺基|正方体-OCR-3.02.chr.tar.gz
dan|丹麦|正方体-OCR-3.02.dan.tar.gz
deu|德语|正方体-OCR-3.02.deu.tar.gz
埃尔|希腊，现代（1453-）|正方体-OCR-3.02.ell.tar.gz
工程|英语|正方体-OCR-3.02.eng.tar.gz
ENM|英文，中文（1100-1500）|正方体-OCR-3.02.enm.tar.gz
EPO|世界语|正方体-OCR-3.02.epo.tar.gz
est|爱沙尼亚语|正方体-OCR-3.02.est.tar.gz
EUS|巴斯克|正方体-OCR-3.02.eus.tar.gz
fin|芬兰|正方体-OCR-3.02.fin.tar.gz
FRA|法国|正方体-OCR-3.02.fra.tar.gz
FRK|法兰克|正方体-OCR-3.02.frk.tar.gz
FRM|法国，中东（约1400-1600）|正方体-OCR-3.02.frm.tar.gz
GLG|加利西亚|正方体-OCR-3.02.glg.tar.gz
GRC|希腊文，古代（-1453）|正方体-OCR-3.02.grc.tar.gz
heb|希伯来语|正方体-OCR-3.02.heb.tar.gz
hin|印地语|正方体-OCR-3.02.hin.tar.gz
HRV|克罗地亚|正方体-OCR-3.02.hrv.tar.gz
hun|匈牙利|正方体-OCR-3.02.hun.tar.gz
IND|印度尼西亚|正方体-OCR-3.02.ind.tar.gz
ISL|冰岛的|正方体-OCR-3.02.isl.tar.gz
ITA|意大利|正方体-OCR-3.02.ita.tar.gz
ita_old|意大利语-老|正方体-OCR-3.02.ita_old.tar.gz
jpn|日本|正方体-OCR-3.02.jpn.tar.gz
kan|卡纳达语|正方体-OCR-3.02.kan.tar.gz
KOR|朝鲜的|正方体-OCR-3.02.kor.tar.gz
lav|拉脱维亚|正方体-OCR-3.02.lav.tar.gz
lit|立陶宛|正方体-OCR-3.02.lit.tar.gz
mal|马拉雅拉姆语|正方体-OCR-3.02.mal.tar.gz
MKD|马其顿|正方体-OCR-3.02.mkd.tar.gz
MLT|马耳他语|正方体-OCR-3.02.mlt.tar.gz
MSA|马来语|正方体-OCR-3.02.msa.tar.gz
NLD|荷兰-佛兰芒语|正方体-OCR-3.02.nld.tar.gz
nor|挪威|正方体-OCR-3.02.nor.tar.gz
POL|抛光|正方体-OCR-3.02.pol.tar.gz
POR|葡萄牙语|正方体-OCR-3.02.por.tar.gz
ron|罗马尼亚-摩尔多瓦-摩尔多瓦|正方体-OCR-3.02.ron.tar.gz
RUS|俄语|正方体-OCR-3.02.rus.tar.gz
SLK|斯洛伐克|正方体-OCR-3.02.slk.tar.gz
SLV|斯洛文尼亚|正方体-OCR-3.02.slv.tar.gz
温泉|西班牙语-卡斯蒂利亚|正方体-OCR-3.02.spa.tar.gz
spa_old|西班牙语-卡斯蒂利亚-老|正方体-OCR-3.02.spa_old.tar.gz
SQI|阿尔巴尼亚人|正方体-OCR-3.02.sqi.tar.gz
SRP|塞尔维亚|正方体-OCR-3.02.srp.tar.gz
SWA|斯瓦希里|正方体-OCR-3.02.swa.tar.gz
SWE|瑞典|正方体-OCR-3.02.swe.tar.gz
TAM|泰米尔人|正方体-OCR-3.02.tam.tar.gz
tel|泰卢固语|正方体-OCR-3.02.tel.tar.gz
TGL|他加禄语|正方体-OCR-3.02.tgl.tar.gz
THA|泰国|正方体-OCR-3.02.tha.tar.gz
TUR|土耳其|正方体-OCR-3.02.tur.tar.gz
UKR|乌克兰|正方体-OCR-3.02.ukr.tar.gz
vie|越南|正方体-OCR-3.02.vie.tar.gz

2.0x版数据文件

语言代码|语言|2.0x训练数据
---|---|---|---
deu|德语|正方体，2.00.deu.tar.gz
deu-F|德语-Fraktur|正方体-2.01.deu-f.tar.gz
eng|英语|正方体，2.00.eng.tar.gz
EUS|巴斯克|正方体-2.04-eus.tar.gz
FRA|法国|正方体，2.00.fra.tar.gz
ITA|意大利|正方体，2.00.ita.tar.gz
NLD|荷兰-佛兰芒语|正方体，2.00.nld.tar.gz
POR|葡萄牙语|正方体，2.01.por.tar.gz
spa|西班牙语-卡斯蒂利亚|正方体，2.00.spa.tar.gz
vie|越南|正方体，2.01.vie.tar.gz


受过训练的数据文件的格式

该traineddata文件为每种语言是一个正方体特定格式的存档文件。它包含Tesseract OCR过程所需的几个未压缩的组件文件。该程序combine_tessdata用于tessdata从组件文件创建一个文件，也可以像下面的示例一样提取它们：

```
Pre 4.0.0格式（包含LSTM和Legacy模式）

combine_tessdata -u eng.traineddata eng.
Extracting tessdata components from eng.traineddata
Wrote eng.unicharset
Wrote eng.unicharambigs
Wrote eng.inttemp
Wrote eng.pffmtable
Wrote eng.normproto
Wrote eng.punc-dawg
Wrote eng.word-dawg
Wrote eng.number-dawg
Wrote eng.freq-dawg
Wrote eng.cube-unicharset
Wrote eng.cube-word-dawg
Wrote eng.shapetable
Wrote eng.bigram-dawg
Wrote eng.lstm
Wrote eng.lstm-punc-dawg
Wrote eng.lstm-word-dawg
Wrote eng.lstm-number-dawg
Wrote eng.version
Version string:Pre-4.0.0
1:unicharset:size=7477, offset=192
2:unicharambigs:size=1047, offset=7669
3:inttemp:size=976552, offset=8716
4:pffmtable:size=844, offset=985268
5:normproto:size=13408, offset=986112
6:punc-dawg:size=4322, offset=999520
7:word-dawg:size=1082890, offset=1003842
8:number-dawg:size=6426, offset=2086732
9:freq-dawg:size=1410, offset=2093158
11:cube-unicharset:size=1511, offset=2094568
12:cube-word-dawg:size=1062106, offset=2096079
13:shapetable:size=63346, offset=3158185
14:bigram-dawg:size=16109842, offset=3221531
17:lstm:size=5390718, offset=19331373
18:lstm-punc-dawg:size=4322, offset=24722091
19:lstm-word-dawg:size=7143578, offset=24726413
20:lstm-number-dawg:size=3530, offset=31869991
23:version:size=9, offset=31873521
4.00.00alpha仅LSTM格式

combine_tessdata -u eng.traineddata eng.
Extracting tessdata components from eng.traineddata
Wrote eng.lstm
Wrote eng.lstm-punc-dawg
Wrote eng.lstm-word-dawg
Wrote eng.lstm-number-dawg
Wrote eng.lstm-unicharset
Wrote eng.lstm-recoder
Wrote eng.version
Version string:4.00.00alpha:eng:synth20170629:[1,36,0,1Ct3,3,16Mp3,3Lfys64Lfx96Lrx96Lfx512O1c1]
17:lstm:size=11689099, offset=192
18:lstm-punc-dawg:size=4322, offset=11689291
19:lstm-word-dawg:size=3694794, offset=11693613
20:lstm-number-dawg:size=4738, offset=15388407
21:lstm-unicharset:size=6360, offset=15393145
22:lstm-recoder:size=1012, offset=15399505
23:version:size=80, offset=15400517

建议压缩的训练数据文件
```
有一些建议用一种标准的档案格式取代Tesseract档案格式，这种格式也可以支持压缩。一对正方体-dev的论坛讨论，提出了在2014年已经ZIP格式在2017年的实验实现了作为一个拉要求提供。
