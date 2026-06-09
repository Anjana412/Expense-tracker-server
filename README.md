# Expense Tracker — Backend (MERN Stack)

A RESTful API built with Node.js, Express, and MongoDB that powers the Expense Tracker application. It handles user authentication, role-based authorization, expense management, budget tracking, team collaboration, and analytics for personal and organizational expense monitoring.

## Live Demo

**Backend:** https://expense-tracker-server-wc9u.onrender.com

**Frontend:** https://expense-tracker-client-jet.vercel.app

## Features

### User Authentication
- Secure Signup with Name, Email, and Password
- Encrypted Passwords using bcrypt
- JWT Authorization for secure login
- Protected Routes with role-based middleware

### Role-Based Access
- **User:** Personal expense and budget management
- **Admin:** Team expense tracking and reports
- **Super Admin:** Global analytics across all users

### Expense Management
- Full CRUD Operations on expenses
- Category-wise tracking
- Monthly trend analytics
- Team and global expense views

### Team Management
- Create and manage teams
- Add and remove team members
- Team-level expense tracking and reports

### Admin Management
- Super Admin can create and delete Admin accounts
- View all admins in the system

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- dotenv
- CORS

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- MongoDB Atlas account

### Backend Setup

```bash
git clone https://github.com/Anjana412/Expense-tracker-server.git
cd Expense-tracker-server
npm install
npm run dev
```

Server runs at `http://localhost:4000`

## API Routes

### Authentication
```
POST /user/register
POST /user/login
```

### Users
```
GET  /user/allusers
PUT  /user/setbudget
GET  /user/getbudget
```

### Teams
```
POST   /user/createteam
GET    /user/viewteams
GET    /user/viewteammembers/:teamId
POST   /user/addteammember/:teamId
DELETE /user/removeteammember/:teamId/:userId
DELETE /user/deleteteam/:teamId
GET    /user/allteams(Super Admin only)
```

### Admin Management (Super Admin only)
```
POST   /user/admin/create
GET    /user/viewadmins
DELETE /user/admin/delete/:id
```

### Expenses
```
POST   /expense/addexpense
GET    /expense/getexpense
GET    /expense/expense/:id
PUT    /expense/updateexpense/:id
DELETE /expense/delete/:id
GET    /expense/summary
GET    /expense/monthly-trend
GET    /expense/team/expenses
GET    /expense/team/:teamId
GET    /expense/global/expenses
PATCH  /expense/expense/:id/status
```

## Project Structure

```
server/
├── controller/
│   ├── expensecontroller.js
│   └── usercontroller.js
├── middleware/
│   └── auth.js
├── models/
│   ├── expense.js
│   └── user.js
├── Routes/
│   ├── expenseRoutes.js
│   └── userRoutes.js
├── utils/
│   └── db.js
├── index.js
└── package.json
```

## Deployment

- **Backend:** Render
- **Database:** MongoDB Atlas

## Author

**Anjana T**

Email: anjanat0001@gmail.com

GitHub: https://github.com/Anjana412