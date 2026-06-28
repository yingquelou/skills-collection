---
name: condition-based-waiting
description: 指导AI使用基于条件的等待策略，提高测试和自动化的可靠性。
---

# 基于条件的等待技能

## 技能概述

基于条件的等待是一种自动化测试和系统集成中常用的技术，通过等待特定条件满足来同步操作。这种方法可以：
- 提高测试可靠性
- 减少不必要的等待时间
- 适应不同的系统响应时间

## 等待策略

### 策略1：固定等待

```python
import time

def fixed_wait(seconds):
    """固定时间等待"""
    time.sleep(seconds)
```

### 策略2：轮询等待

```python
def poll_wait(condition, timeout=30, interval=1):
    """轮询等待条件满足"""
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        if condition():
            return True
        time.sleep(interval)
    
    raise TimeoutError("条件未在规定时间内满足")
```

### 策略3：显式等待

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def explicit_wait(driver, locator, timeout=10):
    """显式等待元素出现"""
    wait = WebDriverWait(driver, timeout)
    element = wait.until(EC.presence_of_element_located(locator))
    return element
```

### 策略4：事件驱动等待

```python
import threading

class EventWaiter:
    def __init__(self):
        self.event = threading.Event()
    
    def wait_for_event(self, timeout=None):
        """等待事件触发"""
        return self.event.wait(timeout)
    
    def trigger_event(self):
        """触发事件"""
        self.event.set()
```

## 等待条件类型

### 元素可见性

```python
def wait_for_element_visible(driver, locator):
    """等待元素可见"""
    wait = WebDriverWait(driver, 10)
    return wait.until(EC.visibility_of_element_located(locator))
```

### 元素可点击

```python
def wait_for_element_clickable(driver, locator):
    """等待元素可点击"""
    wait = WebDriverWait(driver, 10)
    return wait.until(EC.element_to_be_clickable(locator))
```

### 文本出现

```python
def wait_for_text(driver, locator, text):
    """等待文本出现"""
    wait = WebDriverWait(driver, 10)
    return wait.until(EC.text_to_be_present_in_element(locator, text))
```

### 页面加载完成

```python
def wait_for_page_load(driver, timeout=30):
    """等待页面加载完成"""
    wait = WebDriverWait(driver, timeout)
    wait.until(
        lambda d: d.execute_script("return document.readyState") == "complete"
    )
```

## 最佳实践

### 1. 使用显式等待
优先使用显式等待而非固定等待。

### 2. 设置合理的超时时间
根据操作复杂度设置适当的超时。

### 3. 处理超时异常
优雅地处理超时情况。

### 4. 避免轮询过于频繁
合理设置轮询间隔。

### 5. 结合多种等待策略
根据场景选择合适的等待方式。

## 总结

基于条件的等待是一种强大的同步技术，通过：
- 等待特定条件满足
- 避免不必要的等待
- 提高测试可靠性

可以创建更稳定的自动化测试和集成流程。