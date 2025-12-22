# Hospital Management App

This repository contains a full-stack hospital management application with a Node.js/Express backend and a React (Vite) frontend.

## Features

- Doctor, Patient, and Admin authentication
- Appointment management
- Doctor and patient dashboards
- Secure password handling
- RESTful API

## Project Structure

- `hospital-backend/` — Node.js/Express backend
- `hospital-frontend/` — React frontend (Vite)

## Prerequisites

- Node.js (v18 or above recommended)
- npm (comes with Node.js)
- [Render.com](https://render.com/) account for deployment (optional)

## Local Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/venkata-arjun/hospital-backend.git
cd hospital-backend/..
```

### 2. Install Dependencies

#### Backend

```
cd hospital-backend
npm install
```

#### Frontend

```
cd ../hospital-frontend
npm install
```

### 3. Configure Environment Variables

- Copy `.env.example` to `.env` in `hospital-backend/` and fill in the required values (database URI, JWT secret, etc).

### 4. Run Locally

#### Backend

```
cd hospital-backend
npm start
```

#### Frontend

```
cd ../hospital-frontend
npm run dev
```

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`

## Deployment on Render.com

### Backend

1. Push your code to GitHub.
2. Create a new Web Service on Render, connect your repo, and set the root directory to `hospital-backend`.
3. Set environment variables in Render as per your `.env` file.
4. Set the build and start commands:
   - Build: `npm install`
   - Start: `npm start`

### Frontend

1. Create a new Static Site on Render, set the root directory to `hospital-frontend`.
2. Set the build command: `npm run build`
3. Set the publish directory: `dist`
4. Update the frontend's API URLs in `src/lib/api.js` to point to your Render backend URL.

## Notes

- For any issues, ensure your backend is accessible from the frontend (CORS, correct API URLs).
- For production, use secure environment variables and HTTPS.

## License

This project is licensed under the MIT License.
