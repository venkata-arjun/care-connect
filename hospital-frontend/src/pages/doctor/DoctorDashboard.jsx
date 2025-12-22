import { api } from "../../lib/api";
import { useEffect, useState } from "react";

export function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  const [prescriptionMessage, setPrescriptionMessage] = useState(null);

  async function loadAppointments() {
    try {
      const { data } = await api.get("/doctor/appointments");
      setAppointments(
        Array.isArray(data) ? data.filter((a) => a.status !== "COMPLETED") : []
      );
      setCompletedAppointments(
        Array.isArray(data) ? data.filter((a) => a.status === "COMPLETED") : []
      );
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    (async () => {
      await loadAppointments();
      setLoading(false);
    })();
  }, []);

  // Auto-dismiss toast after a short delay
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Auto-dismiss inline prescription message
  useEffect(() => {
    if (!prescriptionMessage) return;
    const t = setTimeout(() => setPrescriptionMessage(null), 4000);
    return () => clearTimeout(t);
  }, [prescriptionMessage]);

  async function onAddPrescription(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      appointment_id: Number(form.get("appointment_id")),
      diagnosis: form.get("diagnosis"),
      prescription_text: form.get("prescription_text"),
    };
    if (
      !payload.appointment_id ||
      !payload.diagnosis ||
      !payload.prescription_text
    ) {
      alert("Please fill Appointment ID, diagnosis, and prescription text");
      return;
    }
    try {
      const { data } = await api.post("/doctor/prescription", payload);
      // Show an inline success message instead of a toast
      setPrescriptionMessage(
        data?.message || "Prescription added successfully"
      );

      // Refresh appointments in background; log errors only
      loadAppointments().catch((e) =>
        console.error("Failed to refresh appointments:", e)
      );

      // Try to reset form but don't let failures here affect the toast
      try {
        e.currentTarget.reset();
      } catch (resetErr) {
        console.warn("Form reset failed:", resetErr);
      }

      return;
    } catch (err) {
      console.error("Add prescription error:", err);
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Failed to add prescription",
      });
    }
  }

  return (
    <>
      {/* Toast container */}
      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 60 }}>
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-danger"
            } fade-in`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 p-4 md:p-6">
        <section className="card shadow-md col-span-1 md:col-span-7">
          <div className="card-header bg-blue-500 text-white font-bold text-lg p-4 rounded-t-md">
            Upcoming Appointments
          </div>
          <div className="card-body bg-white p-4 rounded-b-md">
            {loading ? (
              <div className="text-center text-gray-500">Loading…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">ID</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Patient
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr>
                        <td
                          className="px-4 py-2 text-center text-gray-500"
                          colSpan="5"
                        >
                          No appointments
                        </td>
                      </tr>
                    ) : (
                      appointments.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">
                            {a.id}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {a.patient_name}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {a.patient_email}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(a.date_time).toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {a.status}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
        <section className="card shadow-md col-span-1 md:col-span-3">
          <div className="card-header bg-green-500 text-white font-bold text-lg p-4 rounded-t-md">
            Add Prescription
          </div>
          <div className="card-body bg-white p-4 rounded-b-md">
            {prescriptionMessage && (
              <div className="text-sm text-green-600 mb-3">
                {prescriptionMessage}
              </div>
            )}
            <form onSubmit={onAddPrescription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Appointment ID
                </label>
                <input
                  name="appointment_id"
                  className="input border border-gray-300 rounded-md w-full p-2"
                  type="number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  name="diagnosis"
                  className="input border border-gray-300 rounded-md w-full p-2"
                  type="text"
                  placeholder="Diagnosis (required)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prescription <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="prescription_text"
                  rows={4}
                  className="input border border-gray-300 rounded-md w-full p-2"
                  placeholder="Write prescription details, medications, instructions..."
                  required
                />
              </div>
              <button
                className="btn-primary w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600"
                type="submit"
              >
                Add Prescription
              </button>
            </form>
          </div>
        </section>
        <section className="card shadow-md col-span-1 md:col-span-10">
          <div className="card-header bg-gray-500 text-white font-bold text-lg p-4 rounded-t-md">
            Completed Appointments
          </div>
          <div className="card-body bg-white p-4 rounded-b-md">
            {loading ? (
              <div className="text-center text-gray-500">Loading…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">ID</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Patient
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedAppointments.length === 0 ? (
                      <tr>
                        <td
                          className="px-4 py-2 text-center text-gray-500"
                          colSpan="5"
                        >
                          No completed appointments
                        </td>
                      </tr>
                    ) : (
                      completedAppointments.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">
                            {a.id}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {a.patient_name}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {a.patient_email}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(a.date_time).toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {a.status}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
