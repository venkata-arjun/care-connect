# Project Structure Overview

This document describes how the backend of the Hospital App is structured.


---

## Step 1: Database Setup

You set up the entire backend data structure.

**Database:** `hospital_app`

### Tables Created
1. **users** → Stores login details and role  
2. **patients** → Patient extra information (phone, etc.)  
3. **doctors** → Doctor extra information (specialization)  
4. **appointments** → Booking records between doctor and patient  
5. **prescriptions** → Medicines given for appointments  


---

## Step 2: Backend Configuration

You connected the backend to MySQL and enabled environment variables.

### Files
- `config/db.js` → MySQL connection pool  
- `.env` → Secure DB credentials and JWT secret  
- `app.js` → Main server entry (route setup + middleware)  


---

## Step 3: Authentication System

Signup + Login using password hashing and JWT tokens.

### Files
- `routes/authRoutes.js`
- `controllers/authController.js`
- `utils/password.js`

### Purpose
- Secure user registration and login
- Generate access tokens for protected APIs


---

## Step 4: Role-Based Authorization

Ensures only authorized users can access certain features.

### File
- `middleware/authMiddleware.js`

### Purpose
- Validate JWT (Authentication)
- Check user role (Authorization)


---

## Step 5: Patient Features

Patients manage their appointments.

### Files
- `routes/appointmentRoutes.js`
- `controllers/appointmentController.js`

### Features
- Book appointments with doctors
- View their own appointments


---

## Step 6: Doctor Features

Doctors handle medical operations.

### Files
- `routes/doctorRoutes.js`
- `controllers/doctorController.js`

### Features
- View doctor’s scheduled appointments
- Add prescriptions for patients


---

## Step 7: Admin Features

Admins control and monitor the system.

### Files
- `routes/adminRoutes.js`
- `controllers/adminController.js`

### Features
- Add and manage doctors
- View system statistics (users, doctors, patients, appointments)


---
