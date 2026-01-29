# Exec0 API Architecture

A secure, scalable code execution API designed for developers and AI agents.

## Core Concept

Exec0 provides a REST API that accepts code snippets in multiple programming languages and returns execution results. The API is designed to be simple, secure, and production-ready.

## API Endpoints

### Code Execution

```http
POST /api/v1/execute
```

Execute code in supported programming languages.

**Request:**
```json
{
  "language": "javascript" | "typescript" | "go",
  "code": "console.log('Hello, World!');",
  "stdin": "optional input data",
  "timeout": 30,
  "memoryLimit": 256,
  "files": [
    {
      "name": "utils.js", 
      "content": "export const helper = () => 'help';"
    }
  ]
}
```

**Response:**
```json
{
  "id": "exec_abc123",
  "status": "completed" | "running" | "timeout" | "error",
  "result": {
    "stdout": "Hello, World!\n",
    "stderr": "",
    "exitCode": 0,
    "compilationOutput": ""
  },
  "executionTime": 245,
  "memoryUsed": 8192,
  "createdAt": "2026-01-28T10:30:00Z",
  "language": "javascript"
}
```

### Execution Management

```http
GET /api/v1/executions/{id}    # Get specific execution result
GET /api/v1/executions         # List execution history (paginated)
```

### System Information

```http
GET /api/v1/languages          # List supported languages and their capabilities
GET /api/v1/health             # API health check
```

### Usage & Limits

```http
GET /api/v1/usage              # Current usage statistics
GET /api/v1/limits             # Current account limits
```

### API Key Management

```http
GET    /api/v1/keys            # List API keys
POST   /api/v1/keys            # Create new API key
PATCH  /api/v1/keys/{id}       # Update key (permissions, name)
DELETE /api/v1/keys/{id}       # Revoke API key
```

## API Key Permissions

API keys support granular permissions similar to Resend:

- **`full_access`**: Complete access to all API endpoints including key management
- **`execute_only`**: Can only execute code and view execution results
- **`read_only`**: Can only read execution history and usage data

**Example API Key Creation:**
```json
{
  "name": "Production API Key",
  "permissions": ["full_access"],
  "expiresAt": "2027-01-28T00:00:00Z"
}
```

## Supported Languages

| Language   | Version      | Execution Model | Compilation |
|------------|--------------|-----------------|-------------|
| JavaScript | Node.js 18.x | Interpreted     | No          |
| TypeScript | 5.3.x        | Transpiled      | Yes         |
| Go         | 1.21.x       | Compiled        | Yes         |

## Resource Limits

### Execution Limits
- **Timeout**: 5-300 seconds (configurable)
- **Memory**: 64MB-2GB (configurable) 
- **Output Size**: Max 64KB
- **File Size**: Max 10MB per file
- **Concurrency**: 1-20 simultaneous executions

### Rate Limits
- **Execution Rate**: 100 requests/minute
- **Monthly Quota**: Configurable per organization

## Authentication

All API requests require authentication using Bearer tokens:

```http
Authorization: Bearer exec0_1234567890abcdef
```

## Error Handling

The API uses standard HTTP status codes and returns structured error responses:

```json
{
  "error": "validation_error",
  "message": "Code size exceeds maximum limit", 
  "details": {
    "field": "code",
    "limit": "50KB",
    "received": "75KB"
  }
}
```

### Common Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (insufficient permissions)
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## Security Features

### Code Isolation
- Each execution runs in an isolated AWS Lambda environment
- No persistent file system access
- Network access restricted to execution environment

### Input Validation
- Code size limits enforced
- Timeout boundaries respected
- Memory limits validated
- Malicious code patterns detected

### API Security
- Rate limiting per API key
- Request timeout enforcement
- Input sanitization
- Audit logging for all operations

## Architecture

### High-Level Flow
```
Client Request → API Gateway → Hono Router → Lambda Executor → Response
```

### Components
- **API Layer**: Hono.js with OpenAPI documentation
- **Execution Layer**: AWS Lambda functions per language
- **Storage**: DynamoDB for API keys, PostgreSQL for execution history
- **Authentication**: JWT-based API key system
- **Documentation**: Auto-generated OpenAPI/Scalar interface

### Scalability
- Stateless API design
- Horizontal Lambda scaling
- Database read replicas
- CDN for documentation

## Observability

### Metrics
- Execution count by language
- Average execution time
- Error rate by endpoint
- Resource utilization

### Logging
- Structured JSON logs
- Request/response tracing
- Error stack traces
- Performance metrics

### Monitoring
- Health checks for all services
- Real-time alerting
- Performance dashboards
- Usage analytics

## Integration Examples

### cURL
```bash
curl -X POST https://exec0.run/api/v1/execute \
  -H "Authorization: Bearer exec0_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "javascript",
    "code": "console.log(\"Hello, World!\");"
  }'
```

### JavaScript/TypeScript
```javascript
const response = await fetch('https://exec0.run/api/v1/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer exec0_abc123',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    language: 'javascript',
    code: 'console.log("Hello, World!");'
  })
});

const result = await response.json();
```

### Python
```python
import requests

response = requests.post(
    'https://exec0.run/api/v1/execute',
    headers={'Authorization': 'Bearer exec0_abc123'},
    json={
        'language': 'javascript',
        'code': 'console.log("Hello, World!");'
    }
)

result = response.json()
```

## API Versioning

- Current version: `v1`
- Versioning strategy: URL path (`/api/v1/`)
- Backward compatibility maintained within major versions
- Deprecation notices provided 6 months before breaking changes

---

*For interactive API documentation, visit `/scalar` endpoint when the API is running.*