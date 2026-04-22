# Event Management System

Full stack event management project with:
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB

## Features

- Role based login: Admin, Vendor, User
- Vendor product and request flows
- User cart, order status, guest list
- Membership management

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS
- Backend: Express, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas or local MongoDB

## Project Structure

- frontend: React app
- backend: Express API

## Prerequisites

- Node.js 18 or above
- npm
- MongoDB connection string (Atlas recommended)

## 1. Clone And Open Project

1. Clone repo to your machine.
2. Open project root in VS Code.

## 2. Backend Setup

Go to backend folder and install dependencies:

1. cd backend
2. npm install

Create a file named .env inside backend folder and add this:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@ems.com
ADMIN_PASSWORD=admin123

Run backend server:

1. npm run dev

Backend should run on:
- http://localhost:5000

Optional: seed admin manually (only first time, if needed):

1. npm run seed:admin

## 3. Frontend Setup

Open new terminal and run:

1. cd frontend
2. npm install
3. npm run dev

Frontend should run on:
- http://localhost:5173

## 4. Login Flow

- Admin login uses ADMIN_EMAIL and ADMIN_PASSWORD from backend .env
- User and Vendor can register from frontend signup pages

## 5. Build For Production

Frontend build:

1. cd frontend
2. npm run build

Backend production start:

1. cd backend
2. npm start

## 6. Common Issues

1. MongoDB connection error:
- Check MONGO_URI in backend .env
- Ensure MongoDB Atlas IP access is allowed

2. CORS issue:
- Ensure CLIENT_URL in backend .env matches frontend URL

3. Port already in use:
- Change PORT in backend .env
- Restart server

## 7. Important Notes

- Do not commit backend .env to GitHub.
- Keep secrets private.
- Use backend/.env.example as template if you create one for teammates.
