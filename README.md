# Personal Finance Manager

A web application for managing personal finances, built with React, Node.js, and MySQL.

## Features

- User authentication (register/login)
- Track income and expenses
- Categorize transactions
- View financial summaries and charts
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-manager
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a MySQL database and run the schema:
```bash
mysql -u root -p < setup.sql
```

5. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=finance_manager
JWT_SECRET=your_jwt_secret_key_here
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Transactions
- GET /api/transactions - Get all transactions
- POST /api/transactions - Add new transaction
- PUT /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction

### Categories
- GET /api/categories - Get all categories
- POST /api/categories - Add new category
- PUT /api/categories/:id - Update category
- DELETE /api/categories/:id - Delete category

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Recharts
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - MySQL
  - JWT Authentication
  - bcryptjs

## License

MIT 