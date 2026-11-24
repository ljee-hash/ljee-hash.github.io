# 从零设计一个统一 SQL 执行平台:多引擎与 100 qps 架构实践

数据团队同时用 Doris 和 Spark 时,SQL 往往散落在各个工具里,集群地址写死在脚本中,谁在什么时候跑了什么也很难说清。本文介绍我设计的统一 SQL 执行平台:一个入口、多种引擎、可取消、可审计,并按 100 qps 的交互查询做容量设计。

最关键的一个结论:100 qps 下不能让每个任务都起一个容器,必须把交互查询和批量任务拆成两条通道。

本文已结合当前主流架构实践与官方机制,对最初设计中预留的四个待定项(Worker 并发估算、查询耗时与写入量校准、Spark 运行底座选择、自研权限与细粒度管控流程)完成了方案收敛,并补充了基于现有 ERP 表的轻量化身份集成方案、核心元数据/权限表结构与 Docker Compose V2 联调配置,可直接作为落地与压测验收基准。

## 为什么需要统一执行平台

没有统一入口的团队,通常会撞上四个问题:

* **引擎各自为政**:Doris 用一种客户端,Spark 用另一种,提交方式、账号、日志位置都不一样。

* **地址写死在脚本里**:集群扩容、下线或切换,要逐个改脚本,漏改一个就是一次故障。

* **没有统一的执行记录**:谁跑了什么、跑了多久、为什么失败,要去各个引擎里翻日志。

* **取消不彻底**:用户关掉页面,引擎里的查询还在跑,占着资源。

这四件事的共同解法是在用户和引擎之间加一层:用户只和平台打交道,平台负责选引擎、选集群、记录和取消。

## 总体架构

平台由入口加三层组成:控制面管状态、身份与权限校验和路由,执行面分两条通道,引擎层是 Doris 和 Spark。

$$
embedded content: 总体架构 · 3 层 + 入口,2 条通道
$$

控制面是两条通道共用的:Task API 管身份认证、提交、SQL 解析鉴权、分流、状态机和对账,Router 管数据源和健康检查,MySQL 存元数据、影子用户表与自研权限表。分流发生在 Task API,交互 SQL 去常驻的 Query Worker 池,批量任务去 K8s Job。

可观测性横跨各层:Prometheus 采集指标,一个全链路 ID 把执行记录、Job 和引擎里的查询串起来,出问题时能从任何一头反查到另一头。

## 一次查询的旅程

一次提交从进门到出结果要走六步,交互查询跳过其中的拉脚本和起容器。

1. 调用方提交 SQL 或脚本 ID,Task API 校验身份(人工走 ERP 签发的 JWT,机机调度走 AK/SK)、解析 SQL 涉及的库表并校验两段式细粒度权限与并发上限,写入执行记录,状态为排队。

2. Task API 按任务类型分流:交互 SQL 交给常驻的 Query Worker 池,批量任务创建一个 K8s Job。

3. 执行方向 Router 取候选集群,按权重选一个,并在 SQL 开头加上追踪注释。批量任务还要先从脚本中心拉取脚本,校验 MD5。

4. 通过连接池(Doris)或 Kyuubi(Spark)执行,结果以流式方式取回,最多 1000 行。

5. 日志实时写入对象存储,状态回写 MySQL。

6. 对账任务每分钟比对执行记录和真实运行状态,修复不一致。

追踪注释是加在 SQL 开头的一段 `/*tid=...;user=...*/`。引擎侧的慢查询日志和审计日志靠它反查到是谁的哪一次执行,取消时也靠它找到要终止的查询。

## 100 qps 逼出来的设计:两条通道

我最初的方案很自然:每个任务起一个 K8s Job,用完即销毁。隔离好、超时和资源限制现成,小流量下很舒服。但目标定到 100 qps 后,这个方案就不成立了。

原因在于 Pod 的启动是秒级的。100 qps 乘以几秒的启动和执行时间,同时存在的 Pod 会达到几百个以上,K8s 控制面和节点都扛不住,而用户要的只是一个秒级的查询结果。

解法是承认两类请求本质不同,各走各的路:

