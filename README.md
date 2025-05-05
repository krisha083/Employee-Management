# Employee Management System

A full-stack MERN application for managing employee information.

## Features

- User Authentication (Login/Register)
- Employee Management (CRUD operations)
- Employee Search
- Profile Picture Upload
- Role-based Access Control (Admin/User)
- Responsive Design

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- Material-UI
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd employee-management
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a .env file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/EmpDB_123
JWT_SECRET=your-super-secret-jwt-key
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at http://localhost:3000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Employees
- GET /api/employees - Get all employees
- GET /api/employees/:id - Get single employee
- POST /api/employees - Create new employee
- PUT /api/employees/:id - Update employee
- DELETE /api/employees/:id - Delete employee
- GET /api/employees/search - Search employees

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 