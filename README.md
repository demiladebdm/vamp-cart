# Vamp Cart System for E-Commerce Platform

## Project Overview
This project implements a mini carting system for an e-commerce platform using **NestJS**. The system ensures:

1. **Product Availability**: Prevents overselling by validating stock levels before reserving products.
2. **Reservation Management**: Automatically releases reserved stock for inactive users after a set time limit.
3. **Authentication & Authorization**: Handles user login, registration, and secure access to cart and product management endpoints.

---

## Features

### Core Functionality
- **Authentication**: User registration and login using JWT tokens.
- **Product Management**: CRUD operations for products.
- **Reservation System**: Reserve products in a user's cart, ensuring availability for other users.

### Advanced
- **Expiration Management**: Automatically releases expired reservations.
- **Role-Based Access**: Ensures only sellers can create and update products.

---

## Prerequisites

- **Node.js** (v16 or above)
- **MongoDB**
- **NestJS CLI**

---

## Installation

Clone the repository and navigate to the project directory:

```bash
$ git clone <https://github.com/demiladebdm/vamp-cart.git>
$ cd vamp-cart
```

Install dependencies:

```bash
$ npm install
```

Set up your environment variables in a `.env` file:

```
MONGO_URI=''
MONGO_URI_TEST=''
SECRET_KEY=''
PORT=3000
```

---

## Running the Application

Run the application in test mode:

```bash
$ npm run start:test
```

Run the application in development mode:

```bash
$ npm run start:dev
```

Run in production mode:

```bash
$ npm run start:prod
```

Access the application at `http://localhost:3000/api`.

---

## API Documentation

### Authentication Endpoints

#### POST `/auth/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Body Parameters**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "user": {  "_id": "string", "username": "string", "seller": true, "created": "string" },
    "token": "JWT-token"
  }
  ```

#### POST `/auth/register`
- **Description**: Registers a new user and returns a JWT token.
- **Body Parameters**:
  ```json
  {
    "username": "string",
    "password": "string",
    "seller": true
  }
  ```
- **Response**:
  ```json
  {
    "user": {  "_id": "string", "username": "string", "seller": false, "created": "string" },
    "token": "JWT-token"
  }
  ```

---

### Product Endpoints

#### GET `/product`
- **Description**: Fetches all products.

#### POST `/product`
- **Description**: Creates a new product (Seller only).
- **Body Parameters**:
  ```json
  {
      "title": "string",
      "image": "n/a",
      "description": "description",
      "price": 100,
      "count": 50
  }
  ```

#### PUT `/product/:id`
- **Description**: Updates a product (Seller only).
- **Body Parameters**:
  ```json
  {
    "title": "string",
    "price": 150
  }
  ```

#### DELETE `/product/:id`
- **Description**: Deletes a product (Seller only).

---

### Reservation Endpoints

#### GET `/reservation`
- **Description**: Lists all reservations for the authenticated user.

#### POST `/reservation`
- **Description**: Reserves products for the authenticated user.
- **Body Parameters**:
  ```json
  {
    "products": [
      { "product": "productId", "quantity": 2 }
    ]
  }
  ```

---

## Project Structure

```
src
├── auth
│   ├── auth.controller.ts
│   ├── auth.dto.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── guards
│   ├── seller.guard.ts
├── models
│   ├── order.schema.ts
│   ├── product.schema.ts
│   ├── user.schema.ts
├── product
│   ├── product.controller.ts
│   ├── product.service.ts
│   ├── product.module.ts
│   └── product.dto.ts
├── reservation
│   ├── reservation.controller.ts
│   ├── reservation.service.ts
│   ├── reservation.module.ts
│   └── reservation.dto.ts
└── shared
     └── user
          └── user.service.ts
     ├── http-exception.filter.ts
     ├── loggin.interceptor.ts
     └── shared.module.ts
├── types
│   ├── order.ts
│   ├── payload.ts
│   ├── product.ts
│   └── user.ts
├── utilities
│   └── user.decorator.ts
```

---

## Deployment

Use the following command to build and deploy the project:

```bash
$ npm run build
$ npm start
```

---

## Tests

Run unit and e2e tests:

```bash
$ npm run test
$ npm run test:e2e
```

---