| 通道 | 用途 | 执行方式 | 结果 | 
| ----- | ----- | ----- | ----- | 
| 交互通道 | Doris 查询,秒级返回 | Task API 把 SQL 交给常驻的 Query Worker 池,Worker 用连接池直连 Doris,同步流式返回 | 最多 1000 行 | 
| 批量通道 | Spark 任务、长查询、数据导出 | 一任务一 K8s Job,Spark 经 Kyuubi 提交 | 落对象存储,可下载 | 

交互通道牺牲了“一任务一容器”的强隔离,换来毫秒级的启动开销;隔离改由并发上限、单查询超时和每用户限流来保证。批量通道保留强隔离,因为这类任务少、时间长,启动开销可以忽略。

另一个顺带的好处是结果集管理:交互通道限制 1000 行,更大的结果走批量通道落文件,避免有人用交互查询做大批量导出,拖垮网关和引擎。

## 容量估算:从 100 qps 推出机器数

并发数等于 qps 乘以平均耗时(利特尔法则)。平均耗时是最关键的变量,它每放大 10 倍,所需并发和机器也放大 10 倍。

| 平均耗时 | 峰值并发(100 qps) | 
| ----- | ----- | 
| 0.2 秒 | 20 | 
| 1 秒 | 100 | 
| 3 秒 | 300 | 
| 10 秒 | 1000 | 

以下按平均耗时 1 秒估算,峰值并发 100 到 150 作为基线配置:

| 组件 | 规模 | 依据 | 
| ----- | ----- | ----- | 
| Query Worker | 4 到 6 副本,每副本 2C4G | 由连接池上限、账号池拆分数及 Doris 队列拐点决定,预留至少 1 个副本冗余 | 
| Task API | 3 副本 | 100 qps 的提交、身份与 SQL 鉴权、状态调度 | 
| Router | 2 副本 | 只读配置,Worker 本地缓存,压力小 | 
| Kyuubi | 2 副本 | Spark 提交频率远低于 100 qps;多副本需外部 ZooKeeper 做高可用注册发现 | 
| MySQL | 云 RDS 主从 | 峰值约每秒 200 次写(插入加更新),需启用批量合并写入与关键状态落库 | 
| K8s 节点 | 起步 4 个 8C16G | 常驻服务约 25C,另留批量 Job 的余量 | 

并发上限是保护引擎的最后一道闸,起始值如下,压测后再微调:

* 交互通道全局并发:峰值并发的 1.5 倍

* 每用户并发:10

* 超出上限:直接返回 429,不无限排队

* 交互查询超时:60 秒,超时自动终止

100 qps 只能是 Doris 交互查询的量。Spark 任务单个就要秒到分钟级,不可能达到这个提交频率,会走批量通道单独限流。

## 三个最容易踩的坑

平台的功能清单大同小异,真正拉开差距的是下面三件事。它们在演示时都看不出来,上线后才会暴露。

**1. 取消只做一半**

用户点了取消,平台删掉了容器,但引擎里的查询还在跑,继续占着资源。取消必须是两步都成功:先终止容器或 Worker 的会话,再向引擎发 `KILL QUERY`,并确认查询已经从引擎里消失,才把状态置为已取消。任一步失败就保持运行状态,交给对账任务继续重试。

**2. 状态和现实对不上**

容器崩溃、节点被回收、网络抖动,都会让执行记录停在“运行中”。解法是一个每分钟跑一次的对账任务:扫描排队和运行中的记录,和 K8s 里 Job 的真实状态比对。Job 已结束就补写结果;Job 不存在就置为失败并告警。没有对账的平台,用户迟早会看到永远在跑的任务。

**3. 控制面一挂,全部瘫痪**

Router 是每个任务启动时都要访问的,它如果宕机,新任务全部起不来。三层防护:Router 和 Task API 都至少两个副本;Runner 和 Worker 本地缓存最近一次的数据源列表,Router 短暂不可用时照常执行;缓存也没有时,明确失败并给出原因,不静默等待。

