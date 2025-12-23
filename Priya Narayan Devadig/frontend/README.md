# Freelance Marketplace Frontend

React.js frontend for the Freelance Marketplace application.

## Setup Instructions

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Choose the LTS version

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Features

- User Registration and Login
- JWT Authentication
- Protected Routes
- User Dashboard
- Profile Management
- Responsive Design

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── PrivateRoute.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   └── Profile.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests