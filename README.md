# Hospital Management App

## Overview

This project is a full-stack Hospital Management Application designed to streamline hospital operations, including appointment scheduling, user authentication, and role-based dashboards for doctors, patients, and administrators. The system is built with a modern tech stack for scalability, maintainability, and ease of deployment.

---

## Features

- **User Authentication:** Secure login and signup for patients, doctors, and admins.
- **Role-Based Dashboards:** Separate dashboards for doctors, patients, and admins with tailored features.
- **Appointment Management:** Patients can book, view, and cancel appointments; doctors can view and manage their appointments.
- **Doctor Profile Management:** Doctors can view their profile and appointment statistics.
- **Admin Controls:** Admins can manage doctors, view all appointments, and oversee system activity.
- **Password Security:** All passwords are securely hashed and never stored in plain text.
- **RESTful API:** Backend exposes a clean REST API for all operations.
- **Frontend-Backend Separation:** Clean separation for easy deployment and scaling.

---

## Tech Stack

- **Frontend:**
  - React (with Vite for fast development)
  - Tailwind CSS (utility-first styling)
  - React Router (routing)
  - Axios (API requests)
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JWT (authentication)
  - bcrypt (password hashing)
- **Other:**
  - Render.com (deployment)
  - GitHub (version control)

---

## Project Structure

```
hospital-app/
├── hospital-backend/         # Node.js/Express backend
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── public/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   └── ...
├── hospital-frontend/        # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   └── ...
├── README.md
└── .gitignore
```

---

## Application Flow

1. **User Registration & Login:**
   - Patients, doctors, and admins register/login via dedicated forms.
   - JWT tokens are issued for session management.
2. **Role-Based Navigation:**
   - After login, users are redirected to their respective dashboards.
   - Access to routes and features is controlled by user role.
3. **Appointment Booking:**
   - Patients can view available doctors and book appointments.
   - Doctors see their upcoming and past appointments.
   - Admins can view all appointments in the system.
4. **Profile Management:**
   - Doctors and patients can view and update their profiles.
5. **Admin Management:**
   - Admins can add/remove doctors, view system stats, and manage users.

---

## How to Run Locally

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

- Copy `.env.example` to `.env` in `hospital-backend/` and fill in the required values (MongoDB URI, JWT secret, etc).

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

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## Deployment (Render.com)

### Backend

- Create a new Web Service on Render, set root to `hospital-backend`.
- Set environment variables as per your `.env` file.
- Build command: `npm install`
- Start command: `npm start`

### Frontend

- Create a new Static Site on Render, set root to `hospital-frontend`.
- Build command: `npm run build`
- Publish directory: `dist`
- Update API URLs in `src/lib/api.js` to point to your Render backend URL.

---

## Security Notes

- Never commit `.env` or credentials to git.
- All passwords are hashed using bcrypt.
- Use HTTPS in production.

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes
4. Push to your fork and open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please open an issue on GitHub.
