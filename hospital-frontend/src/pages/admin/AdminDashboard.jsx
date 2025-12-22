import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    try {
      setLoading(true);
      const [d, p, a] = await Promise.all([
        api.get("/admin/doctors"),
        api.get("/admin/patients"),
        api.get("/admin/activity"),
      ]);

      setDoctors(d.data || []);
      setPatients(p.data || []);
      setActivity(a.data || []);
    } catch (e) {
      console.error("Failed to load data:", e);
      alert("Unable to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function onCreateDoctor(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await api.post("/admin/doctor", payload);
      e.currentTarget.reset();
      await loadAll();
      const msg = res?.data?.message || "Doctor created successfully";
      alert(msg);
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Failed to create doctor. Please try again."
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage doctors, patients, and monitor system activity
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Create Doctor & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create Doctor Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-8 py-6">
              <h2 className="text-2xl font-bold text-white">
                Create New Doctor
              </h2>
            </div>
            <div className="p-8">
              <form onSubmit={onCreateDoctor} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Dr. John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="doctor@hospital.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      placeholder="e.g., Cardiology"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Doctor..." : "Create Doctor Account"}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-2xl px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="p-8">
              {loading ? (
                <p className="text-center text-gray-500 py-10">
                  Loading recent activity...
                </p>
              ) : activity.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  No recent appointments
                </p>
              ) : (
                <div className="space-y-5 max-h-96 overflow-y-auto">
                  {activity.map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between items-center p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          Appointment #{a.id}
                          <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {a.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {a.patient_name} → Dr. {a.doctor_name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(a.date_time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Doctors and Patients Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctors List */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl px-8 py-6">
              <h2 className="text-2xl font-bold text-white">
                Registered Doctors
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-8 py-5">ID</th>
                    <th className="px-8 py-5">Name</th>
                    <th className="px-8 py-5">Email</th>
                    <th className="px-8 py-5">Specialization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-gray-500"
                      >
                        Loading doctors...
                      </td>
                    </tr>
                  ) : doctors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-gray-500"
                      >
                        No doctors registered yet
                      </td>
                    </tr>
                  ) : (
                    doctors.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50 transition">
                        <td className="px-8 py-5 text-sm text-gray-600">
                          #{d.id}
                        </td>
                        <td className="px-8 py-5 font-medium text-gray-900">
                          {d.name}
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-600">
                          {d.email}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {d.specialization}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patients List */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-t-2xl px-8 py-6">
              <h2 className="text-2xl font-bold text-white">
                Registered Patients
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-8 py-5">ID</th>
                    <th className="px-8 py-5">Name</th>
                    <th className="px-8 py-5">Email</th>
                    <th className="px-8 py-5">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-gray-500"
                      >
                        Loading patients...
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-gray-500"
                      >
                        No patients registered yet
                      </td>
                    </tr>
                  ) : (
                    patients.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-8 py-5 text-sm text-gray-600">
                          #{p.id}
                        </td>
                        <td className="px-8 py-5 font-medium text-gray-900">
                          {p.name}
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-600">
                          {p.email}
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-600">
                          {p.phone || (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
