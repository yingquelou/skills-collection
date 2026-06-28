---
name: performance-optimization
description: Use when improving application speed, responsiveness, or resource usage - ensures data-driven, measurable performance improvements
---

# Performance Optimization

## Overview

Optimize based on measurements, not assumptions. Poorly optimized code wastes resources and frustrates users.

**Core principle:** Measure first, optimize second. Only optimize what matters.

**Violating the letter of this process is violating the spirit of optimization.**

## When to Use

**Use when:**
- Application is slow or unresponsive
- Page load time exceeds 3 seconds
- API response time is too slow
- Memory usage is excessive
- Users complain about performance
- Metrics indicate bottlenecks

**Don't use when:**
- No measurements exist (measure first)
- Premature optimization (optimize only when needed)
- You guess where the bottleneck is (profile first)

## The Iron Law

```
NO OPTIMIZATION WITHOUT MEASUREMENT FIRST
```

If you haven't measured, you don't know what to optimize.

## The Process

### Step 1: Measure and Profile

**Identify bottlenecks before making changes.**

#### Frontend Profiling

```bash
# Lighthouse for web performance
npx lighthouse https://example.com --view

# Chrome DevTools
# Open: F12 -> Performance tab -> Record
```

#### Backend Profiling

```bash
# Node.js
node --inspect app.js
# Chrome: chrome://inspect

# Python
python -m cProfile -s cumulative script.py

# Go
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
```

#### Database Profiling

```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- MySQL
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

### Step 2: Set Performance Goals

Define measurable targets:

| Metric | Target |
|--------|--------|
| Page load time | < 3 seconds |
| API response time | < 200ms |
| First Contentful Paint | < 1.5 seconds |
| Time to Interactive | < 3.8 seconds |
| Memory usage | < 500MB |
| CPU usage | < 70% under load |

### Step 3: Apply Optimization Patterns

#### Frontend Optimizations

**Code Splitting:**
```typescript
// Before
import { HeavyComponent } from './HeavyComponent';

// After - Lazy load
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

**Image Optimization:**
```html
<!-- Before -->
<img src="image.jpg">

<!-- After -->
<img src="image.webp" alt="..." loading="lazy">
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="..." loading="lazy">
</picture>
```

**Caching:**
```typescript
// Service Worker caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
```

#### Backend Optimizations

**Database Indexing:**
```sql
-- Before - Full table scan
SELECT * FROM users WHERE email = 'test@example.com';

-- After - Add index
CREATE INDEX idx_users_email ON users(email);
```

**Query Optimization:**
```sql
-- Before - N+1 queries
SELECT * FROM posts;
-- For each post: SELECT * FROM comments WHERE post_id = ?

-- After - JOIN query
SELECT p.*, c.* 
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.id = 1;
```

**Caching:**
```typescript
const cache = new Map<string, any>();

async function getData(key: string): Promise<any> {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchFromDatabase(key);
  cache.set(key, data);
  
  return data;
}
```

**Asynchronous Processing:**
```typescript
// Before - Synchronous
function processOrders(orders: Order[]) {
  for (const order of orders) {
    sendEmail(order); // Blocks
  }
}

// After - Asynchronous
async function processOrders(orders: Order[]) {
  await Promise.all(orders.map(order => sendEmail(order)));
}
```

#### Algorithm Optimizations

**Time Complexity Improvement:**
```typescript
// Before - O(n²)
function findDuplicates(arr: number[]): number[] {
  const duplicates: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) duplicates.push(arr[i]);
    }
  }
  return duplicates;
}

// After - O(n)
function findDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  for (const num of arr) {
    if (seen.has(num)) duplicates.add(num);
    seen.add(num);
  }
  return Array.from(duplicates);
}
```

### Step 4: Measure After Optimization

**Critical Rule:** Measure after every optimization to verify it worked.

```bash
# Compare metrics before and after
npx lighthouse https://example.com --view
```

If optimization didn't help:
1. Revert the change
2. Try a different approach
3. Focus on other bottlenecks

### Step 5: Load Testing

**Use k6 for load testing:**

```javascript
// k6 test script (load-test.js)
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 100 },  // Stay at 100 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],  // 95% of requests under 200ms
    http_req_failed: ['rate<0.01'],    // <1% failure rate
  },
};

export default function () {
  const res = http.get('https://api.example.com/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

```bash
# Run load test
k6 run load-test.js

# Generate report
k6 run --out json=results.json load-test.js
k6 report results.json
```

### Step 6: Capacity Planning

**Calculate required resources:**

| Metric | Formula | Example |
|--------|---------|---------|
| Requests per second | (Daily users × Requests per user) / (24 × 3600) | (100000 × 5) / 86400 = 5.8 req/s |
| Peak RPS | Average RPS × Peak factor (3-5) | 5.8 × 5 = 29 req/s |
| Required servers | Peak RPS / Requests per server | 29 / 100 = 1 server |

**Auto-scaling configuration (AWS):**

```yaml
# CloudWatch Auto Scaling policy
TargetTrackingConfiguration:
  PredefinedMetricSpecification:
    PredefinedMetricType: ALBRequestCountPerTarget
  TargetValue: 1000  # 1000 requests per target
  ScaleOutCooldown: 60
  ScaleInCooldown: 300
```

### Step 7: Monitor and Iterate

Set up ongoing monitoring:

```bash
# Prometheus + Grafana for metrics
# New Relic, Datadog, or similar APM tools

# Log performance metrics
console.time('api-request');
await fetchData();
console.timeEnd('api-request');
```

## Common Mistakes

**❌ Premature optimization:** Optimizing before identifying bottlenecks
**✅ Fix:** Measure first, optimize second

**❌ Optimizing the wrong thing:** Focusing on non-critical code
**✅ Fix:** Profile to find real bottlenecks

**❌ Micro-optimization:** Optimizing at the expense of readability
**✅ Fix:** Prioritize readability unless performance is critical

**❌ Ignoring caching:** Not leveraging caching opportunities
**✅ Fix:** Implement appropriate caching strategies

**❌ Not testing under load:** Optimizing without realistic conditions
**✅ Fix:** Use load testing tools (k6, Artillery)

## Red Flags

**Never:**
- Optimize without measuring first
- Sacrifice readability for minor gains
- Ignore caching opportunities
- Deploy optimizations without testing
- Assume you know where the bottleneck is

**Always:**
- Profile before optimizing
- Measure after optimizing
- Prioritize critical paths
- Test under realistic load
- Document performance improvements

## Quick Reference

| Optimization | Area | Impact |
|--------------|------|--------|
| Code Splitting | Frontend | High |
| Image Optimization | Frontend | High |
| Caching | Both | High |
| Database Indexing | Backend | High |
| Query Optimization | Backend | High |
| Algorithm Improvement | Both | High |
| Lazy Loading | Frontend | Medium |
| Compression | Both | Medium |
| CDN | Frontend | Medium |
| Connection Pooling | Backend | Medium |

## Integration

**Required skills:**
- **superpowers:systematic-debugging** - Identify performance issues systematically
- **superpowers:verification-before-completion** - Verify improvements with measurements

**Recommended skills:**
- **superpowers:writing-plans** - Plan large optimization efforts
- **refactoring** - Restructure code for better performance
