# API Documentation

## Base URL

`/api/v1`

---

## Authentication

### Signup
- **Endpoint:** `POST /api/v1/auth/signup`
- **Sample Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Sample Response:**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "role": "PATIENT",
    "account_status": "ACTIVE",
    "created_at": "2026-01-10T12:00:00.000Z",
    "updated_at": "2026-01-10T12:00:00.000Z"
  }
}
```

### Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Sample Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Sample Response:**
```json
{
  "status": "success",
  "message": "User logged in successfully",
  "token": "<JWT_TOKEN>",
  "data": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "role": "PATIENT",
    "account_status": "ACTIVE",
    "created_at": "2026-01-10T12:00:00.000Z",
    "updated_at": "2026-01-10T12:00:00.000Z"
  }
}
```

---

## Admin User Management (Requires Admin JWT)

### Create User
- **Endpoint:** `POST /api/v1/admin/users/create-user`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Sample Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "phoneNumber": "0987654321",
  "role": "ADMIN",
  "password": "adminpass",
  "confirmedPassword": "adminpass",
  "account_status": "ACTIVE"
}
```
- **Sample Response:**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "0987654321",
    "role": "ADMIN",
    "account_status": "ACTIVE",
    "created_at": "2026-01-10T12:00:00.000Z",
    "updated_at": "2026-01-10T12:00:00.000Z"
  }
}
```

### Get All Users
- **Endpoint:** `GET /api/v1/admin/users/get-all-users`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Sample Response:**
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "uuid1",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "phoneNumber": "0987654321",
      "role": "ADMIN",
      "account_status": "ACTIVE",
      "created_at": "2026-01-10T12:00:00.000Z",
      "updated_at": "2026-01-10T12:00:00.000Z"
    },
    {
      "id": "uuid2",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "1234567890",
      "role": "PATIENT",
      "account_status": "ACTIVE",
      "created_at": "2026-01-10T12:00:00.000Z",
      "updated_at": "2026-01-10T12:00:00.000Z"
    }
  ]
}
```

### Update User by Email
- **Endpoint:** `PATCH /api/v1/admin/users/update-user-by-email/:email`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Sample Request Body:**
```json
{
  "first_name": "Janet",
  "last_name": "Smith",
  "phoneNumber": "1112223333",
  "role": "EDITOR",
  "account_status": "ACTIVE"
}
```
- **Sample Response:**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "first_name": "Janet",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "1112223333",
    "role": "EDITOR",
    "account_status": "ACTIVE",
    "created_at": "2026-01-10T12:00:00.000Z",
    "updated_at": "2026-01-10T12:00:00.000Z"
  }
}
```

### Update User by ID
- **Endpoint:** `PATCH /api/v1/admin/users/update-user-by-id/:id`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Sample Request Body:**
```json
{
  "first_name": "Janet",
  "last_name": "Smith",
  "email": "janet.smith@example.com",
  "phoneNumber": "1112223333",
  "role": "EDITOR",
  "account_status": "ACTIVE"
}
```
- **Sample Response:**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "first_name": "Janet",
    "last_name": "Smith",
    "email": "janet.smith@example.com",
    "phoneNumber": "1112223333",
    "role": "EDITOR",
    "account_status": "ACTIVE",
    "created_at": "2026-01-10T12:00:00.000Z",
    "updated_at": "2026-01-10T12:00:00.000Z"
  }
}
```

### Delete User by ID
- **Endpoint:** `DELETE /api/v1/admin/users/delete-user-by-id/:id`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Sample Response:**
```json
{
  "status": "success",
  "message": "User deleted successfully",
  "data": {
    "id": "uuid",
    "first_name": "Janet",
    "last_name": "Smith",
    "email": "janet.smith@example.com",
    "phoneNumber": "1112223333",
    "role": "EDITOR",
    "account_status": "ACTIVE",
    "created_at": "2026-01-10T12:00:00.000Z",
    "updated_at": "2026-01-10T12:00:00.000Z"
  }
}
```

---

## Error Handling
- All error responses follow this format:
```json
{
  "status": "error",
  "message": "Error message here",
  "statusCode": 400
}
```

---

## Notes
- All endpoints return JSON.
- Admin routes require a valid JWT token with `role: ADMIN`.
- Passwords are never returned in responses.
- For more details, see the backend repository or contact the backend team.
