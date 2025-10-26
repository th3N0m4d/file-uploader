# CORS Troubleshooting Guide

## Problem Summary

The file uploader application was experiencing CORS (Cross-Origin Resource Sharing) errors in production but worked fine locally. This guide documents the investigation process and solution.

## Symptoms

- ✅ **Local development**: API calls worked perfectly
- ❌ **Production**: CORS errors when fetching files from `https://file-uploader-teal-eight.vercel.app`
- ❌ **Browser error**: `Access to fetch at 'https://hw8hqfytqi.execute-api.eu-central-1.amazonaws.com/prod/files?userId=user123' from origin 'https://file-uploader-teal-eight.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- ✅ **OPTIONS requests**: Working correctly (returned proper CORS headers)
- ❌ **GET requests**: Missing CORS headers in response

## Why It Worked Locally

The Vite development server includes a proxy configuration in `vite.config.ts`:

```typescript
server: {
  proxy: {
    "/api": {
      target: "https://hw8hqfytqi.execute-api.eu-central-1.amazonaws.com/prod",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
}
```

This proxy bypasses CORS because:

- Requests go to the same origin (localhost)
- The development server forwards them to the API
- Browsers don't enforce CORS for same-origin requests

## Investigation Process

### 1. Testing OPTIONS Request (Preflight)

```bash
curl -X OPTIONS \
  -H "Origin: https://file-uploader-teal-eight.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -v \
  "https://hw8hqfytqi.execute-api.eu-central-1.amazonaws.com/prod/files"
```

**Result**: ✅ **Working** - Returned correct CORS headers:

```
< access-control-allow-origin: https://file-uploader-teal-eight.vercel.app
< access-control-allow-headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
< access-control-allow-methods: DELETE,GET,OPTIONS,POST
```

### 2. Testing GET Request

```bash
curl -X GET \
  -H "Origin: https://file-uploader-teal-eight.vercel.app" \
  -I \
  "https://hw8hqfytqi.execute-api.eu-central-1.amazonaws.com/prod/files?userId=user123"
```

**Result**: ❌ **Missing CORS headers**:

```
HTTP/2 200
date: Sun, 26 Oct 2025 10:54:48 GMT
content-type: application/json
content-length: 5535
x-amzn-requestid: f52a5199-08eb-4759-9272-f3af6acc4eac
x-amz-apigw-id: TDSe1FtDliAEGRg=
x-amzn-trace-id: Root=1-68fdfdf8-6fc754a85df5f20f03fc92ce;Parent=50140be95b02f1d4;Sampled=0;Lineage=1:40d582df:0
```

**Missing**: `access-control-allow-origin` header

### 3. Key Discovery: Proxy Integration

When attempting to configure CORS in API Gateway console, encountered:

> "Proxy integration: Proxy integrations cannot be configured to transform responses."

**This revealed the root cause**: Lambda Proxy Integration means:

- API Gateway passes requests directly to Lambda
- **Lambda must return ALL headers**, including CORS headers
- API Gateway cannot modify responses

## Root Cause

The Lambda function was only returning the response body without CORS headers:

```python
# ❌ Original (missing CORS headers)
return {
    'statusCode': 200,
    'body': json.dumps({'files': files})
}
```

## Solution

Updated the Lambda function to include CORS headers in **every response**:

```python
# ✅ Fixed (includes CORS headers)
return {
    'statusCode': 200,
    'headers': {
        'Access-Control-Allow-Origin': 'https://file-uploader-teal-eight.vercel.app',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
        'Content-Type': 'application/json'
    },
    'body': json.dumps({'files': files})
}
```

## Complete Lambda CORS Implementation

For Lambda Proxy Integration, **all endpoints and error responses** need CORS headers:

```python
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # CORS headers for all responses
    cors_headers = {
        'Access-Control-Allow-Origin': 'https://file-uploader-teal-eight.vercel.app',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
        'Content-Type': 'application/json'
    }

    try:
        # Handle OPTIONS preflight request
        if event['httpMethod'] == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': ''
            }

        # Handle GET request
        if event['httpMethod'] == 'GET':
            # Your GET logic here
            return {
                'statusCode': 200,
                'headers': cors_headers,  # ← Essential!
                'body': json.dumps({'files': files})
            }

        # Handle POST request
        if event['httpMethod'] == 'POST':
            # Your POST logic here
            return {
                'statusCode': 200,
                'headers': cors_headers,  # ← Essential!
                'body': json.dumps({'message': 'Success'})
            }

        # Handle DELETE request
        if event['httpMethod'] == 'DELETE':
            # Your DELETE logic here
            return {
                'statusCode': 200,
                'headers': cors_headers,  # ← Essential!
                'body': json.dumps({'message': 'Deleted'})
            }

        # Method not allowed
        return {
            'statusCode': 405,
            'headers': cors_headers,  # ← Even for errors!
            'body': json.dumps({'error': 'Method not allowed'})
        }

    except Exception as error:
        logger.error(f"Error: {error}")
        return {
            'statusCode': 500,
            'headers': cors_headers,  # ← Even for errors!
            'body': json.dumps({'error': 'Internal server error'})
        }
```

## Verification

After updating the Lambda function:

```bash
curl -I -H "Origin: https://file-uploader-teal-eight.vercel.app" \
"https://hw8hqfytqi.execute-api.eu-central-1.amazonaws.com/prod/files?userId=user123"
```

**Result**: ✅ **Fixed** - Now includes CORS header:

```
HTTP/2 200
access-control-allow-origin: https://file-uploader-teal-eight.vercel.app
content-type: application/json
```

## Key Lessons Learned

1. **Local vs Production**: Development proxies can mask CORS issues
2. **CORS Headers Required**: Browsers need `Access-Control-Allow-Origin` in actual responses, not just OPTIONS
3. **Proxy Integration**: Lambda Proxy Integration requires Lambda to handle ALL headers
4. **All Responses**: CORS headers needed in success AND error responses
5. **Testing**: Use curl with `-I` flag to verify headers without getting full response body

## Environment Configuration

For better environment management, the frontend now uses different endpoints:

```typescript
const endpoint = import.meta.env.DEV
  ? "/api/files" // Use proxy in development
  : "https://hw8hqfytqi.execute-api.eu-central-1.amazonaws.com/prod/files"; // Direct API in production
```

## Common CORS Troubleshooting Commands

```bash
# Test OPTIONS preflight
curl -X OPTIONS -H "Origin: https://your-domain.com" -v "https://api-url"

# Test actual request headers
curl -I -H "Origin: https://your-domain.com" "https://api-url"

# Filter for CORS headers only
curl -v "https://api-url" 2>&1 | grep -i "access-control"

# Test from browser console
fetch('https://api-url', {
  headers: { 'Content-Type': 'application/json' }
}).then(r => console.log([...r.headers.entries()]))
```

---

**Status**: ✅ **Resolved** - CORS errors eliminated by adding proper headers to Lambda responses.
