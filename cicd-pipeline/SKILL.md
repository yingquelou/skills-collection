---
name: cicd-pipeline
description: Use when setting up or improving continuous integration and continuous deployment pipelines - ensures automated, reliable, and repeatable software delivery
---

# CI/CD Pipeline

## Overview

Continuous Integration (CI) and Continuous Deployment (CD) automate software delivery. Well-designed pipelines catch issues early and deploy reliably.

**Core principle:** Automate everything that can be automated.

**Violating the letter of this process is violating the spirit of CI/CD.**

## When to Use

**Use when:**
- Setting up a new project
- Improving an existing pipeline
- Adding automated testing
- Implementing automated deployment
- Optimizing build times

**Don't use when:**
- Project is too small for automation
- No tests exist (write tests first)

## CI vs CD vs CD

| Term | Definition | Purpose |
|------|------------|---------|
| CI | Continuous Integration | Automate build and test on every commit |
| CD | Continuous Delivery | Automate deployment to staging |
| CD | Continuous Deployment | Automate deployment to production |

## Pipeline Components

### 1. Source Control

**Trigger on every commit:**

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### 2. Build

**Compile and package the application:**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist/ }
```

### 3. Testing

**Run automated tests:**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test
      - run: npm run lint
```

### 4. Code Quality

**Static analysis and security scanning:**

```yaml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: sonarsource/sonarqube-scan-action@master
        env: { SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }} }
      - uses: snyk/actions/node@master
        env: { SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }} }
```

### 5. Deployment

**Deploy to environments:**

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, quality]
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist }
      - run: ./deploy.sh staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist }
      - run: ./deploy.sh production
```

## GitHub Actions Example

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist/ }

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist }
      - uses: peaceiris/actions-gh-pages@v4
        with: { github_token: ${{ secrets.GITHUB_TOKEN }}, publish_dir: ./dist }
```

## GitLab CI Example

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: node:20
  script:
    - npm ci
    - npm run build
  artifacts:
    paths: [dist/]

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test

deploy_production:
  stage: deploy
  image: alpine
  script:
    - ./deploy.sh
  only: [main]
```

## Jenkins Example

```groovy
pipeline {
  agent any
  
  stages {
    stage('Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }
    
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    
    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        sh './deploy.sh'
      }
    }
  }
}
```

## Environment Management

**Use environments for different stages:**

| Environment | Purpose | Access |
|-------------|---------|--------|
| Development | Local development | Developers |
| Staging | Pre-production testing | QA team |
| Production | Live application | Limited |

**Environment-specific configuration:**

```yaml
# .env.development
DATABASE_URL=postgres://localhost:5432/app_dev

# .env.staging
DATABASE_URL=postgres://staging.example.com:5432/app_staging

# .env.production
DATABASE_URL=postgres://prod.example.com:5432/app_prod
```

## Secrets Management

**Never commit secrets to version control:**

```yaml
# GitHub Actions - Use secrets
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

**Secrets management tools:**
- GitHub Secrets
- GitLab CI/CD Variables
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault

## Pipeline Optimization

**Cache dependencies:**

```yaml
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
```

**Parallelize jobs:**

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node-version }} }
      - run: npm ci
      - run: npm test
```

**Use smaller runners:**

```yaml
runs-on: ubuntu-latest-small
```

## Rollback Strategy

**Prepare for deployment failures:**

```yaml
deploy-production:
  steps:
    - run: ./deploy.sh
    - run: ./health-check.sh || ./rollback.sh
```

**Rollback methods:**
- Revert to previous version
- Use blue-green deployment
- Use canary releases

## Monitoring and Alerting

**Track pipeline health:**

```yaml
- uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#ci-cd'
```

**Alert on failures:**
- Slack notifications
- Email alerts
- PagerDuty integration
- Custom dashboards

### Error Handling and Notifications Example

```yaml
name: CI/CD with Notifications

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      
      # Notify on failure
      - name: Notify failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#ci-cd'
          text: "Build failed on ${{ github.ref }}: ${{ github.sha }}"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  test:
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node-version }} }
      - run: npm ci
      - run: npm test
      
      # Report test coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with: { file: ./coverage/coverage-final.json }
```

## Common Mistakes

**❌ No automated testing:** Manual testing is slow and error-prone
**✅ Fix:** Add automated tests before setting up CI

**❌ Committing secrets:** Security risk
**✅ Fix:** Use secrets management

**❌ No rollback plan:** Deployment failures can take down production
**✅ Fix:** Implement rollback strategy

**❌ Not caching dependencies:** Slow builds
**✅ Fix:** Cache node_modules, build artifacts

**❌ Manual deployment steps:** Human error
**✅ Fix:** Automate everything

## Red Flags

**Never:**
- Deploy without testing
- Commit secrets to version control
- Skip code quality checks
- Ignore pipeline failures
- Deploy directly to production without staging

**Always:**
- Test everything automatically
- Use secrets management
- Cache dependencies
- Monitor pipeline health
- Have a rollback plan

## Quick Reference

| Component | Purpose |
|-----------|---------|
| Source Control | Trigger on commits |
| Build | Compile and package |
| Test | Automated testing |
| Code Quality | Static analysis |
| Deployment | Deploy to environments |
| Secrets | Manage sensitive data |
| Monitoring | Track pipeline health |

## Integration

**Required skills:**
- **superpowers:test-driven-development** - Write tests for CI
- **superpowers:verification-before-completion** - Verify pipeline passes

**Recommended skills:**
- **superpowers:writing-plans** - Plan pipeline design
- **performance-optimization** - Optimize build times
