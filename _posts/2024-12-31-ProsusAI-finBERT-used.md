# FinBERT 项目安装和配置指南

## 模型地址
ProsusAI/finBERT: https://github.com/ProsusAI/finBERT 



## 1. 项目基础介绍和主要编程语言
> 项目基础介绍
FinBERT 是一个用于金融文本情感分析的预训练 NLP 模型。它基于 BERT 语言模型，在金融领域进行了进一步的训练和微调，以更好地适应金融文本的情感分类任务。FinBERT 可以帮助用户分析金融新闻、评论等文本的情感倾向，从而为金融决策提供支持。

> 主要编程语言
FinBERT 项目主要使用 Python 编程语言进行开发和实现。BERT是一种基于Transformer Encoder模块的双向编码表示模型。针对大规模无标注语料上，BERT通过MLM与NSP任务进行无监督预训练，可以很好地对自然语言建模。详见论文BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding


> 主要任务
因采用Bert的模型框架，依然存在2个任务，预训练、微调，预训练主要是BERT通过MLM（Mask过程类似于完形填空）与NSP（类似于诗词补充句子，下一句预测）任务进行无监督预训练（使用每个字母/词位置解算），有小模型L12、大模型L24，BERT 旨在作为自然语言处理中各种应用的通用预训练模型。也就是说，经过预训练后，BERT 可以在较小的数据集上使用较少的资源进行微调，以优化其在特定任务（例如自然语言推理和文本分类）以及基于序列到序列的语言生成任务（例如问答和对话响应生成）上的性能。



## 2. 项目使用的关键技术和框架

> 关键技术
BERT (Bidirectional Encoder Representations from Transformers): 一种基于 Transformer 架构的预训练语言模型，广泛用于自然语言处理任务。
PyTorch: 一个开源的深度学习框架，用于构建和训练神经网络模型。
Hugging Face Transformers: 一个提供预训练模型和工具库的库，支持多种 NLP 任务。

> 框架
PyTorch: 用于模型的训练和推理。
Hugging Face Transformers: 用于加载和使用预训练的 BERT 模型。


> 类似的框架（有时间的话计划比较）
- BERT
- finBERT(tf)
- icsBERT
- simBERT
- Bert_DAPT_Fin
- IcsBert_DAPT2_ins
- IcsBert_DAPT2_ins_v2


## 详细安装步骤（使用预训练的模型）


### 步骤 1：克隆项目仓库

首先，使用 Git 克隆 FinBERT 项目仓库到本地：

```shell
git clone https://github.com/ProsusAI/finBERT.git
cd finBERT
```

### 步骤 2：创建并激活 Conda 环境
使用项目提供的 environment.yml 文件创建并激活 Conda 环境：

```shell
# 如果环境存在conda，请先停用 conda deactivate xxx
conda env create -f environment.yml
conda activate finbert
```


### 步骤 3：下载预训练模型
FinBERT 的预训练模型可以从 Hugging Face 模型库中下载。您可以通过以下命令下载模型：
```
mkdir -p models/sentiment
cd models/sentiment
wget https://huggingface.co/ProsusAI/finbert/resolve/main/pytorch_model.bin
wget https://huggingface.co/ProsusAI/finbert/resolve/main/config.json
cd ../..
```

### 步骤 4：配置模型路径

```shell
from transformers import BertForSequenceClassification, BertTokenizer
 
model_path = "models/sentiment"
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizer.from_pretrained(model_path)
```

### 步骤 5：运行预测示例代码

您可以使用项目提供的示例代码来测试模型的功能。例如，运行以下命令来执行情感分析：
```
python predict.py --text_path test.txt --output_dir output/ --model_path models/sentiment
```

## 如何使用 huggingface 从头开始​​训练 bert 模型？

