# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

## Response Format

Success Response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error Response:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

## Authentication Endpoints

### Register User

```
POST /auth/register
```

Request:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "userType": "lender"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    /* user object */
  }
}
```

### Login

```
POST /auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User

```
GET /auth/me
```

Protected: YES

## User Endpoints

### Get User Profile

```
GET /users/:id
```

Response:

```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "avatar": "avatar_url",
    "bio": "User biography",
    "totalLoansGiven": 5,
    "totalMoneyLent": 5000,
    "totalInterestEarned": 250
  }
}
```

### Update Profile

```
PUT /users/:id
```

Protected: YES

Request:

```json
{
  "firstName": "Jane",
  "bio": "Updated bio",
  "preferences": {
    "category": ["Solar Power", "Urban Farming"]
  }
}
```

### Get User Statistics

```
GET /users/:id/stats
```

Response:

```json
{
  "success": true,
  "stats": {
    "totalLoansGiven": 5,
    "totalMoneyLent": 5000,
    "activeLoans": 2,
    "totalInterestEarned": 250,
    "creditScore": 750
  }
}
```

## Project Endpoints

### List Projects

```
GET /projects?category=Solar Power&status=active&page=1&limit=10
```

Query Parameters:

- `category`: Filter by project category
- `status`: Filter by status (draft, active, funded, completed, failed)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response:

```json
{
  "success": true,
  "projects": [
    /* array of projects */
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

### Get Project Details

```
GET /projects/:id
```

Response includes:

- Project details
- Lender information
- Funding progress
- Environmental impact

### Create Project

```
POST /projects
```

Protected: YES

Request:

```json
{
  "title": "Solar Farm Initiative",
  "description": "Building sustainable solar energy",
  "category": "Solar Power",
  "targetAmount": 10000,
  "interestRate": 5,
  "duration": 12,
  "location": {
    "city": "Austin",
    "country": "USA",
    "latitude": 30.2672,
    "longitude": -97.7431
  }
}
```

### Update Project

```
PUT /projects/:id
```

Protected: YES

### Search Projects

```
GET /projects/search/:query
```

Query can search in title, description, and category.

## Loan Endpoints

### Get User's Loans

```
GET /loans?status=active&page=1&limit=10
```

Protected: YES

### Get Loan Details

```
GET /loans/:id
```

Protected: YES

Response includes:

- Loan details
- Repayment schedule
- Cash flow information
- Payment history

### Create Loan

```
POST /loans
```

Protected: YES

Request:

```json
{
  "borrowerId": "borrower_id",
  "projectId": "project_id",
  "principalAmount": 1000,
  "interestRate": 5,
  "duration": 12
}
```

### Record Payment

```
POST /loans/:id/payment
```

Protected: YES

Request:

```json
{
  "amount": 100,
  "type": "both"
}
```

## Notification Endpoints

### Get Notifications

```
GET /notifications?isRead=false&page=1&limit=20
```

Protected: YES

### Mark as Read

```
PUT /notifications/:id/read
```

Protected: YES

### Mark All as Read

```
PUT /notifications/read-all
```

Protected: YES

## Recommendation Endpoints

### Get Recommendations

```
GET /recommendations
```

Protected: YES

### Get Personalized Recommendations

```
GET /recommendations/personalized
```

Protected: YES

Returns projects based on user's loan history and preferences.

## Analytics Endpoints

### Platform Analytics

```
GET /analytics/platform
```

Protected: YES (Admin only)

Returns:

- Total users
- Total loans
- Total projects
- Loan statistics by status

### User Analytics

```
GET /analytics/user
```

Protected: YES

Returns user's personal statistics.

## Blog Endpoints

### Get Blog Posts

```
GET /blogs?page=1&limit=10
```

### Get Blog Details

```
GET /blogs/:id
```

### Create Blog Post

```
POST /blogs
```

Protected: YES

Request:

```json
{
  "title": "Blog Title",
  "content": "Blog content here",
  "excerpt": "Short excerpt",
  "category": "Sustainability",
  "tags": ["eco", "green"]
}
```

## Contact Endpoints

### Send Contact Message

```
POST /contact
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "Message content",
  "category": "support"
}
```

## Error Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 500  | Server Error |

## Rate Limiting

- Default: 100 requests per 15 minutes
- Applies to all endpoints
- Returns 429 if exceeded

## Examples

### Using curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"pass123","userType":"lender"}'

# Get projects
curl http://localhost:5000/api/projects

# Get authenticated user
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me
```

### Using JavaScript/Fetch

```javascript
// Register
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'pass123',
    userType: 'lender',
  }),
});

const data = await response.json();
console.log(data);
```

---

For more details, check individual route files in `backend/src/routes/`