另外还有两条小规则:语法错误和权限错误不要重试,只重试连接类错误;写操作重试前要确认上一次没有执行成功,否则会重复执行。

## 选型:哪些买,哪些造(坚持控制面与权限体系自研)

原则是底层计算调度与多引擎网关用成熟的开源方案,而**任务状态机、路由调度、轻量化身份对接以及两段式细粒度权限中心全部自研**。这样既避免了自研 JDBC 驱动代理的排错成本,也规避了重度引入 Keycloak 或 Apache Ranger 带来的双写同步延迟与运维复杂度。

| 模块 | 选择 | 原因 | 
| ----- | ----- | ----- | 
| 多引擎 SQL 网关 | Apache Kyuubi | 对外统一提供 JDBC 接口,Spark 提交、会话管理和引擎复用都已具备,自研的代价和兼容性风险高 | 
| 运行底座 | 云托管 Kubernetes | 批量通道的 Job、超时、资源限制和自动清理都是现成能力;开发联调期可用 Docker Compose V2 快速拉起全套环境 | 
| Doris 接入 | 连接池直连 | Doris 兼容 MySQL 协议,不需要额外网关 | 
| 身份认证集成 | **自研轻量化适配层**(直连 ERP 用户源 + JWT/AK-SK) | 直接复用公司现有 ERP 组织与人员表,避免重资产部署 Keycloak 造成双份身份源维护 | 
| 任务状态机、对账 | **自研** | 和公司的任务模型、全链路追踪绑定,没有开源方案可直接套用 | 
| 细粒度权限中心与申请流 | **自研** | 原生实现“先申库、再申表及列/行过滤”审批流,在 Task API 入口通过 AST 解析直接拦截,统一管控 Doris 与 Spark | 
| Router(数据源、权重、健康检查) | **自研**,可与 Task API 合并部署 | 逻辑简单,但必须贴合自己的集群拓扑 | 
| 脚本中心 | 对象存储 + 元数据表 | 存文件、记版本和 MD5 即可,不需要独立系统 | 
| 元数据库 | 云 RDS MySQL 主从 | 备份和故障切换交给云,不在容器里自己跑 | 

## 四个关键验证项的落地定型

针对早期设计中的四个关键验证点,结合主流技术栈规范与自研控制面约束,落地策略定型如下:

### 1. Worker 并发:弃用“每副本 50”假设,按连接池与 Doris 队列拐点定容

单个 Query Worker 副本的稳定并发上限不取决于 Worker 自身的 CPU/内存转发能力,而由**连接池大小、账号分池乘积与 Doris 侧队列限流**共同决定。

* **采用小连接池 + 排队模型**:参考 HikariCP 等主流连接池实践,单池连接数保持在几十以内的小规模,让瞬时突发请求在 Worker 侧短时排队,避免盲目放大连接数导致 Doris FE/BE 线程抖动与上下文切换([HikariCP 池大小指南](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing))。

* **硬性连接数不等式约束**:Doris 按账号/业务域隔离连接池时,全局总连接数必须满足:

$$
\text{Worker 副本数} \times \text{单池连接数} \times \text{账号池数} < \min\left(\text{FE 节点数} \times \text{qe\_max\_connection},\ \text{max\_user\_connections}\right)
$$

