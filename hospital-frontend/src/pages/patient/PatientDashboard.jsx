import { api } from "../../lib/api";
import { useEffect, useState } from "react";

export function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("book"); // 'book' or 'view'

  async function loadDoctors() {
    try {
      const { data } = await api.get("/doctor/list");
      setDoctors(data || []);
    } catch (e) {
      console.error(e);
    }
  }
  async function loadAppointments() {
    try {
      const { data } = await api.get("/appointments/my");
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    (async () => {
      await Promise.all([loadDoctors(), loadAppointments()]);
      setLoading(false);
    })();
  }, []);

  async function onBook(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      doctor_id: form.get("doctor_id"),
      date_time: form.get("date_time"),
    };
    if (!payload.doctor_id || !payload.date_time) {
      alert("Please fill both fields");
      return;
    }
    try {
      await api.post("/appointments", payload);
      alert("✅ Appointment booked successfully!");
      await loadAppointments();
      e.currentTarget.reset();
      setActiveTab("view");
    } catch (err) {
      alert(err?.response?.data?.message || "Booking failed");
    }
  }

  const upcomingCount = appointments.filter(
    (a) => a.status !== "COMPLETED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="card">
        <div className="card-body p-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("book")}
              className={`px-4 py-3 font-medium text-sm flex-1 text-center border-b-2 transition ${
                activeTab === "book"
                  ? "text-primary-600 border-primary-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              📅 Book Appointment
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`px-4 py-3 font-medium text-sm flex-1 text-center border-b-2 transition ${
                activeTab === "view"
                  ? "text-primary-600 border-primary-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              📋 My Appointments ({upcomingCount})
            </button>
            <a
              href="#/patient-profile"
              className={`px-4 py-3 font-medium text-sm flex-1 text-center border-b-2 transition text-gray-600 border-transparent hover:text-gray-900`}
            >
              👤 Profile & Records
            </a>
          </div>
        </div>
      </div>

      {/* Book Tab */}
      {activeTab === "book" && (
        <div className="card">
          <div className="card-header">📅 Schedule a New Appointment</div>
          <div className="card-body">
            <form onSubmit={onBook} className="max-w-md">
              <div className="form-group">
                <label>Select Doctor</label>
                <select name="doctor_id" className="input" defaultValue="">
                  <option value="" disabled>
                    Choose a doctor
                  </option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input
                  name="date_time"
                  type="datetime-local"
                  className="input"
                />
              </div>
              <button className="btn-primary w-full" type="submit">
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Tab */}
      {activeTab === "view" && (
        <div className="card">
          <div className="card-header">📋 My Appointments</div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-2"></div>
                Loading…
              </div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p>No appointments scheduled yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Doctor</th>
                      <th>Specialization</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.doctor_id}</td>
                        <td>{a.specialization || ""}</td>
                        <td>{new Date(a.date_time).toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              a.status === "COMPLETED"
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