- [stackoverflow的QA](https://stackoverflow.com/questions/69126923/how-to-train-a-bert-model-from-scratch-with-huggingface)
- [如何使用 Transformers 和 Tokenizers 从头开始​​训练新的语言模型](https://huggingface.co/blog/how-to-train)
- [Same Sentence Prediction: A new Pre-training Task for BERT](https://github.com/kaansonmezoz/bert-same-sentence-prediction)
- [DistilBERT — 更小更快的BERT模型](https://medium.com/nlp-tsupei/distilbert-%E6%9B%B4%E5%B0%8F%E6%9B%B4%E5%BF%AB%E7%9A%84bert%E6%A8%A1%E5%9E%8B-eec345d17230)
- [WordPiece 標記化](https://huggingface.co/learn/nlp-course/zh-TW/chapter6/6)
- [注意力机制算法](https://github.com/luhengshiwo/LLMForEverybody/blob/main/README.md#Attention%E6%9C%BA%E5%88%B6)
- [使用 BERT 进行文本分类](https://medium.com/@khang.pham.exxact/text-classification-with-bert-7afaacc5e49b)
- [中文-经济金融词典](https://github.com/sijichun/CNEconDict/blob/master/README.md)
- [广发证券-量化分词](https://github.com/quanttrade/gtja_windows/blob/master/%E6%8B%9B%E5%95%86%E8%AF%81%E5%88%B8_%E9%87%91%E8%9E%8D%E5%B7%A5%E7%A8%8B_%E6%8B%9B%E9%87%91%E8%AF%8D%E9%85%B7%E9%87%91%E8%9E%8D%E6%96%87%E6%9C%AC%E6%8C%96%E6%8E%98%E7%9A%84%E5%88%86%E8%AF%8D%E5%B7%A5%E5%85%B7_%E5%8F%B6%E6%B6%9B%2C%E8%B5%B5%E6%9C%88%E6%B6%93_20161101.pdf)
## 特殊情况

### 使用huggingface网站连接可用情况，比较简单
[自动下载](https://huggingface.co/yiyanghkust/finbert-tone-chinese/blob/main/vocab.txt)


### 不可使用huggingface网站，可以使用镜像网站下载预训练模型，指定路径加载
[pytorch-pretrained-bert加载本地预训练模型](https://blog.csdn.net/mch2869253130/article/details/105538245)

## Interpretation
https://en.wikipedia.org/wiki/BERT_(language_model)
ELMo、GPT-2 和 BERT 等语言模型催生了“BERTology”研究，该研究试图解释这些模型学到了什么。它们在这些自然语言理解任务上的表现尚不清楚。[ 3 ] [ 16 ] [ 17 ] 2018 年和 2019 年的几篇研究出版物重点研究了 BERT 输出背后的关系，这些关系包括精心选择的输入序列、[ 18 ] [ 19 ]通过探测分类器分析内部向量表示、 [ 20 ] [ 21 ]以及注意力权重所表示的关系。[ 16 ] [ 17 ]

BERT 模型的高性能也可以归因于它是双向训练的。[ 22 ]这意味着基于 Transformer 模型架构的 BERT 在训练过程中应用其自注意力机制从左侧和右侧学习文本中的信息，从而深入了解上下文。例如，单词fine可以根据上下文有两种不同的含义（“我今天感觉很好” ，“她有一头漂亮的金发”） 。BERT 从左侧和右侧考虑目标词fine周围的单词。

然而，这是有代价的：由于缺少解码器的编码器架构，BERT 无法被提示，也无法生成文本，而双向模型通常在没有右侧的情况下无法有效工作，因此很难提示。举个例子，如果有人想用 BERT 来继续一个句子片段“今天，我去了”，那么他会天真地将所有标记屏蔽为“今天，我去了 [MASK] [MASK] [MASK]...... [MASK]”。其中的数量 [MASK] 是希望延伸到的句子的长度。然而，这构成了数据集的转移，因为在训练过程中，BERT 从未见过有这么多标记被屏蔽的句子。因此，它的性能下降了。更复杂的技术允许生成文本，但计算成本很高。

## 激励函数 loss 
[SigLit | SigLip |Sigmoid Loss for Language Image Pre-Training](https://blog.csdn.net/a486259/article/details/142312703)

