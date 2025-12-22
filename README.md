# Care Connect

**Care Connect** is a full-stack Hospital Management System designed to digitize and streamline hospital operations. It provides secure authentication, role-based access, and efficient appointment management for patients, doctors, and administrators.

The application follows a clear frontend–backend separation and uses a modern, scalable architecture suitable for real-world deployment.

---

## Core Features

### Authentication & Authorization

* Secure login and registration for patients, doctors, and administrators
* JWT-based authentication
* Role-based access control across all routes

### Role-Based Dashboards

* **Patients:** Book, view, and cancel appointments
* **Doctors:** Manage schedules, view appointments, and track statistics
* **Admins:** Manage doctors, monitor appointments, and oversee system activity

### Appointment Management

* Patients can schedule appointments with available doctors
* Doctors can view upcoming and completed appointments
* Admins have full visibility into all appointments

### Profile Management

* Patients and doctors can view and update profile information
* Doctors can view appointment-related statistics

### Security

* Passwords are hashed using bcrypt
* Sensitive data is never stored in plain text
* Environment variables are used for all secrets and credentials

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* **SQL Database** (relational data storage)
* JWT Authentication
* bcrypt for password hashing

### Tooling & Deployment

* GitHub for version control
* Render for deployment

---

## Project Structure

```
care-connect/
├── hospital-backend/          # Backend (Node.js + Express + SQL)
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── ...
├── hospital-frontend/         # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── ...
│   ├── public/
│   └── ...
├── README.md
└── .gitignore
```

---

## Application Workflow

1. **User Authentication**

   * Users register or log in based on their role
   * JWT tokens manage authenticated sessions

2. **Role-Based Navigation**

   * Users are redirected to dashboards specific to their role
   * Protected routes enforce authorization rules

3. **Appointments**

   * Patients book appointments
   * Doctors manage schedules
   * Admins monitor all system appointments

4. **Administration**

   * Admins can add or remove doctors
   * System-wide monitoring and management tools are available

---

## Running Locally

### 1. Clone the Repository

```
git clone https://github.com/venkata-arjun/hospital-backend.git
cd care-connect
```

### 2. Install Dependencies

**Backend**

```
cd hospital-backend
npm install
```

**Frontend**

```
cd ../hospital-frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file inside `hospital-backend` and configure:

* SQL database connection details
* JWT secret
* Server port

### 4. Start the Application

**Backend**

```
npm start
```

**Frontend**

```
npm run dev
```

* Backend: `http://localhost:5000`
* Frontend: `http://localhost:5173`

---

## Security Guidelines

* Never commit `.env` files or credentials
* Use HTTPS in production
* Rotate secrets periodically

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Support

For bugs, issues, or feature requests, open an issue in the repository.

---
