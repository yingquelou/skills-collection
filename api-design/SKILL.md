---
name: api-design
description: Use when designing or reviewing RESTful, GraphQL, or gRPC APIs - ensures consistent, scalable, and developer-friendly interfaces
---

# API Design

## Overview

Well-designed APIs are easy to use, understand, and maintain. Poorly designed APIs confuse developers and lead to bugs.

**Core principle:** Design for the consumer, not the implementation.

**Violating the letter of these guidelines is violating the spirit of good API design.**

## When to Use

**Use when:**
- Creating a new API
- Refactoring an existing API
- Reviewing API design
- Documenting APIs
- Building SDKs or clients

**Don't use when:**
- API is already stable and widely used (breaking changes require versioning)
- No clear requirements (define use cases first)

## REST API Design Principles

### Resource Naming

**Use nouns for resources, verbs for actions:**

```
❌ BAD: /getUsers, /createUser, /deleteUser
✅ GOOD: /users, /users/{id}
```

**Use plural nouns:**

```
❌ BAD: /user/1, /product/123
✅ GOOD: /users/1, /products/123
```

**Nested resources for relationships:**

```
✅ /users/1/orders          # Orders for user 1
✅ /users/1/orders/5        # Order 5 for user 1
✅ /products/123/reviews    # Reviews for product 123
```

### HTTP Methods

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create resources | No |
| PUT | Replace resources | Yes |
| PATCH | Partial update | No |
| DELETE | Delete resources | Yes |

### Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 204 | No Content | Success with no body |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing authentication |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict |
| 500 | Internal Server Error | Server-side error |

### Request/Response Format

**Use JSON for REST APIs:**

```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}

// Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Error Handling

**Consistent error format:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ]
  }
}
```

### Pagination

**Use cursor-based pagination for large datasets:**

```
GET /users?page=1&limit=20
GET /users?cursor=abc123&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "next": "def456",
    "prev": null,
    "total": 100
  }
}
```

### Filtering and Sorting

```
GET /users?status=active
GET /users?sortBy=createdAt&sortOrder=desc
GET /users?name=John&status=active
```

## GraphQL Design Principles

### Schema Design

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  items: [OrderItem!]!
  total: Float!
}

type Query {
  user(id: ID!): User
  users(status: String): [User!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}

input CreateUserInput {
  name: String!
  email: String!
}
```

### Resolver Implementation Example

```javascript
// Resolvers
const resolvers = {
  Query: {
    user: (_, { id }, { dataSources }) => 
      dataSources.users.getUserById(id),
    users: (_, { status }, { dataSources }) => 
      dataSources.users.getUsers(status),
  },
  Mutation: {
    createUser: (_, { input }, { dataSources }) => 
      dataSources.users.createUser(input),
  },
  User: {
    orders: (user, _, { dataSources }) => 
      dataSources.orders.getOrdersByUserId(user.id),
  },
};
```

### Query Example

```graphql
# Query with nested data
query GetUserWithOrders($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    orders {
      id
      total
    }
  }
}

# Variables
{
  "userId": "123"
}
```

### Best Practices

- Use input types for mutations
- Use enums for fixed values
- Use interfaces for shared fields
- Version using schema directives or URL
- Implement dataloaders to prevent N+1 queries

## API Versioning

**Option 1: URL Versioning**

```
/v1/users
/v2/users
```

**Option 2: Header Versioning**

```
Accept: application/vnd.example.v1+json
```

**Option 3: Query Parameter**

```
/users?version=1
```

**Recommendation:** URL versioning is most developer-friendly.

## API Security

**Authentication:**
- Use OAuth 2.0 for APIs
- Use JWT for stateless authentication
- Use API keys for server-to-server

**Authorization:**
- Implement role-based access control (RBAC)
- Validate permissions for each resource
- Use scopes for fine-grained access

**Data Protection:**
- Use HTTPS for all APIs
- Validate and sanitize all inputs
- Implement rate limiting
- Mask sensitive data in responses

## API Documentation

**Use OpenAPI/Swagger:**

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Successful response
```

**Documentation should include:**
- Endpoint descriptions
- Request/response examples
- Authentication requirements
- Error codes
- Rate limits

## Common Mistakes

**❌ Using verbs in URLs:** `/getUsers` instead of `/users`
**✅ Fix:** Use nouns for resources

**❌ Inconsistent naming:** `/Users`, `/user`, `/customers`
**✅ Fix:** Consistent plural nouns

**❌ Missing versioning:** No way to evolve API
**✅ Fix:** Implement versioning from day one

**❌ Overly verbose responses:** Returning unnecessary data
**✅ Fix:** Allow clients to request specific fields

**❌ Poor error handling:** Generic error messages
**✅ Fix:** Provide detailed, consistent error responses

## Red Flags

**Never:**
- Change API behavior without versioning
- Return sensitive data in responses
- Ignore authentication/authorization
- Use ambiguous status codes
- Skip API documentation

**Always:**
- Design for the consumer
- Use consistent naming conventions
- Version APIs properly
- Document thoroughly
- Test with real clients

## Quick Reference

| Principle | Description |
|-----------|-------------|
| Nouns, not verbs | Resources are nouns |
| Plural nouns | `/users` not `/user` |
| Consistent naming | Same patterns throughout |
| HTTP methods | GET/POST/PUT/PATCH/DELETE appropriately |
| Status codes | Use standard HTTP status codes |
| Error format | Consistent error structure |
| Pagination | Handle large datasets |
| Versioning | Plan for future changes |
| Security | Authentication and authorization |
| Documentation | Keep it up to date |

## Integration

**Required skills:**
- **superpowers:writing-plans** - Plan API design before implementation
- **superpowers:test-driven-development** - Write API tests first

**Recommended skills:**
- **superpowers:requesting-code-review** - Review API design
- **database-design** - Design data models alongside APIs
