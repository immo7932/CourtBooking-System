# Court Booking System

**College ID Number:** IEC2021057

## Project Overview
This project is a web application built using React and Chakra UI for the frontend, and Express.js with MongoDB for the backend. It allows users to log in, view available sports court slots, and make bookings accordingly. The application ensures secure authentication, real-time slot availability, and a user-friendly interface for seamless bookings.

## Table of Contents
1. [Live Demo](#live-demo)
2. [Project Report](#project-report)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Project Structure](#project-structure)
7. [Deployment](#deployment)
8. [Assumptions and Limitations](#assumptions-and-limitations)
9. [Special Instructions](#special-instructions)
10. [Dependencies](#dependencies)

## Live Demo
Access the live versions of the frontend and backend applications through the links below:

- **Frontend Application:** [https://court-booking-app.vercel.app/login](https://court-booking-system.vercel.app/)
- **Backend API:** [https://court-booking-api.onrender.com](https://courtbooking-system.onrender.com)

## Project Report
- **Report Link:** [https://drive.google.com/file/d/1xyzReportLink/view?usp=sharing](https://drive.google.com/file/d/1xyzReportLink/view?usp=sharing)

## Prerequisites
Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine. You can download them from [Node.js Official Website](https://nodejs.org).
- A running instance of the backend API. Update the API endpoints in the code if necessary.
- Git installed for version control (optional but recommended).

## Installation
1. **Clone the Repository:**

```bash
git clone https://github.com/your-username/court-booking-system.git
```

2. **Navigate to the Project Directory:**

```bash
cd court-booking-system
```

3. **Install Dependencies:**

```bash
npm install
```

## Running the Application
### Development Mode
To run the application in development mode with hot-reloading:

```bash
npm start
```

The frontend application will start on `http://localhost:3000` by default, and the backend API will run on `http://localhost:5000`.

### Production Build
To create a production build for the frontend:

```bash
npm run build
```

This will generate optimized static files in the `build` directory.

## Project Structure
### Frontend
```
frontend/
  src/
    components/
      Login.jsx
      Register.jsx
      ScheduleGrid.jsx
      ...
    utils/
      dateUtils.js
    contexts/
      AuthContext.js
    App.js
    index.js
  public/
    index.html
  package.json
  README.md
```

### Backend
```
backend/
  controllers/
    userController.js
    bookingController.js
    ...
  routes/
    userRoute.js
    bookingRoute.js
    ...
  server.js
  package.json
  .env
  .gitignore
```

## Deployment
### Frontend Deployment
1. **Connect Repository:**
   Log in to Render.com and connect your GitHub repository.

2. **Create a New Static Site:**
   - Select the frontend directory.
   - Set the build command to `npm run build`.
   - Set the publish directory to `build`.

3. **Environment Variables:**
   If required, set environment variables in Render.com's dashboard.

4. **Deploy:**
   Render.com will automatically build and deploy your frontend application.

### Backend Deployment
1. **Connect Repository:**
   Log in to Render.com and connect your GitHub repository.

2. **Create a New Web Service:**
   - Select the backend directory.
   - Set the build command to `npm install`.
   - Set the start command to `npm start`.

3. **Environment Variables:**
   Add necessary environment variables such as:
   - `PORT=5000`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret`
   - Any other required variables.

4. **Deploy:**
   Render.com will automatically install dependencies and start your backend server.

## Assumptions and Limitations
- **Authentication:** The application assumes that user authentication is handled via JWT tokens stored securely in localStorage.
- **API Endpoints:** The frontend expects specific API endpoints (e.g., `/api/user/login`, `/api/centre/getCentre`). Ensure these endpoints are available and correctly configured.
- **Booking Limitation:** Users cannot book court slots unless authenticated. Proper authentication flow must be maintained.
- **Date Range:** The application displays available slots for the next 7 days.
- **Data Structure:** The code assumes certain structures for the data returned from the API. Modify the code if your API responses differ.

## Special Instructions
- **Environment Variables:** For security, set environment variables directly in the deployment environment (Render.com dashboard) instead of using `.env` files in production.
- **Styling Conflicts:** The application uses Chakra UI for styling. Avoid mixing external CSS and Chakra UI styles to prevent conflicts.
- **Error Handling:** Basic error handling is implemented. Further enhancements might be necessary for production, such as more descriptive error messages and logging.

## Dependencies
### Frontend:
- **React:** A JavaScript library for building user interfaces.
- **Chakra UI:** A simple, modular, and accessible component library for React.
- **React Router DOM:** For handling routing in the application.

### Backend:
- **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB & Mongoose:** For database management.
- **bcryptjs:** For hashing passwords (replacing bcrypt to avoid native module issues).
- **jsonwebtoken:** For handling JWT tokens.
- **dotenv:** For loading environment variables.
- **cors:** For enabling Cross-Origin Resource Sharing.
- **body-parser:** For parsing incoming request bodies.

### Other Tools:
- **Nodemon:** For automatically restarting the server during development.
- **Axios:** For making HTTP requests from the frontend.

For a complete list of dependencies and their versions, refer to the respective `package.json` files in the frontend and backend directories.

