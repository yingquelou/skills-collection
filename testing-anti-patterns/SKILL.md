---
name: testing-anti-patterns
description: 指导AI识别和避免测试中的常见反模式，提高测试质量。
---

# 测试反模式技能

## 技能概述

测试反模式是测试实践中常见的不良做法，会降低测试的有效性和可维护性。识别和避免这些反模式可以：
- 提高测试质量
- 减少维护成本
- 增强测试可靠性

## 常见测试反模式

### 反模式1：测试实现细节

```python
# 不好的做法 - 测试实现细节
def test_internal_method():
    obj = MyClass()
    obj._internal_method = Mock()
    obj.public_method()
    obj._internal_method.assert_called_once()

# 好的做法 - 测试行为
def test_public_behavior():
    obj = MyClass()
    result = obj.public_method()
    assert result == expected_value
```

### 反模式2：测试过多

```python
# 不好的做法 - 重复测试
def test_add_1_and_2():
    assert add(1, 2) == 3

def test_add_2_and_3():
    assert add(2, 3) == 5

def test_add_3_and_4():
    assert add(3, 4) == 7

# 好的做法 - 参数化测试
@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (2, 3, 5),
    (3, 4, 7)
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

### 反模式3：测试速度慢

```python
# 不好的做法 - 依赖外部服务
def test_api_integration():
    response = requests.get("https://api.example.com/data")
    assert response.status_code == 200

# 好的做法 - 使用Mock
def test_api_integration_with_mock():
    with mock.patch("requests.get") as mock_get:
        mock_get.return_value.status_code = 200
        result = fetch_data()
        assert result is not None
```

### 反模式4：测试缺乏隔离

```python
# 不好的做法 - 测试相互依赖
def test_create_user():
    user = create_user("test@example.com")
    global created_user_id
    created_user_id = user.id

def test_get_user():
    user = get_user(created_user_id)  # 依赖前一个测试
    assert user.email == "test@example.com"

# 好的做法 - 每个测试独立
def test_user_operations():
    user = create_user("test@example.com")
    retrieved = get_user(user.id)
    assert retrieved.email == "test@example.com"
```

### 反模式5：测试命名不清晰

```python
# 不好的做法 - 命名模糊
def test_login():
    # 测试什么场景？
    pass

# 好的做法 - 描述性命名
def test_login_with_valid_credentials():
    pass

def test_login_with_invalid_password():
    pass
```

### 反模式6：过度模拟

```python
# 不好的做法 - 过度Mock
def test_with_too_many_mocks():
    with mock.patch("module.A"):
        with mock.patch("module.B"):
            with mock.patch("module.C"):
                # 测试与真实代码几乎无关
                pass

# 好的做法 - 适当Mock
def test_with_appropriate_mocks():
    with mock.patch("module.external_api") as mock_api:
        mock_api.return_value = expected_result
        result = my_function()
        assert result == expected
```

## 反模式识别清单

```markdown
## 测试反模式识别清单

### 代码质量
- [ ] 测试是否依赖实现细节？
- [ ] 是否有重复的测试代码？
- [ ] 测试命名是否清晰？

### 性能
- [ ] 测试是否运行缓慢？
- [ ] 是否有不必要的外部依赖？
- [ ] 是否使用了适当的Mock？

### 可靠性
- [ ] 测试是否相互依赖？
- [ ] 测试是否不稳定（flaky）？
- [ ] 是否有足够的断言？

### 可维护性
- [ ] 测试是否难以理解？
- [ ] 是否有魔法数字？
- [ ] 测试是否过于复杂？
```

## 最佳实践

### 1. 测试行为而非实现
关注输出而非内部流程。

### 2. 保持测试独立
每个测试应该可以独立运行。

### 3. 使用参数化测试
减少重复代码。

### 4. 适当使用Mock
只Mock外部依赖。

### 5. 保持测试快速
确保测试套件可以快速运行。

## 总结

识别和避免测试反模式可以：
- 提高测试质量
- 减少维护成本
- 增强测试可靠性

通过遵循测试最佳实践，可以创建更有效的测试套件。