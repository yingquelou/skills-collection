---
name: root-cause-tracing
description: 指导AI追踪问题的根本原因，使用系统化方法定位问题源头。
---

# 根本原因追踪技能

## 技能概述

根本原因追踪是一种系统化的问题分析方法，用于定位问题的真正源头。通过深入分析问题，可以：
- 防止问题再次发生
- 改进系统设计
- 提高整体质量

## 追踪流程

### 第一步：定义问题

```python
def define_problem():
    """明确定义问题"""
    questions = [
        "问题的具体表现是什么？",
        "什么时候发生的？",
        "影响范围有多大？",
        "造成了什么后果？"
    ]
    return questions
```

### 第二步：收集数据

```python
def collect_data():
    """收集相关数据"""
    sources = [
        "日志文件",
        "监控数据",
        "用户报告",
        "系统状态"
    ]
    return sources
```

### 第三步：分析数据

```python
def analyze_data():
    """分析收集的数据"""
    methods = [
        "时间线分析",
        "因果关系分析",
        "模式识别",
        "对比分析"
    ]
    return methods
```

### 第四步：识别根本原因

```python
def identify_root_cause():
    """识别根本原因"""
    tools = [
        "5个为什么",
        "鱼骨图",
        "故障树分析",
        "失效模式与影响分析"
    ]
    return tools
```

### 第五步：验证假设

```python
def verify_hypothesis():
    """验证根本原因假设"""
    steps = [
        "提出假设",
        "收集证据",
        "验证假设",
        "确认根本原因"
    ]
    return steps
```

## 5个为什么方法

```python
def five_whys(problem):
    """使用5个为什么方法"""
    questions = []
    current = problem
    
    for i in range(5):
        question = f"为什么会发生'{current}'？"
        questions.append(question)
        current = get_answer(question)
    
    return questions
```

## 鱼骨图方法

```python
def fishbone_diagram():
    """使用鱼骨图分析"""
    categories = [
        "人员",
        "流程",
        "技术",
        "环境",
        "材料"
    ]
    return categories
```

## 故障树分析

```python
def fault_tree_analysis():
    """故障树分析"""
    components = [
        "顶事件",
        "中间事件",
        "基本事件",
        "逻辑门"
    ]
    return components
```

## 最佳实践

### 1. 保持客观
基于数据而非猜测。

### 2. 深入分析
不要停留在表面原因。

### 3. 记录过程
记录分析过程和发现。

### 4. 验证结论
确保根本原因正确。

### 5. 采取行动
制定预防措施。

## 总结

根本原因追踪是一种强大的问题分析方法，通过：
- 系统化的分析流程
- 多种分析工具
- 数据驱动的决策

可以准确定位问题的根本原因，防止问题再次发生。