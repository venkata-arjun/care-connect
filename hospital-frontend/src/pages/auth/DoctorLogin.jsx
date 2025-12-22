import { setAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import { useState } from "react";
import Toast from "../../components/Toast";
import loginLogo from "../../assets/doctor-login.jpg";
import adminLogo from "../../assets/admin-logo.png";
import hospitalLogo from "../../assets/hospital-logo.png";

export function DoctorLogin() {
  const [toast, setToast] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const { data } = await api.post("/auth/login", payload);
      if (data.role !== "DOCTOR") {
        setToast({
          type: "error",
          message: "This login is not a doctor account.",
        });
        return;
      }
      setAuth(data.token, data.role);
      location.hash = "#/doctor-home";
    } catch (err) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Login failed",
      });
    }
  }

  const onCloseToast = () => setToast(null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 admin-page">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col items-center mb-6 site-header">
          <img
            src={hospitalLogo}
            alt="Care Connect"
            className="site-logo rounded-md mb-2"
          />
          <div className="text-2xl font-extrabold">Care Connect</div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <img
              src={adminLogo}
              alt="Admin"
              className="rounded-xl w-64 h-64 object-cover block md:hidden transform transition-transform duration-200 mx-auto"
            />
            <img
              src={loginLogo}
              alt="Login"
              className="rounded-xl w-full max-w-md object-cover hidden md:block"
            />
          </div>

          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold">Doctor Login</h2>
            </div>

            <div className="hero-card relative">
              {toast && (
                <Toast
                  position="inline"
                  duration={5000}
                  type={toast.type}
                  message={toast.message}
                  onClose={onCloseToast}
                />
              )}
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input className="input" name="email" type="email" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    className="input"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <button className="btn-primary w-full" type="submit">
                  Login
                </button>
              </form>

              <div className="mt-4 text-sm muted">
                Accounts are provisioned by Admin only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
