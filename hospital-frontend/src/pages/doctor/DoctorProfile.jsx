import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: profileData } = await api.get("/doctor/profile");
        setProfile(profileData);

        const { data: appointmentsData } = await api.get(
          "/doctor/appointments"
        );
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error loading profile or appointments:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (appt) => appt.status === "COMPLETED"
  ).length;
  const pendingAppointments = appointments.filter(
    (appt) => appt.status !== "COMPLETED"
  ).length;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Error: Unable to load profile data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header bg-blue-500 text-white font-bold text-lg p-4 rounded-t-md">
          Doctor Profile
        </div>
        <div className="card-body bg-white p-4 rounded-b-md">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="profile-field">
              <label className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                Full Name
              </label>
              <p className="text-base font-medium mt-1 text-gray-900">
                {profile?.name || "N/A"}
              </p>
            </div>
            <div className="profile-field">
              <label className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                Email
              </label>
              <p className="text-base font-medium mt-1 text-gray-900">
                {profile?.email || "N/A"}
              </p>
            </div>
            <div className="profile-field">
              <label className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                Specialization
              </label>
              <p className="text-base font-medium mt-1 text-gray-900">
                {profile?.specialization || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-8">
        <div
          className="rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
          style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
        >
          <div className="text-4xl font-bold mb-3">{totalAppointments}</div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            Total Appointments
          </p>
        </div>
        <div
          className="rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
          style={{ backgroundColor: "#14B8A6", color: "#FFFFFF" }}
        >
          <div className="text-4xl font-bold mb-3">{completedAppointments}</div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">
            Completed
          </p>
        </div>
        <div
          className="rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
          style={{ backgroundColor: "#F59E0B", color: "#FFFFFF" }}
        >
          <div className="text-4xl font-bold mb-3">{pendingAppointments}</div>
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-200">
            Pending
          </p>
        </div>
      </div>
    </div>
  );
}
