import React from "react";
import doctorImg from "../assets/doctor.jpg";

function Home() {
  return (
    <div className="max-w-6xl mx-auto py-12 fade-in">
      <div className="hero p-6 hero-card">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Trusted care. Easier bookings.
            </h1>
            <p className="text-lg muted mb-6">
              Manage appointments, patient profiles, and care in a secure, fast,
              and simple platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#/login"
                className="btn-outline px-6 py-3 inline-block w-full sm:w-auto text-center"
              >
                Patient Login
              </a>
              <a
                href="#/doctor-login"
                className="btn-outline px-5 py-3 w-full sm:w-auto text-center inline-block"
              >
                Doctor Login
              </a>
              <a
                href="#/admin-login"
                className="btn-outline px-5 py-3 w-full sm:w-auto text-center inline-block"
              >
                Admin Login
              </a>
            </div>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              <li className="inline-flex items-start gap-3">
                <span className="h-3 w-3 mt-2 rounded-full bg-primary-600" />
                <span className="text-sm muted">
                  Book and manage appointments
                </span>
              </li>
              <li className="inline-flex items-start gap-3">
                <span className="h-3 w-3 mt-2 rounded-full bg-primary-600" />
                <span className="text-sm muted">
                  Secure patient & doctor profiles
                </span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <div className="float-y">
              <img
                src={doctorImg}
                alt="Doctor"
                className="rounded-xl shadow-xl w-full max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="card hero-card">
          <div className="card-body">
            <h3 className="font-semibold text-lg mb-2">Patients</h3>
            <p className="text-sm muted">
              Sign up, book appointments, and view records.
            </p>
          </div>
        </div>
        <div className="card hero-card">
          <div className="card-body">
            <h3 className="font-semibold text-lg mb-2">Doctors</h3>
            <p className="text-sm muted">
              Access schedules and patient info quickly.
            </p>
          </div>
        </div>
        <div className="card hero-card">
          <div className="card-body">
            <h3 className="font-semibold text-lg mb-2">Admins</h3>
            <p className="text-sm muted">
              Manage users, doctors, and site activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
