import { api } from "../../lib/api";
import { getUser } from "../../lib/auth";
import { useEffect, useState } from "react";

export function PatientProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctor_id: "",
    date_time: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null); // {type: 'success'|'error', text}
  const [expandedAppointments, setExpandedAppointments] = useState({}); // Track expanded appointments by ID

  function handleCancel() {
    setIsEditing(false);
    setEditForm({});
  }

  async function loadProfile() {
    try {
      const { data: appts } = await api.get("/appointments/my");
      setAppointments(Array.isArray(appts) ? appts : []);

      // Load doctors for filter dropdown
      const { data: docList } = await api.get("/doctor/list");
      setDoctors(docList || []);

      // Extract prescriptions from completed appointments
      const presc = appts
        .filter((a) => a.status === "COMPLETED" && a.prescription)
        .map((a, i) => ({
          id: i + 1,
          appointment_id: a.id,
          doctor_id: a.doctor_id,
          date: a.date_time,
          medicine: a.prescription?.medicine || null,
          dosage: a.prescription?.dosage || null,
          text: a.prescription?.text || null,
          diagnosis: a.prescription?.diagnosis || null,
          doctor_name: getDoctorName(a.doctor_id),
        }));
      setPrescriptions(presc);

      // Load user data (local) and augment with server profile (to get signup/join date)
      let user = getUser() || {};
      let profileData = null;
      try {
        const res = await api.get("/appointments/profile");
        profileData = res?.data || null;
      } catch (fetchErr) {
        console.warn("Could not fetch profile from backend:", fetchErr);
      }

      // Debug: log fetched profile data and local user for diagnosis
      console.debug("PatientProfile - fetched profileData:", profileData);
      console.debug("PatientProfile - local user:", user);

      // Merge values preferring server profile data when available
      if (profileData) {
        user = {
          ...user,
          name: profileData.name || user.name,
          email: profileData.email || user.email,
          phone: profileData.phone || user.phone,
        };
      }

      setProfile({
        name: user?.name || "Patient Name",
        email: user?.email || "patient@email.com",
        phone: user?.phone || "+1 (555) 000-1234",
        dob: "1990-01-15",
        bloodType: "O+",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleEditClick() {
    setEditForm({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      bloodType: profile?.bloodType || "",
      dob: profile?.dob || "",
    });
    setIsEditing(true);
  }

  async function handleBookAppointment() {
    if (!bookingData.doctor_id || !bookingData.date_time) {
      setBookingMessage({
        type: "error",
        text: "Please select both doctor and date/time",
      });
      return;
    }

    setBookingLoading(true);
    setBookingMessage(null);
    try {
      await api.post("/appointments", {
        doctor_id: parseInt(bookingData.doctor_id),
        date_time: bookingData.date_time,
      });

      setBookingMessage({
        type: "success",
        text: "Appointment booked successfully!",
      });
      setBookingData({ doctor_id: "", date_time: "" });
      await loadProfile();

      // Clear success message after 3 seconds
      setTimeout(() => setBookingMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setBookingMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to book appointment",
      });
    } finally {
      setBookingLoading(false);
    }
  }

  // Helper function to check if appointment time has passed
  function isAppointmentPassed(appointmentDateTime) {
    return new Date(appointmentDateTime) < new Date();
  }

  // Helper function to check if appointment is effectively completed
  function isCompletedAppointment(appt) {
    // Treat as completed if status is COMPLETED and there is any prescription (notes/text)
    return (
      appt.status === "COMPLETED" &&
      appt.prescription &&
      typeof appt.prescription.text === "string" &&
      appt.prescription.text.trim() !== ""
    );
  }

  const pastAppointments = appointments.filter(
    (a) => isCompletedAppointment(a) && filterByDoctor(a) && filterByStatus(a)
  );
  const scheduledAppointments = appointments.filter(
    (a) => !isCompletedAppointment(a) && filterByDoctor(a) && filterByStatus(a)
  );

  function filterByDoctor(appt) {
    if (!filterDoctor) return true;
    return appt.doctor_id === parseInt(filterDoctor);
  }

  function filterByStatus(appt) {
    if (!filterStatus) return true;
    const isCompleted = isCompletedAppointment(appt);
    if (filterStatus === "completed") return isCompleted;
    if (filterStatus === "upcoming") return !isCompleted;
    return appt.status.toLowerCase() === filterStatus.toLowerCase();
  }

  // Helper function to get doctor name by ID
  function getDoctorName(doctorId) {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? doctor.name : `Doctor #${doctorId}`;
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner mx-auto mb-4"></div>
        <p style={{ color: "#475569" }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Header */}
      <div
        className="bg-white px-4 sm:px-6 py-4 flex items-center justify-between gap-3"
        style={{ borderBottom: `1px solid #E5E7EB` }}
      >
        <h1
          className="text-2xl font-bold text-center sm:text-left w-full"
          style={{ color: "#0F172A", margin: "0 auto" }}
        >
          Patient Portal
        </h1>
      </div>

      {/* Tab Navigation */}
      <div
        className="bg-white px-2 sm:px-6"
        style={{ borderBottom: `1px solid #E5E7EB` }}
      >
        <div
          className="flex flex-row justify-center items-center w-full max-w-xl mx-auto py-3 bg-slate-100 rounded-full border border-slate-200 shadow-sm overflow-x-auto no-scrollbar whitespace-nowrap"
          style={{
            WebkitOverflowScrolling: "touch",
            marginTop: 12,
            marginBottom: 8,
          }}
        >
          <button
            onClick={() => setActiveTab("book")}
            className={`tab-button flex-1 min-w-[90px] max-w-xs px-3 py-2 md:px-5 md:py-2.5 rounded-full text-center whitespace-nowrap text-sm font-semibold mx-1
              transition-[box-shadow,transform] duration-300 ease-in-out
              transition-colors duration-75
              ${
                activeTab === "book"
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-transparent text-blue-900 hover:bg-blue-50"
              }
            `}
            style={{
              border: "none",
              backgroundColor: activeTab === "book" ? "#2563eb" : undefined,
              color: activeTab === "book" ? "#fff" : undefined,
            }}
          >
            Book
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`tab-button flex-1 min-w-[90px] max-w-xs px-3 py-2 md:px-5 md:py-2.5 rounded-full text-center whitespace-nowrap text-sm font-semibold mx-1
              transition-[box-shadow,transform] duration-300 ease-in-out
              transition-colors duration-75
              ${
                activeTab === "appointments"
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-transparent text-blue-900 hover:bg-blue-50"
              }
            `}
            style={{
              border: "none",
              backgroundColor:
                activeTab === "appointments" ? "#2563eb" : undefined,
              color: activeTab === "appointments" ? "#fff" : undefined,
            }}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`tab-button flex-1 min-w-[90px] max-w-xs px-3 py-2 md:px-5 md:py-2.5 rounded-full text-center whitespace-nowrap text-sm font-semibold mx-1
              transition-[box-shadow,transform] duration-300 ease-in-out
              transition-colors duration-75
              ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-transparent text-blue-900 hover:bg-blue-50"
              }
            `}
            style={{
              border: "none",
              backgroundColor: activeTab === "profile" ? "#2563eb" : undefined,
              color: activeTab === "profile" ? "#fff" : undefined,
            }}
          >
            Profile
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Book Appointment Tab */}
        {activeTab === "book" && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-bold" style={{ color: "#0F172A" }}>
                  Book New Appointment
                </h2>
              </div>
              <div className="card-body">
                {/* Success/Error Message */}
                {bookingMessage && (
                  <div
                    className={`mb-6 p-4 rounded-lg text-center font-medium ${
                      bookingMessage.type === "success"
                        ? "bg-green-50 text-green-900 border border-green-300"
                        : "bg-red-50 text-red-900 border border-red-300"
                    }`}
                    style={
                      bookingMessage.type === "success"
                        ? {
                            backgroundColor: "#f0fdf4",
                            color: "#15803d",
                            borderColor: "#86efac",
                          }
                        : {
                            backgroundColor: "#fef2f2",
                            color: "#991b1b",
                            borderColor: "#fecaca",
                          }
                    }
                  >
                    {bookingMessage.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="form-group">
                    <label className="text-sm font-medium">Select Doctor</label>
                    <select
                      className="input"
                      value={bookingData.doctor_id}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          doctor_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} - {d.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="text-sm font-medium">Date & Time</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={bookingData.date_time}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          date_time: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    onClick={handleBookAppointment}
                    disabled={bookingLoading}
                    className="btn-primary w-full"
                  >
                    {bookingLoading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-bold" style={{ color: "#0F172A" }}>
                  Filter Appointments
                </h2>
              </div>
              <div className="card-body">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="text-sm font-medium">Select Doctor</label>
                    <select
                      className="input"
                      value={filterDoctor}
                      onChange={(e) => setFilterDoctor(e.target.value)}
                    >
                      <option value="">All Doctors</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="text-sm font-medium">
                      Appointment Type
                    </label>
                    <select
                      className="input"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            {(filterStatus === "" || filterStatus === "upcoming") && (
              <div className="card">
                <div className="card-header">
                  <h2
                    className="text-lg font-bold"
                    style={{ color: "#0F172A" }}
                  >
                    Upcoming Appointments{" "}
                    <span
                      className="font-normal text-base"
                      style={{ color: "#475569" }}
                    >
                      ({scheduledAppointments.length})
                    </span>
                  </h2>
                </div>
                <div className="card-body">
                  {scheduledAppointments.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">No Data</div>
                      <p>No upcoming appointments scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scheduledAppointments.map((appt) => (
                        <div
                          key={appt.id}
                          className="border rounded-xl p-5 hover:shadow-lg transition-shadow duration-300"
                          style={{
                            borderColor: "#E5E7EB",
                            backgroundColor: "#F8FAFC",
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                            <div className="flex-1">
                              <h3
                                className="font-bold text-base"
                                style={{ color: "#2563EB" }}
                              >
                                {getDoctorName(appt.doctor_id)}
                              </h3>
                              <div className="space-y-2 mt-3">
                                <p
                                  className="text-sm"
                                  style={{ color: "#475569" }}
                                >
                                  <span className="font-semibold">
                                    Scheduled Date:
                                  </span>{" "}
                                  <span style={{ color: "#64748B" }}>
                                    {new Date(appt.date_time).toLocaleString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </span>
                                </p>
                                <p
                                  className="text-sm"
                                  style={{ color: "#475569" }}
                                >
                                  <span className="font-semibold">
                                    Specialization:
                                  </span>{" "}
                                  <span style={{ color: "#64748B" }}>
                                    {appt.specialization || "General Medicine"}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <span
                              className="text-white text-xs font-bold px-3 py-1.5 rounded-md whitespace-nowrap self-start sm:self-auto mt-3 sm:mt-0"
                              style={{ backgroundColor: "#2563EB" }}
                            >
                              Upcoming
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Completed Appointments with Prescriptions */}
            {(filterStatus === "" || filterStatus === "completed") && (
              <div className="card">
                <div className="card-header">
                  <h2
                    className="text-lg font-bold"
                    style={{ color: "#0F172A" }}
                  >
                    Completed Appointments & Prescriptions{" "}
                    <span
                      className="font-normal text-base"
                      style={{ color: "#475569" }}
                    >
                      ({pastAppointments.length})
                    </span>
                  </h2>
                </div>
                <div className="card-body">
                  {pastAppointments.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">No Data</div>
                      <p>No completed appointments</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastAppointments.map((appt) => {
                        const apptPrescriptions = prescriptions.filter(
                          (p) => p.appointment_id === appt.id
                        );
                        return (
                          <div
                            key={appt.id}
                            className="border rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white"
                            style={{ borderColor: "#E5E7EB" }}
                          >
                            {/* Appointment Header */}
                            <div
                              className="p-5 text-white"
                              style={{ backgroundColor: "#2563EB" }}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                <div className="flex-1">
                                  <h3
                                    className="text-lg font-bold tracking-tight"
                                    style={{ color: "#FFFFFF" }}
                                  >
                                    {getDoctorName(appt.doctor_id)}
                                  </h3>
                                  <p
                                    className="text-sm mt-1 font-medium"
                                    style={{ color: "#CBD5E1" }}
                                  >
                                    {appt.specialization || "General Medicine"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                                  <div
                                    className="px-4 py-2 rounded-lg"
                                    style={{ backgroundColor: "#14B8A6" }}
                                  >
                                    <span className="text-xs font-bold uppercase letter-spacing tracking-widest text-white">
                                      Completed
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      setExpandedAppointments((prev) => ({
                                        ...prev,
                                        [appt.id]: !prev[appt.id],
                                      }))
                                    }
                                    className="hover:opacity-90 transition-all px-3 py-1 rounded-lg flex items-center justify-center border"
                                    style={{
                                      backgroundColor: "#FFFFFF",
                                      color: "#2563EB",
                                      borderColor: "#E5E7EB",
                                    }}
                                    title={
                                      expandedAppointments[appt.id]
                                        ? "Collapse details"
                                        : "Expand details"
                                    }
                                  >
                                    <span className="text-lg font-semibold">
                                      {expandedAppointments[appt.id]
                                        ? "-"
                                        : "+"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Appointment Details - Expandable */}
                            {expandedAppointments[appt.id] && (
                              <>
                                <div
                                  className="p-5 border-b animate-in fade-in duration-200"
                                  style={{
                                    backgroundColor: "#F8FAFC",
                                    borderColor: "#E5E7EB",
                                  }}
                                >
                                  <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                      <p
                                        className="text-xs uppercase font-bold mb-2 tracking-wider"
                                        style={{ color: "#2563EB" }}
                                      >
                                        Appointment Date &amp; Time
                                      </p>
                                      <p
                                        className="text-sm font-semibold"
                                        style={{ color: "#0F172A" }}
                                      >
                                        {new Date(
                                          appt.date_time
                                        ).toLocaleString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                    <div>
                                      <p
                                        className="text-xs uppercase font-bold mb-2 tracking-wider"
                                        style={{ color: "#2563EB" }}
                                      >
                                        Consultation Status
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className="inline-block w-2.5 h-2.5 rounded-full"
                                          style={{ backgroundColor: "#14B8A6" }}
                                        ></span>
                                        <span
                                          className="text-sm font-semibold"
                                          style={{ color: "#0F172A" }}
                                        >
                                          {appt.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Prescriptions Section */}
                                {apptPrescriptions.length > 0 ? (
                                  <div
                                    className="border-t p-5 bg-white"
                                    style={{ borderColor: "#E5E7EB" }}
                                  >
                                    <h4
                                      className="text-sm font-bold mb-4 uppercase tracking-wider"
                                      style={{ color: "#0F172A" }}
                                    >
                                      Medical Prescriptions
                                    </h4>
                                    <div className="space-y-3">
                                      {apptPrescriptions.map((presc) => (
                                        <div
                                          key={presc.id}
                                          className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                          style={{
                                            borderColor: "#14B8A6",
                                            backgroundColor: "#F0FDFA",
                                          }}
                                        >
                                          <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1">
                                              {presc.diagnosis && (
                                                <div
                                                  className="mb-2 text-xs"
                                                  style={{ color: "#0F766E" }}
                                                >
                                                  <span className="font-semibold">
                                                    Diagnosed with:
                                                  </span>{" "}
                                                  {presc.diagnosis}
                                                </div>
                                              )}
                                              <div
                                                className="text-sm"
                                                style={{ color: "#222" }}
                                              >
                                                {presc.text
                                                  ? presc.text
                                                  : presc.medicine}
                                              </div>
                                              <div className="space-y-2 mt-3">
                                                {presc.text ? null : (
                                                  <p
                                                    className="text-xs"
                                                    style={{ color: "#475569" }}
                                                  >
                                                    <span className="font-semibold">
                                                      Dosage:
                                                    </span>{" "}
                                                    <span
                                                      style={{
                                                        color: "#64748B",
                                                      }}
                                                    >
                                                      {presc.dosage}
                                                    </span>
                                                  </p>
                                                )}
                                                <p
                                                  className="text-xs"
                                                  style={{ color: "#475569" }}
                                                >
                                                  <span className="font-semibold">
                                                    Date Issued:
                                                  </span>{" "}
                                                  <span
                                                    style={{ color: "#64748B" }}
                                                  >
                                                    {new Date(
                                                      presc.date
                                                    ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                      }
                                                    )}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="border-t p-5"
                                    style={{
                                      borderColor: "#E5E7EB",
                                      backgroundColor: "#F8FAFC",
                                    }}
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="mt-0.5">
                                        <div
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: "#CBD5E1" }}
                                        ></div>
                                      </div>
                                      <div>
                                        <h4
                                          className="text-sm font-bold"
                                          style={{ color: "#0F172A" }}
                                        >
                                          No Prescription Issued
                                        </h4>
                                        <p
                                          className="text-xs mt-1.5 leading-relaxed"
                                          style={{ color: "#475569" }}
                                        >
                                          This consultation was completed
                                          without medication requirements.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile & Records Tab */}
        {activeTab === "profile" && (
          <div>
            {/* Personal Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-bold" style={{ color: "#0F172A" }}>
                  Personal Information
                </h2>
              </div>
              <div className="card-body">
                {isEditing ? (
                  {
                    /* Edit form removed */
                  }
                ) : (
                  <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
                    <div className="profile-field flex flex-col items-center md:items-start">
                      <label
                        className="text-xs uppercase tracking-wide font-semibold"
                        style={{ color: "#475569" }}
                      >
                        Full Name
                      </label>
                      <p
                        className="text-base font-medium mt-1"
                        style={{ color: "#0F172A" }}
                      >
                        {profile?.name}
                      </p>
                    </div>
                    <div className="profile-field flex flex-col items-center md:items-start">
                      <label
                        className="text-xs uppercase tracking-wide font-semibold"
                        style={{ color: "#475569" }}
                      >
                        Email
                      </label>
                      <p
                        className="text-base font-medium mt-1"
                        style={{ color: "#0F172A" }}
                      >
                        {profile?.email}
                      </p>
                    </div>
                    <div className="profile-field flex flex-col items-center md:items-start">
                      <label
                        className="text-xs uppercase tracking-wide font-semibold"
                        style={{ color: "#475569" }}
                      >
                        Phone
                      </label>
                      <p
                        className="text-base font-medium mt-1"
                        style={{ color: "#0F172A" }}
                      >
                        {profile?.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-5 mt-8">
              <div
                className="rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
              >
                <div className="text-4xl font-bold mb-3">
                  {appointments.length}
                </div>
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: "#E0E7FF" }}
                >
                  Total Appointments
                </p>
              </div>
              <div
                className="rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: "#14B8A6", color: "#FFFFFF" }}
              >
                <div className="text-4xl font-bold mb-3">
                  {pastAppointments.length}
                </div>
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: "#CCFBF1" }}
                >
                  Completed
                </p>
              </div>
              <div
                className="rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
              >
                <div className="text-4xl font-bold mb-3">
                  {scheduledAppointments.length}
                </div>
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: "#E0E7FF" }}
                >
                  Upcoming
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
