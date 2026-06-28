---
name: when-stuck
description: 指导AI在遇到瓶颈时采取有效的解决策略，克服障碍继续前进。
---

# 遇到瓶颈时的处理技能

## 技能概述

在软件开发过程中遇到瓶颈是常见的挑战。有效的处理策略应该：
- 识别问题根源
- 尝试不同的方法
- 寻求帮助
- 保持积极心态

## 处理流程

### 第一步：识别瓶颈类型

```python
def identify_bottleneck_type():
    """识别瓶颈类型"""
    types = {
        "技术瓶颈": "无法实现某个技术功能",
        "知识瓶颈": "缺乏必要的知识或经验",
        "创意瓶颈": "无法产生新想法",
        "流程瓶颈": "工作流程受阻",
        "动机瓶颈": "缺乏动力或热情"
    }
    return types
```

### 第二步：分析问题

```python
def analyze_problem():
    """分析问题"""
    questions = [
        "问题的具体表现是什么？",
        "尝试过哪些解决方案？",
        "为什么这些方案不起作用？",
        "问题的根本原因是什么？",
        "需要什么信息才能解决问题？"
    ]
    return questions
```

### 第三步：尝试解决方案

```python
def try_solutions():
    """尝试不同的解决方案"""
    strategies = [
        "查阅文档和资料",
        "尝试简化问题",
        "从不同角度思考",
        "暂时搁置，稍后再看",
        "寻求他人帮助"
    ]
    return strategies
```

### 第四步：评估进展

```python
def evaluate_progress():
    """评估进展"""
    criteria = [
        "是否有新的思路？",
        "是否取得了任何进展？",
        "是否需要调整策略？",
        "是否需要寻求外部帮助？"
    ]
    return criteria
```

## 解决策略

### 策略1：分而治之

```python
def divide_and_conquer(problem):
    """将问题分解为小部分"""
    parts = split_problem(problem)
    
    for part in parts:
        if is_solvable(part):
            solve_part(part)
        else:
            divide_and_conquer(part)
```

### 策略2：类比思维

```python
def use_analogy(problem):
    """寻找类似问题的解决方案"""
    similar_problems = find_similar(problem)
    
    for similar in similar_problems:
        solution = get_solution(similar)
        adapted = adapt_solution(solution, problem)
        if test_solution(adapted):
            return adapted
```

### 策略3：简化问题

```python
def simplify_problem(problem):
    """简化问题"""
    simplified = remove_constraints(problem)
    solution = solve_simple(simplified)
    
    # 逐步添加约束
    for constraint in get_constraints(problem):
        solution = add_constraint(solution, constraint)
    
    return solution
```

### 策略4：休息一下

```python
def take_break():
    """暂时休息"""
    activities = [
        "散步",
        "听音乐",
        "喝杯水",
        "做一些简单的任务"
    ]
    return activities
```

## 寻求帮助的时机

```python
def should_ask_for_help():
    """判断是否需要寻求帮助"""
    conditions = [
        "尝试了多种方法仍未解决",
        "问题阻碍了项目进度",
        "截止日期临近",
        "问题超出了当前知识范围"
    ]
    return any(conditions)
```

## 最佳实践

### 1. 保持耐心
解决问题需要时间。

### 2. 记录尝试过的方法
避免重复劳动。

### 3. 保持积极心态
相信问题最终可以解决。

### 4. 庆祝小胜利
每一步进展都是成功。

### 5. 从经验中学习
记录解决方案以便将来参考。

## 总结

遇到瓶颈时，通过：
- 识别问题类型
- 尝试多种策略
- 适时寻求帮助
- 保持积极心态

可以有效克服障碍，继续前进。