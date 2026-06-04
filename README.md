# Expense Tracker — Backend

REST API server for the Expense Tracker application. Handles authentication, expense management, team management, and analytics.

## Features

- JWT-based authentication
- User roles — User, Admin, Super Admin
- Expense CRUD operations
- Team creation and management
- Budget tracking
- Global and team-level analytics
- CSV export support

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas (Mongoose)
- JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account and cluster

### Installation

```bash
git clone https://github.com/Anjana412/Expense-tracker-server.git
cd Expense-tracker-server
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
PORT=4000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/YOUR_DB_NAME
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Run Locally

```bash
node index.js
```

Or with nodemon:

```bash
npx nodemon index.js
```

Server runs at `http://localhost:4000`

## Deployment

Deployed on **Render**. Set the following environment variables in your Render service settings:

```
PORT=4000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=https://your-vercel-app.vercel.app
```

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /user/register | Register a new user |
| POST | /user/login | Login and get JWT token |

### Expenses
| Method | Route | Description |
|--------|-------|-------------|
| GET | /expense/getexpense | Get user's expenses |
| POST | /expense/addexpense | Add new expense |
| PUT | /expense/updateexpense/:id | Update expense |
| DELETE | /expense/delete/:id | Delete expense |
| GET | /expense/team/expenses | Get team expenses |
| GET | /expense/global/expenses | Get all expenses (superadmin) |
| GET | /expense/summary | Get expense summary |
| GET | /expense/monthly-trend | Get monthly trend |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | /user/allusers | Get all users (admin) |
| PUT | /user/makeadmin/:id | Promote user to admin |
| DELETE | /user/removeadmin/:id | Demote admin to user |
| PUT | /user/setbudget | Set monthly budget |
| GET | /user/getbudget | Get monthly budget |

### Teams
| Method | Route | Description |
|--------|-------|-------------|
| POST | /user/team/create | Create a team |
| GET | /user/team/members | Get team members |
| DELETE | /user/team/member/:id | Remove team member |

## Folder Structure

```
├── index.js          # Entry point
├── models/           # Mongoose models
├── routes/           # Express route handlers
├── middleware/        # Auth middleware
└── controllers/      # Route logic
```