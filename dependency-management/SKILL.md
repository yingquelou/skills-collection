---
name: dependency-management
description: Use when managing project dependencies - ensures secure, up-to-date, and compatible software dependencies
---

# Dependency Management

## Overview

Dependencies are a double-edged sword. They speed development but introduce security risks and compatibility issues.

**Core principle:** Manage dependencies like inventory - know what you have, keep it current, and remove what you don't need.

**Violating the letter of these guidelines is violating the spirit of dependency management.**

## When to Use

**Use when:**
- Setting up a new project
- Adding a new dependency
- Updating existing dependencies
- Removing unused dependencies
- Security audit

**Don't use when:**
- Project has no external dependencies

## The Process

### Step 1: Identify Dependencies

**List all dependencies:**

```bash
# Node.js
npm list

# Python
pip list

# Java
mvn dependency:tree

# Go
go list -m all
```

### Step 2: Choose Dependencies Wisely

**Evaluate before adding:**

| Factor | Consideration |
|--------|--------------|
| Popularity | Is it widely used? |
| Maintenance | Is it actively maintained? |
| Security | Does it have known vulnerabilities? |
| License | Is the license compatible? |
| Size | Does it add unnecessary bloat? |
| Documentation | Is it well documented? |

### Step 3: Pin Versions

**Use exact versions in production:**

```json
// package.json
{
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "4.17.21"
  }
}
```

**Versioning semantics (SemVer):**

| Format | Meaning |
|--------|---------|
| `1.2.3` | Exact version |
| `^1.2.3` | Compatible with minor releases |
| `~1.2.3` | Compatible with patch releases |
| `>=1.2.3` | Greater than or equal |

### Step 4: Update Regularly

**Check for updates:**

```bash
# Node.js
npm outdated
npm update

# Python
pip list --outdated
pip install --upgrade <package>

# Java
mvn versions:display-dependency-updates

# Go
go list -u -m all
```

**Automated updates:**

```yaml
# GitHub Dependabot
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule: { interval: "weekly" }
    commit-message: { prefix: "chore:" }
```

### Step 5: Remove Unused Dependencies

**Clean up:**

```bash
# Node.js
npx depcheck
npm uninstall <package>

# Python
pip-autoremove <package>

# Go
go mod tidy
```

## Security

**Scan for vulnerabilities:**

```bash
# Node.js
npm audit
npm audit fix

# Python
safety check

# Java
mvn sbom:sbom

# GitHub
# Enable Dependabot alerts in repository settings
```

**Fix vulnerabilities:**

```bash
# Fix specific vulnerability
npm audit fix lodash

# Upgrade vulnerable package
npm install lodash@latest
```

### Vulnerability Monitoring and Alerts

**GitHub Dependabot alerts:**

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule: { interval: "weekly" }
    open-pull-requests-limit: 10
    
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule: { interval: "weekly" }
```

**Security advisory configuration:**

```json
// package.json
{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "security:scan": "snyk test"
  }
}
```

**Snyk integration for continuous monitoring:**

```bash
# Install Snyk
npm install -g snyk

# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Monitor continuously
snyk monitor

# Fix vulnerabilities
snyk wizard
```

**CI/CD security gate:**

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - name: Snyk scan
        uses: snyk/actions/node@master
        env: { SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }} }
        with:
          args: --fail-on=high
```

## License Compliance

**Check license compatibility:**

```bash
# Node.js
npx license-checker

# Python
pip-licenses
```

**License types:**

| License | Restrictions |
|---------|--------------|
| MIT | Minimal restrictions |
| Apache 2.0 | Patent grant |
| BSD | Minimal restrictions |
| GPL | Copyleft - requires open source |
| LGPL | Lesser copyleft |

## Dependency Locking

**Use lock files for reproducible builds:**

```json
// package-lock.json or yarn.lock
{
  "name": "my-project",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": { ... }
}
```

**Commit lock files to version control:**

```bash
# .gitignore - DON'T ignore lock files
# package-lock.json  # ❌
# yarn.lock          # ❌
```

## Common Mistakes

**❌ Adding unnecessary dependencies:** Bloat and security risks
**✅ Fix:** Evaluate before adding

**❌ Not updating dependencies:** Security vulnerabilities
**✅ Fix:** Update regularly with Dependabot

**❌ Ignoring security warnings:** Security breaches
**✅ Fix:** Run `npm audit` and fix issues

**❌ Using wildcard versions:** Unpredictable builds
**✅ Fix:** Use SemVer with care

**❌ Not committing lock files:** Non-reproducible builds
**✅ Fix:** Commit lock files

## Red Flags

**Never:**
- Add dependencies without evaluation
- Ignore security vulnerabilities
- Use `*` for versioning
- Delete lock files
- Use deprecated packages

**Always:**
- Evaluate dependencies before adding
- Update dependencies regularly
- Scan for vulnerabilities
- Use lock files
- Remove unused dependencies

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm list` | List dependencies |
| `npm outdated` | Check for updates |
| `npm update` | Update dependencies |
| `npm audit` | Scan for vulnerabilities |
| `npm uninstall` | Remove dependency |
| `npx depcheck` | Find unused dependencies |

## Integration

**Required skills:**
- **cicd-pipeline** - Add security scanning to CI
- **superpowers:verification-before-completion** - Verify dependencies are secure

**Recommended skills:**
- **superpowers:writing-plans** - Plan dependency updates
- **superpowers:requesting-code-review** - Review dependency changes
