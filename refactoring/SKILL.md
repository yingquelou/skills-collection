---
name: refactoring
description: Use when improving code structure without changing external behavior - ensures safe, testable, and maintainable code transformations
---

# Refactoring

## Overview

Refactoring is the disciplined process of restructuring existing code without changing its external behavior.

**Core principle:** Small, incremental changes with full test coverage = safe refactoring.

**Violating the letter of this process is violating the spirit of refactoring.**

## When to Use

**Use when:**
- Code has duplication
- Code is hard to understand
- Code has poor structure
- Adding new features becomes difficult
- Technical debt accumulates
- Code smells are present

**Don't use when:**
- No tests exist (write tests first)
- Under tight deadline (defer to safer times)
- You don't understand the code (study first)
- Behavior needs to change (that's not refactoring)

## The Iron Law

```
NO REFACTORING WITHOUT FULL TEST COVERAGE FIRST
```

If tests don't cover the code you're changing, write them first.

## The Process

### Step 1: Establish Baseline

1. Run existing tests → Verify all pass
2. Add missing tests for uncovered areas
3. Document current behavior (if unclear)
4. Create backup or commit before changes

### Step 2: Identify Code Smells

Common code smells to look for:

| Smell | Description | Fix |
|-------|-------------|-----|
| Duplication | Same code in multiple places | Extract method/class |
| Long method | Method exceeds 50 lines | Split into smaller methods |
| Large class | Class has too many responsibilities | Split into smaller classes |
| Feature envy | Method uses another class excessively | Move method or extract |
| Data clumps | Same group of data passed together | Create data class |
| Primitive obsession | Overuse of primitive types | Create value objects |
| Long parameter list | Method has >5 parameters | Create parameter object |
| Lazy class | Class does nothing useful | Inline or remove |
| Dead code | Code that's never executed | Remove |
| Comments as crutches | Comments explain bad code | Fix the code |

### Step 3: Apply Refactoring Patterns

#### Method-Level Refactorings

**Extract Method:**
```typescript
// Before
function processOrder(order: Order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Empty order');
  }
  
  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  
  // Apply discount
  if (order.customer.isVIP) {
    total *= 0.9;
  }
  
  return total;
}

// After
function processOrder(order: Order) {
  validateOrder(order);
  const subtotal = calculateSubtotal(order);
  return applyDiscount(subtotal, order.customer);
}

function validateOrder(order: Order) {
  if (!order.items || order.items.length === 0) {
    throw new Error('Empty order');
  }
}

function calculateSubtotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function applyDiscount(subtotal: number, customer: Customer): number {
  return customer.isVIP ? subtotal * 0.9 : subtotal;
}
```

**Inline Method:**
- When method body is clearer than the method name
- When method is only called once

**Rename Method:**
- When method name doesn't describe what it does
- Use clear, descriptive names

#### Class-Level Refactorings

**Extract Class:**
- When a class has multiple responsibilities
- Split into classes with single responsibility

**Move Method:**
- When a method logically belongs to another class
- When a class uses another class excessively

**Inline Class:**
- When a class has few methods and no distinct responsibility

#### Data-Level Refactorings

**Replace Magic Number with Constant:**
```typescript
// Before
if (score > 100) { ... }

// After
const PASSING_SCORE = 100;
if (score > PASSING_SCORE) { ... }
```

**Replace Primitive with Object:**
```typescript
// Before
function createUser(name: string, email: string, age: number) { ... }

// After
interface UserData {
  name: string;
  email: string;
  age: number;
}
function createUser(data: UserData) { ... }
```

### Test-Driven Refactoring Example (Red-Green-Refactor)

**Step 1: Write failing test (RED)**
```typescript
describe('calculateDiscountedPrice', () => {
  it('should apply 10% discount for VIP customers', () => {
    const result = calculateDiscountedPrice(100, true);
    expect(result).toBe(90);
  });
  
  it('should not apply discount for regular customers', () => {
    const result = calculateDiscountedPrice(100, false);
    expect(result).toBe(100);
  });
});
```

**Step 2: Write minimal code to pass (GREEN)**
```typescript
function calculateDiscountedPrice(price: number, isVIP: boolean): number {
  if (isVIP) {
    return price * 0.9;
  }
  return price;
}
```

**Step 3: Refactor (REFACTOR)**
```typescript
const VIP_DISCOUNT_RATE = 0.1;

function calculateDiscountedPrice(price: number, isVIP: boolean): number {
  if (!isVIP) return price;
  return price * (1 - VIP_DISCOUNT_RATE);
}
```

**Step 4: Verify tests still pass**
```bash
npm test  # All tests should pass
```

### Step 4: Run Tests After Each Change

**Critical Rule:** Run tests after EVERY small change.

```bash
# After each refactoring step
npm test
```

If tests fail:
1. Revert the last change
2. Understand why it broke
3. Make a smaller change
4. Try again

### Step 5: Verify Behavior

After refactoring:
1. Run all tests → must pass
2. Manually verify critical paths
3. Check for regressions
4. Commit changes

## Common Mistakes

**❌ Refactoring without tests:** Leads to broken behavior
**✅ Fix:** Write tests first, then refactor

**❌ Big bang refactoring:** Changes too much at once
**✅ Fix:** Small, incremental changes

**❌ Mixing refactoring with feature changes:** Hard to debug
**✅ Fix:** Separate refactoring commits from feature commits

**❌ Ignoring test failures:** Hoping they'll pass later
**✅ Fix:** Stop and fix test failures immediately

**❌ Renaming without search/replace:** Missed references cause bugs
**✅ Fix:** Use IDE refactoring tools or comprehensive search

## Red Flags

**Never:**
- Refactor code without understanding it
- Make changes that affect external behavior
- Skip running tests after changes
- Refactor in production without staging
- Combine refactoring with bug fixes in one commit

**Always:**
- Write tests before refactoring
- Make small, incremental changes
- Run tests after each change
- Commit frequently with descriptive messages
- Document significant structural changes

## Quick Reference

| Refactoring | When to Use | Key Benefit |
|-------------|-------------|-------------|
| Extract Method | Code duplication or long method | Readability |
| Extract Class | Class has multiple responsibilities | Single responsibility |
| Move Method | Method belongs to another class | Better organization |
| Rename | Name doesn't reflect purpose | Clarity |
| Replace Magic Number | Hardcoded values | Maintainability |
| Inline | Method adds unnecessary layer | Simplicity |
| Pull Up | Common code in subclasses | DRY |
| Push Down | Specific code in superclass | Proper hierarchy |

## Integration

**Required skills:**
- **superpowers:test-driven-development** - Write tests before refactoring
- **superpowers:systematic-debugging** - Fix issues found during refactoring
- **superpowers:verification-before-completion** - Verify tests pass before finishing

**Recommended skills:**
- **superpowers:writing-plans** - Plan large refactoring efforts
- **superpowers:requesting-code-review** - Get feedback on refactoring changes
