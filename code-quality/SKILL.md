---
name: code-quality
description: Use when ensuring code meets high standards of readability, maintainability, and correctness - includes linting, formatting, static analysis, and code reviews
---

# Code Quality

## Overview

High-quality code is easy to read, maintain, and debug. Poor quality code leads to bugs, slow development, and technical debt.

**Core principle:** Quality is not an afterthought - it's built in from the start.

**Violating the letter of these guidelines is violating the spirit of code quality.**

## When to Use

**Use when:**
- Writing new code
- Reviewing existing code
- Setting up project standards
- Refactoring code
- Onboarding new team members

**Don't use when:**
- No coding standards exist (establish them first)

## Code Quality Dimensions

| Dimension | Description |
|-----------|-------------|
| Readability | Code is easy to understand |
| Maintainability | Code is easy to modify |
| Correctness | Code works as expected |
| Performance | Code is efficient |
| Security | Code is free of vulnerabilities |
| Testability | Code is easy to test |

## Linting and Formatting

**Configure linters and formatters:**

```json
// .eslintrc.json
{
  "extends": ["eslint:recommended", "prettier"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "semi": ["error", "always"]
  }
}

// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2
}
```

**Auto-format on save:**

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Code Style Guidelines

**Naming conventions:**

```typescript
// Classes - PascalCase
class UserService { ... }

// Functions - camelCase
function getUserById(id: string): User { ... }

// Variables - camelCase
const userId: string = '123';

// Constants - UPPER_CASE
const MAX_RETRIES = 3;

// Interfaces - PascalCase with I prefix (optional)
interface User { ... }
interface IUserService { ... }

// Private members - _ prefix
class User {
  private _name: string;
}
```

**Formatting:**

```typescript
// Bad
const result=calculate( x,y );

// Good
const result = calculate(x, y);

// Bad
if(condition){doSomething();}

// Good
if (condition) {
  doSomething();
}
```

**Line length:**

```typescript
// Bad - Too long
const result = someFunctionThatTakesManyParameters(param1, param2, param3, param4, param5, param6);

// Good
const result = someFunctionThatTakesManyParameters(
  param1,
  param2,
  param3,
  param4,
  param5,
  param6
);
```

## Static Analysis

**Use static analysis tools:**

```bash
# TypeScript
npx tsc --noEmit

# Python
mypy myproject/

# Java
mvn checkstyle:check

# Go
go vet ./...
```

**SonarQube for comprehensive analysis:**

```yaml
- uses: sonarsource/sonarqube-scan-action@master
  env: { SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }} }
```

## Accessibility (a11y) Checks

**Use axe-core for accessibility testing:**

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Common accessibility issues:**

| Issue | Description | Fix |
|-------|-------------|-----|
| Missing alt text | Images without alt attribute | Add `alt="description"` |
| Missing label | Form elements without labels | Use `<label>` or `aria-label` |
| Color contrast | Low contrast between text and background | Use contrast ratio > 4.5:1 |
| Keyboard navigation | Elements not reachable via keyboard | Ensure focusable elements |
| ARIA misuse | Incorrect ARIA attributes | Follow ARIA best practices |

**Lighthouse accessibility audit:**

```bash
npx lighthouse https://example.com --view
```

**WCAG 2.1 guidelines:**
- Perceivable: Information and user interface components must be presentable to users in ways they can perceive
- Operable: User interface components and navigation must be operable
- Understandable: Information and the operation of user interface must be understandable
- Robust: Content must be robust enough to be interpreted by a wide variety of user agents

## Code Reviews

**Review checklist:**

| Item | Check |
|------|-------|
| ✅ | Code follows style guidelines |
| ✅ | No unused variables/imports |
| ✅ | Proper error handling |
| ✅ | Tests exist and pass |
| ✅ | Documentation is present |
| ✅ | Security concerns addressed |
| ✅ | Performance is acceptable |

**Review comments:**

```
❌ Bad: "This is wrong"

✅ Good: "This variable is unused. Please remove it or use it."

✅ Good: "Consider extracting this logic into a separate function for readability."
```

## Documentation

**Document code:**

```typescript
/**
 * Gets a user by their ID.
 * @param id - The user's unique identifier
 * @returns A Promise resolving to the user or null
 * @throws If the user is not found
 */
async function getUserById(id: string): Promise<User | null> {
  const user = await db.users.findOne({ id });
  if (!user) throw new Error(`User ${id} not found`);
  return user;
}
```

**README guidelines:**

```markdown
# Project Name

## Description
Brief description of the project.

## Installation
```bash
npm install
```

## Usage
```typescript
import { UserService } from './user-service';
const service = new UserService();
```

## API
### getUserById(id: string)
Gets a user by ID.
```

## Testing

**Write comprehensive tests:**

```typescript
describe('UserService', () => {
  it('should get a user by ID', async () => {
    const service = new UserService();
    const user = await service.getUserById('123');
    
    expect(user).toBeDefined();
    expect(user?.id).toBe('123');
  });
  
  it('should throw error if user not found', async () => {
    const service = new UserService();
    
    await expect(service.getUserById('nonexistent')).rejects.toThrow();
  });
});
```

**Test coverage:**

```bash
npm test -- --coverage

# Target coverage:
# Statements: > 80%
# Branches: > 70%
# Functions: > 80%
# Lines: > 80%
```

## Error Handling

**Handle errors properly:**

```typescript
// Bad
try {
  await fetchData();
} catch (e) {
  // Silent failure
}

// Good
try {
  await fetchData();
} catch (error) {
  console.error('Failed to fetch data:', error);
  throw new Error('Data fetch failed');
}
```

**Use custom error types:**

```typescript
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

throw new NotFoundError(`User ${id} not found`);
```

## Common Mistakes

**❌ No linting:** Inconsistent code style
**✅ Fix:** Configure ESLint/Prettier

**❌ Magic numbers:** Hard to understand
**✅ Fix:** Use named constants

**❌ Lack of documentation:** Code is hard to understand
**✅ Fix:** Document functions and classes

**❌ Poor error handling:** Silent failures
**✅ Fix:** Handle and log errors properly

**❌ Duplicate code:** Hard to maintain
**✅ Fix:** Extract reusable functions

## Red Flags

**Never:**
- Ignore linting errors
- Commit commented-out code
- Use magic numbers
- Handle errors silently
- Skip code reviews

**Always:**
- Run linter before committing
- Remove unused code
- Use meaningful names
- Handle errors properly
- Review code before merging

## Quick Reference

| Tool | Purpose |
|------|---------|
| ESLint | JavaScript/TypeScript linting |
| Prettier | Code formatting |
| TSC | TypeScript type checking |
| SonarQube | Static analysis |
| Jest | Testing |
| Codecov | Test coverage |

## Integration

**Required skills:**
- **superpowers:test-driven-development** - Write tests for quality
- **superpowers:requesting-code-review** - Review code quality
- **cicd-pipeline** - Add quality checks to CI

**Recommended skills:**
- **refactoring** - Improve code quality
- **superpowers:verification-before-completion** - Verify quality standards
