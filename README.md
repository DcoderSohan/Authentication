# Authentication & Task Management System

A full-stack project implementing a secure authentication system with Role-Based Access Control (RBAC) and a complete task management dashboard.

## 🚀 Project Overview
This project consists of a React-based frontend and a Node.js/Express backend. It enables users to register, log in, and manage their tasks. Admin users have elevated privileges to view and manage all tasks within the system.

## ✨ Features
- **Authentication**: Secure registration and login using JWT (JSON Web Tokens) and Bcrypt for password hashing.
- **Role-Based Access Control (RBAC)**: 
  - **User**: Can create, view, edit, and delete their own tasks.
  - **Admin**: Can view and manage tasks for all users.
- **Task Management**: Full CRUD (Create, Read, Update, Delete) functionality for tasks.
- **Dynamic Dashboard**: Responsive UI tailored to the user's role.
- **API Documentation**: Detailed endpoint documentation included.

## 🛠 Tech Stack
### Frontend
- **React.js** (Vite)
- **Tailwind CSS**
- **React Router Dom**
- **Axios**

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT** for Secure Auth
- **Bcrypt** for hashing passwords

## 🚦 How to Run

### 1. Clone the repository
```bash
git clone https://github.com/DcoderSohan/Authentication.git
cd Authentication
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```
*Note: Ensure you have a `.env` file in the backend folder with your `MONGODB_URI` and `JWT_SECRET`.*

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Vercel Deployment Note
This project is configured for Vercel with a `vercel.json` file in the `frontend` directory to handle Single Page Application (SPA) routing correctly (preventing 404 errors on refresh).
