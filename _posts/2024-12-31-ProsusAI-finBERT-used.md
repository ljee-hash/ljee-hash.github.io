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


## 详细安装步骤


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

## 特殊情况

### 使用huggingface网站连接可用情况，比较简单
https://huggingface.co/yiyanghkust/finbert-tone-chinese/blob/main/vocab.txt


### 不可使用huggingface网站，可以使用镜像网站下载预训练模型，指定路径加载






