---
name: database-design
description: Use when designing or reviewing relational, NoSQL, or hybrid database schemas - ensures scalable, maintainable, and performant data models
---

# Database Design

## Overview

Well-designed databases are scalable, maintainable, and performant. Poorly designed databases lead to data inconsistency, slow queries, and difficult maintenance.

**Core principle:** Design for the data, not the application. Normalize first, denormalize only when needed.

**Violating the letter of these guidelines is violating the spirit of good database design.**

## When to Use

**Use when:**
- Creating a new application
- Designing a new feature that requires data storage
- Refactoring an existing database
- Optimizing database performance
- Migrating between database systems

**Don't use when:**
- Requirements are unclear (define use cases first)
- You're copying someone else's design without understanding

## The Process

### Step 1: Requirements Gathering

**Identify entities and relationships:**

1. List all business entities (User, Order, Product)
2. Identify relationships between entities
3. Define data requirements for each entity
4. Determine query patterns

### Step 2: Conceptual Design

**Create entity-relationship (ER) diagram:**

```
User ────< Orders ────> OrderItems ────> Products
  │                              │
  └──────────────────────────────┘
```

### Step 3: Logical Design (Normalization)

**Apply normalization rules:**

**First Normal Form (1NF):**
- Eliminate repeating groups
- Ensure atomic values
- Each column contains unique values

**Second Normal Form (2NF):**
- Remove partial dependencies
- All non-key attributes depend on the entire primary key

**Third Normal Form (3NF):**
- Remove transitive dependencies
- All non-key attributes depend only on the primary key

**Example:**

```sql
-- Before - Violates 3NF (transitive dependency)
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  customer_name VARCHAR(100),  -- Depends on customer_id, not order_id
  total DECIMAL(10,2)
);

-- After - Normalized to 3NF
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  customer_name VARCHAR(100)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  total DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

### Step 4: Physical Design

**Implement the database:**

```sql
-- PostgreSQL example
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Indexing Strategy

**Create indexes for frequently queried columns:**

```sql
-- For WHERE clauses
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- For JOINs
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- For ORDER BY
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Composite indexes for multiple columns
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

**Index guidelines:**
- Index columns used in WHERE, JOIN, ORDER BY
- Avoid over-indexing (slows writes)
- Use composite indexes for combined queries
- Consider partial indexes for large tables

### Index Maintenance

```sql
-- Check index usage (PostgreSQL)
SELECT 
  idx.relname AS index_name,
  idx_scan AS index_scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes idx
JOIN pg_class tbl ON idx.schemaname = tbl.schemaname 
  AND idx.relname = tbl.relname
ORDER BY idx_scan ASC;

-- Rebuild fragmented index
REINDEX INDEX idx_users_email;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_unused_index;
```

### Performance Monitoring

```sql
-- Enable slow query log (MySQL)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Analyze slow queries (PostgreSQL)
SELECT 
  queryid,
  calls,
  total_time,
  mean_time,
  query
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

## Data Types

**Choose appropriate data types:**

| Data Type | Use Case |
|-----------|----------|
| UUID | Primary keys (distributed systems) |
| BIGINT | Auto-incrementing IDs |
| VARCHAR | Variable-length text |
| TEXT | Long text content |
| DATE | Dates without time |
| TIMESTAMP | Dates with time |
| DECIMAL | Financial values |
| BOOLEAN | True/false values |
| JSONB | Semi-structured data (PostgreSQL) |

## Constraints

**Enforce data integrity:**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,  -- Unique constraint
  age INT CHECK (age >= 0),            -- Check constraint
  status VARCHAR(20) NOT NULL DEFAULT 'active'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Foreign key
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0)
);
```

**Common constraints:**
- NOT NULL: Required fields
- UNIQUE: Unique values
- PRIMARY KEY: Unique identifier
- FOREIGN KEY: Referential integrity
- CHECK: Custom validation
- DEFAULT: Default values

## NoSQL Design

**Document databases (MongoDB):**

```javascript
// User document with embedded orders
{
  _id: ObjectId("..."),
  email: "john@example.com",
  name: "John Doe",
  orders: [
    {
      _id: ObjectId("..."),
      items: [...],
      total: 99.99,
      createdAt: ISODate("2024-01-15")
    }
  ]
}
```

**Key-value stores (Redis):**

```
SET user:123 '{"name":"John","email":"john@example.com"}'
GET user:123

ZADD leaderboard 1000 john
ZRANGE leaderboard 0 10 WITHSCORES
```

**NoSQL guidelines:**
- Denormalize for read performance
- Embed related data when accessed together
- Choose the right database for the use case

## Database Migration

**Use version-controlled migrations:**

```sql
-- 001_create_users.sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL
);

-- 002_add_name_to_users.sql
ALTER TABLE users ADD COLUMN name VARCHAR(100);

-- 003_create_orders.sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id)
);
```

**Migration tools:**
- Flyway (Java)
- Liquibase (Multi-language)
- Alembic (Python)
- Prisma (TypeScript)
- Django ORM migrations

## Performance Optimization

**Query optimization:**

```sql
-- Before - Full table scan
SELECT * FROM orders WHERE status = 'completed';

-- After - Indexed
CREATE INDEX idx_orders_status ON orders(status);
SELECT * FROM orders WHERE status = 'completed';
```

**Connection pooling:**

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000
});
```

**Caching strategies:**

```javascript
const cache = require('redis').createClient();

async function getUser(id) {
  const cached = await cache.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  await cache.set(`user:${id}`, JSON.stringify(user));
  
  return user;
}
```

## Security

**Protect sensitive data:**

```sql
-- Encrypt sensitive columns
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL  -- NEVER store plain text
);

-- Row-level security (PostgreSQL)
CREATE POLICY user_access ON users
  FOR SELECT USING (id = current_setting('app.current_user_id')::UUID);
```

**Security guidelines:**
- Never store plain text passwords
- Use parameterized queries (prevent SQL injection)
- Implement row-level security
- Restrict database user permissions
- Audit sensitive operations

## Common Mistakes

**❌ Denormalizing too early:** Leads to data inconsistency
**✅ Fix:** Normalize first, denormalize only when needed

**❌ Missing indexes:** Slow queries on large tables
**✅ Fix:** Index frequently queried columns

**❌ Over-indexing:** Slows write operations
**✅ Fix:** Only index necessary columns

**❌ No foreign keys:** Data integrity issues
**✅ Fix:** Use foreign key constraints

**❌ Storing sensitive data in plain text:** Security risk
**✅ Fix:** Hash passwords, encrypt sensitive data

## Red Flags

**Never:**
- Ignore normalization principles
- Skip index creation
- Store plain text passwords
- Use string concatenation for queries
- Ignore database security

**Always:**
- Normalize to at least 3NF
- Create appropriate indexes
- Use parameterized queries
- Enforce data integrity constraints
- Plan for scaling

## Quick Reference

| Principle | Description |
|-----------|-------------|
| Normalization | Reduce redundancy, improve integrity |
| Indexing | Speed up queries |
| Constraints | Enforce data integrity |
| Data Types | Choose appropriate types |
| Migration | Version-controlled changes |
| Security | Protect sensitive data |
| Caching | Reduce database load |
| Connection Pooling | Efficient resource use |

## Integration

**Required skills:**
- **superpowers:writing-plans** - Plan database design before implementation
- **api-design** - Design APIs alongside data models

**Recommended skills:**
- **performance-optimization** - Optimize database performance
- **superpowers:requesting-code-review** - Review database schemas