(其中单 FE 默认 `qe_max_connection` 通常为 1024,超限会触发 `Reach limit of connection`)([社区讨论](https://github.com/apache/doris/discussions/18235))。

* **Doris Workload Group 多 FE 拆分**:显式配置工作负载组的 `max_concurrency`、`max_queue_size` 与 `queue_timeout`。多 FE 部署下该阈值按单 FE 生效,单 FE 配置值应等于目标总并发除以 FE 节点数([Doris 并发控制](https://doris.apache.org/docs/4.x/admin-manual/workload-management/concurrency-control-and-queuing/))。

* **拐点压测验收法**:按阶梯加压至 100 qps,同步监控 Worker 等待队列长度、查询 P95/P99 延迟,以及 `SHOW WORKLOAD GROUPS` 中的 `running_query_num` 和 `waiting_query_num`。以延迟斜率开始抬升或队列积压前的稳态吞吐作为单副本安全上限,并预留 1 个副本余量。

### 2. 查询耗时、日均 QPS 与 MySQL 写入量校准

这两个核心输入不依赖经验拍数,直接从业务现状回填并做写放大收敛:

* **审计日志回填与分时建模**:从 Doris 审计日志抽取近 30 天查询明细([Doris 安全概览](https://doris.apache.org/docs/4.x/admin-manual/auth/security-overview/)),按小时统计 QPS 曲线及 P50、P95 耗时。白天工作时段峰值显著高于日均均值,容量设计以**高峰时段 QPS × P95 耗时**作为并发上限基准;日任务总量按 $\text{日均 QPS} \times 86400$ 估算(例如日均 20 QPS 约 173 万条/天)。

* **MySQL 写放大控制**:交互通道下若每条 SQL 均产生多次状态落库,100 qps 峰值会带来每秒 200 次以上的行更新与索引竞争。落地时需采用**批量合并写入(Batch Insert/Update)**,并仅在关键状态跃迁(创建、终态回写)落库,中间心跳与进度优先走内存态或轻量聚合。

### 3. Spark 运行方式:顺应存量底座(YARN 优先复用,无存量走 K8s)

Kyuubi 对 YARN 与 Kubernetes 均提供原生支持,选型标准完全取决于现有数据与算力基础设施:

| 现有基础设施状态 | 推荐底座 | 核心依据 | 
| ----- | ----- | ----- | 
| 已有成熟 Hadoop/YARN 集群,数据在 HDFS 且依赖 Hive Metastore | **Spark on YARN** | 复用现成队列配额、HDFS 数据本地性及运维监控体系,无需重复建设 | 
| 无存量 Hadoop 负担,数据主要在对象存储,团队已在运维 K8s | **Spark on K8s** | 与平台批量通道共享同一套云原生资源池,镜像级依赖隔离更干净 | 

若采用 Spark on K8s,必须显式配置 `spark.submit.deployMode=cluster`(使 Driver 独立成 Pod 与 Kyuubi Server 隔离)、`spark.kubernetes.file.upload.path` 及 Driver ServiceAccount([Kyuubi on K8s](https://kyuubi.readthedocs.io/en/master/deployment/engine_on_kubernetes.html))。同时提前锁定三项参数:普通交互探索采用 `USER` 共享级别(默认 30 分钟空闲回收),大型临时 ETL 采用 `CONNECTION` 独立引擎级别([Kyuubi 共享级别](https://kyuubi.readthedocs.io/en/master/deployment/engine_share_level.html));多副本 Kyuubi 必须接入外部 ZooKeeper 集群([Kyuubi 高可用](https://kyuubi.readthedocs.io/en/v1.5.0-incubating/deployment/high_availability_guide.html))。

### 4. 轻量化身份集成(复用 ERP 表)与自研两段式权限管控

为避免引入 Keycloak、Ranger 等重型外部中间件导致的双写同步与高运维成本,平台采取**“ERP 唯一身份源直连 + 影子用户表 + 自研库表细粒度权限门禁”**的轻量化闭环:

#### (一) 复用 ERP 用户表的零中间件身份集成

1. **三类接入模式按需组合**:
   * **账密登录校验**:SQL 平台登录页提交账密后,Task API 直接调用 ERP 内部 `verifyUser` 校验接口,或查询 DBA 开放的**ERP 脱敏只读视图**(仅含工号 `emp_id`、姓名、部门、在职状态与密码哈希)完成验证。
   * **ERP 门户免登跳转**:若员工已在 ERP 浏览器会话中,可通过同主域网关校验透传(网关校验 ERP Session 后向内网 Task API 透传 `X-User-Id`,需严格限制非网关直连),或由 ERP 跳转携带 30 秒一次性签名 `ticket` 回调换取本平台 JWT。
   * **机机调度调用(AK/SK)**:针对定时任务、外部系统自动化调用 Task API 的场景,独立签发服务账号 `AppKey + AppSecret`,不复用人工 ERP 登录态。

2. **身份主键与离职实时熔断**:
   * 统一采用 ERP 不可变的**工号 `emp_id`** 作为全局 `user_id`,写入本地影子用户表(`sys_user_shadow`)及 SQL 追踪注释 `/*tid=...;user=...*/`,防止人员改名或重名引发权限串号。
   * Access Token 有效期控制在 15～30 分钟;每次刷新 Token 或提交批量导出任务时核验在职状态,一旦 ERP 人员离职/禁用,立即阻断访问并自动失效其库表授权。

#### (二) 两段式权限申请流(先库后表)+ AST 门禁

底层引擎统一通过平台托管的技术账号(Service Account)连接,所有业务用户的访问控制均在 Task API 入口完成闭环:

1. **第一阶段:库级权限申请(Catalog / Database 准入)**
   * **权限范围**:仅授予目标库的可见性及基础元数据浏览(`SHOW TABLES` / `DESC`)权限,默认不包含任何库内表的 `SELECT` 数据读取权限。
   * **审批机制**:由域负责人或自动化准入规则快速审批,让使用者能先在 SQL 编辑器中浏览库结构、定位目标表,防止“一申库就拿到全库敏感数据”。

2. **第二阶段:表级与细粒度权限申请(Table / Column / Row 最小权限)**
   * **权限范围**:明确具体业务用途后,针对所需的数据表申请 `SELECT`(或受控 DML/导出权限),并按需绑定**允许访问的列清单(Column Whitelist)、行级过滤条件(Row Filter)及敏感字段脱敏规则**。
   * **SQL AST 解析与改写拦截**:Task API 收到 SQL 后,通过 SQL Parser(如 Apache Calcite / JSqlParser)提取涉及的库名、表名和字段:
     * 未获库权限或表权限的请求直接拒绝(返回 403);
     * 存在列限制、脱敏规则或行级过滤时,自动在查询外层包装子查询投影或追加 `WHERE` 过滤条件后再下发至 Doris 或 Kyuubi。
   * **批量导出强化校验**:交互通道限制 1000 行返回,而批量通道支持全量结果落对象存储;针对涉及大批量导出的表级权限申请,需在审批单中显式勾选导出用途并强制开启脱敏规则。

3. **高危语法封堵**:在 AST 解析阶段直接拦截 Spark SQL 中可执行外部系统命令的 `TRANSFORM ... USING`、自定义高危 UDF 等语法,防止多租户下绕过平台沙箱([Kyuubi issue](https://github.com/apache/kyuubi/issues/7585))。

## 核心自研元数据、身份映射与权限表结构设计(MySQL 8.0)

为支撑高并发下的任务状态机、ERP 影子用户映射、机机 AK/SK 鉴权以及“先库后表”两段式细粒度权限校验,控制面核心表结构设计如下(权限快照建议在 Task API 侧增加 30 秒本地 Caffeine/Redis 缓存以支撑 100 qps 鉴权):

```sql
-- 0.1 ERP 影子用户映射表 (复用 ERP 唯一身份源, 支撑外键关联与离职状态熔断)
CREATE TABLE `sys_user_shadow` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` VARCHAR(64) NOT NULL COMMENT '全局唯一标识(对应ERP不可变工号emp_id)',
  `user_name` VARCHAR(64) NOT NULL COMMENT '员工姓名',
  `dept_id` VARCHAR(64) DEFAULT NULL COMMENT 'ERP部门ID',
  `dept_name` VARCHAR(128) DEFAULT NULL COMMENT 'ERP部门名称',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '在职状态: 1在职有效 0离职/禁用',
  `last_sync_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '最近与ERP同步时间',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_dept_status` (`dept_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP影子用户映射表';

-- 0.2 机机调用 AK/SK 凭证表 (支撑定时调度/上游系统自动化调用)
CREATE TABLE `sys_service_app` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `app_key` VARCHAR(64) NOT NULL COMMENT '应用唯一AppKey',
  `app_secret_enc` VARCHAR(256) NOT NULL COMMENT '加密存储的AppSecret',
  `app_name` VARCHAR(128) NOT NULL COMMENT '调用方系统名称',
  `owner_user_id` VARCHAR(64) NOT NULL COMMENT '责任人ERP工号(权限继承或独立绑定此账号)',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1启用 0停用',
  `expire_at` DATETIME DEFAULT NULL COMMENT '凭证过期时间',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_app_key` (`app_key`),
  KEY `idx_owner` (`owner_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='机机调用AK/SK凭证表';

-- 1. 数据源集群配置表 (Router 核心表)
CREATE TABLE `sql_datasource_cluster` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cluster_code` VARCHAR(64) NOT NULL COMMENT '集群唯一标识,如 doris_prod_01',
  `engine_type` VARCHAR(16) NOT NULL COMMENT '引擎类型: DORIS / SPARK',
  `jdbc_url` VARCHAR(512) NOT NULL COMMENT 'JDBC连接串',
  `service_user` VARCHAR(64) NOT NULL COMMENT '平台托管底层服务账号',
  `service_password_enc` VARCHAR(256) NOT NULL COMMENT '加密后的底层密码',
  `weight` INT NOT NULL DEFAULT 100 COMMENT '路由权重',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1健康 0摘除',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cluster_code` (`cluster_code`),
  KEY `idx_engine_status` (`engine_type`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据源集群配置表';

-- 2. SQL 任务执行记录表 (核心状态机与全链路追踪表, 建议按月分区)
CREATE TABLE `sql_execution_task` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `tid` VARCHAR(64) NOT NULL COMMENT '全局全链路追踪ID (注入SQL注释)',
  `user_id` VARCHAR(64) NOT NULL COMMENT '提交人ERP工号或服务主体ID',
  `auth_type` VARCHAR(16) NOT NULL DEFAULT 'ERP_JWT' COMMENT '认证方式: ERP_JWT / APP_AKSK',
  `channel` VARCHAR(16) NOT NULL COMMENT '执行通道: INTERACTIVE / BATCH',
  `engine_type` VARCHAR(16) NOT NULL COMMENT '引擎类型: DORIS / SPARK',
  `cluster_code` VARCHAR(64) DEFAULT NULL COMMENT '实际路由选中的集群',
  `sql_hash` CHAR(32) NOT NULL COMMENT 'SQL MD5摘要',
  `sql_content` MEDIUMTEXT NOT NULL COMMENT '原始或改写后的SQL文本',
  `status` VARCHAR(16) NOT NULL COMMENT '状态: QUEUED / RUNNING / SUCCESS / FAILED / CANCELED',
  `k8s_job_name` VARCHAR(128) DEFAULT NULL COMMENT '批量通道对应的K8s Job名称',
  `engine_query_id` VARCHAR(128) DEFAULT NULL COMMENT '引擎侧QueryID(用于KILL QUERY)',
  `result_rows` INT DEFAULT 0 COMMENT '返回行数',
  `result_oss_path` VARCHAR(512) DEFAULT NULL COMMENT '批量结果或完整日志OSS路径',
  `error_msg` TEXT DEFAULT NULL COMMENT '失败或拒绝原因',
  `submit_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '提交时间',
  `start_time` DATETIME(3) DEFAULT NULL COMMENT '开始执行时间',
  `end_time` DATETIME(3) DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`id`, `submit_time`),
  UNIQUE KEY `uk_tid_time` (`tid`, `submit_time`),
  KEY `idx_user_time` (`user_id`, `submit_time`),
  KEY `idx_status_reconcile` (`status`, `submit_time`) COMMENT '用于每分钟对账任务扫描'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='SQL任务执行记录表';

-- 3. 第一阶段: 用户库级准入权限表 (先申库)
CREATE TABLE `perm_user_database` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(64) NOT NULL COMMENT '用户ERP工号',
  `engine_type` VARCHAR(16) NOT NULL COMMENT '引擎类型: DORIS / SPARK',
  `db_name` VARCHAR(128) NOT NULL COMMENT '数据库名',
  `perm_level` VARCHAR(16) NOT NULL DEFAULT 'METADATA' COMMENT '权限级别: METADATA(仅浏览表结构)',
  `expire_at` DATETIME NOT NULL COMMENT '权限过期时间',
  `apply_ticket_id` VARCHAR(64) DEFAULT NULL COMMENT '关联审批单号',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_engine_db` (`user_id`, `engine_type`, `db_name`),
  KEY `idx_expire` (`expire_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户库级准入权限表';

-- 4. 第二阶段: 用户表级及细粒度权限表 (再申表及列/行管控)
CREATE TABLE `perm_user_table` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(64) NOT NULL COMMENT '用户ERP工号',
  `engine_type` VARCHAR(16) NOT NULL COMMENT '引擎类型: DORIS / SPARK',
  `db_name` VARCHAR(128) NOT NULL COMMENT '数据库名',
  `table_name` VARCHAR(128) NOT NULL COMMENT '数据表名',
  `actions` VARCHAR(64) NOT NULL DEFAULT 'SELECT' COMMENT '操作权限: SELECT,EXPORT',
  `allowed_columns` JSON DEFAULT NULL COMMENT '允许查询的列白名单JSON数组, NULL表示全列',
  `masking_rules` JSON DEFAULT NULL COMMENT '字段脱敏规则JSON, 如 {"phone":"MASK_MOBILE"}',
  `row_filter_expr` VARCHAR(512) DEFAULT NULL COMMENT '行级过滤SQL条件, 如 dept_id = 1001',
  `expire_at` DATETIME NOT NULL COMMENT '权限过期时间',
  `apply_ticket_id` VARCHAR(64) DEFAULT NULL COMMENT '关联审批单号',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_table` (`user_id`, `engine_type`, `db_name`, `table_name`),
  KEY `idx_expire` (`expire_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表级及细粒度权限表';

-- 5. 权限申请与审批流水表 (支撑先库后表两段式申请)
CREATE TABLE `perm_apply_ticket` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_no` VARCHAR(64) NOT NULL COMMENT '审批单编号',
  `applicant_id` VARCHAR(64) NOT NULL COMMENT '申请人ERP工号',
  `apply_stage` VARCHAR(16) NOT NULL COMMENT '申请阶段: DB_STAGE(库准入) / TABLE_STAGE(表细粒度)',
  `engine_type` VARCHAR(16) NOT NULL COMMENT '引擎类型',
  `db_name` VARCHAR(128) NOT NULL COMMENT '目标库名',
  `table_name` VARCHAR(128) DEFAULT NULL COMMENT '目标表名(DB_STAGE时为空)',
  `detail_spec` JSON DEFAULT NULL COMMENT '申请的动作、列清单、行过滤及过期天数',
  `reason` VARCHAR(512) NOT NULL COMMENT '申请业务用途说明',
  `approver_id` VARCHAR(64) DEFAULT NULL COMMENT '审批人ERP工号',
  `status` VARCHAR(16) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING / APPROVED / REJECTED',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ticket_no` (`ticket_no`),
  KEY `idx_applicant_status` (`applicant_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限两段式申请审批流水表';
```

## 本地联调与 CI 验证编排(Docker Compose V2)

在开发联调与集成测试阶段,研发小组可直接使用以下 **Docker Compose V2** 配置在本地或测试机一键拉起自研控制面(`task-api`、`router`、`query-worker`)、元数据库(`mysql`)以及 `zookeeper` + `kyuubi` 网关底座,快速验证双通道分流、ERP 影子鉴权、AST 权限拦截与全链路取消逻辑:

```yaml
name: unified-sql-platform

services:
  mysql:
    image: mysql:8.0
    container_name: sql-platform-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_dev_password
      MYSQL_DATABASE: sql_platform
      TZ: Asia/Shanghai
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./deploy/init-schema.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --innodb-flush-log-at-trx-commit=2
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-proot_dev_password"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - sql-net

  zookeeper:
    image: zookeeper:3.9
    container_name: sql-platform-zk
    environment:
      ZOO_MY_ID: 1
    ports:
      - "2181:2181"
    healthcheck:
      test: ["CMD-SHELL", "echo ruok | nc -w 2 localhost 2181 | grep imok"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - sql-net

  kyuubi:
    image: apache/kyuubi:1.9.2
    container_name: sql-platform-kyuubi
    depends_on:
      zookeeper:
        condition: service_healthy
    environment:
      KYUUBI_JAVA_OPTS: "-Xmx2g -Xms1g"
    ports:
      - "10009:10009"
      - "10099:10099"
    volumes:
      - ./deploy/kyuubi-defaults.conf:/opt/kyuubi/conf/kyuubi-defaults.conf:ro
    healthcheck:
      test: ["CMD-SHELL", "bash -c '</dev/tcp/localhost/10009'"]
      interval: 10s
      timeout: 5s
      retries: 12
    networks:
      - sql-net

  router:
    build:
      context: ./services/router
      dockerfile: Dockerfile
    container_name: sql-platform-router
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/sql_platform?useSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root_dev_password
      SERVER_PORT: 8081
    ports:
      - "8081:8081"
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:8081/actuator/health || exit 1"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - sql-net

  task-api:
    build:
      context: ./services/task-api
      dockerfile: Dockerfile
    container_name: sql-platform-task-api
    depends_on:
      mysql:
        condition: service_healthy
      router:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/sql_platform?useSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root_dev_password
      ROUTER_ENDPOINT: http://router:8081
      WORKER_ENDPOINT: http://query-worker:8082
      ERP_AUTH_MODE: VIEW_OR_RPC
      ERP_VERIFY_ENDPOINT: http://erp-internal-mock:8090/api/auth/verify
      JWT_SECRET_KEY: dev_jwt_secret_change_in_prod
      JWT_ACCESS_TTL_MINUTES: 30
      PERMISSION_CACHE_TTL_SECONDS: 30
      INTERACTIVE_MAX_ROWS: 1000
      SERVER_PORT: 8080
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:8080/actuator/health || exit 1"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - sql-net

  query-worker:
    build:
      context: ./services/query-worker
      dockerfile: Dockerfile
    depends_on:
      router:
        condition: service_healthy
    environment:
      ROUTER_ENDPOINT: http://router:8081
      HIKARI_MAX_POOL_SIZE: 20
      QUERY_TIMEOUT_SECONDS: 60
      SERVER_PORT: 8082
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: "2.0"
          memory: 4G
    networks:
      - sql-net

volumes:
  mysql_data:

networks:
  sql-net:
    driver: bridge
```

## 分阶段实施路线与总结

由熟悉 K8s 与后台服务的 2 到 3 人小组按阶段推进,上线前设置关键验收门槛。

* **阶段一:基线校准与环境初始化**
  确定 Spark 运行底座(YARN 或 K8s),从 Doris 审计日志提取分时 QPS 与耗时基线;对接 ERP 只读用户视图或内部校验接口,初始化自研库表结构并用 Docker Compose V2 拉起本地联调环境。

* **阶段二:核心链路与双通道打通**
  打通 Task API、Router、Query Worker 与 Kyuubi 双通道主链路,实现全链路 `tid` 追踪、ERP 工号与机机 AK/SK 双模鉴权、SQL AST 解析及“先库后表”两段式权限校验框架。

* **阶段三:可靠性加固与容量压测(关键上线门槛)**
  完成取消两步确认、每分钟对账任务、MySQL 批量写入改造、离职状态实时熔断及高危 SQL 语法拦截;执行 100 qps 阶梯压测确定 Worker 最终副本数。压测、安全检查和故障手册未齐备前严禁放量。

* **阶段四:灰度验证与逐步放量**
  先灰度一个核心业务团队,验证高频表细粒度权限与长尾查询稳定性,指标平稳后再逐步扩大接入范围。

**总结**

统一执行平台的难点不在功能清单,而在三处:用两条通道应对流量差异,把取消、对账与自研“先库后表”细粒度权限闭环做完整,让控制面故障不致命。把底层网关和资源调度交给 Kyuubi 与 K8s,直接复用现有 ERP 身份源并将控制面与权限门禁自主掌控,再通过审计日志反推容量与阶梯压测锁定拐点,即可平稳交付一个安全可控、可灰度的生产版本。
