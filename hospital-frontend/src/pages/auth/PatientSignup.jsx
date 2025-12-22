import { setAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import loginLogo from "../../assets/about-logo.jpg";
import hospitalLogo from "../../assets/hospital-logo.png";
import adminLogo from "../../assets/admin-logo.png";

export function PatientSignup() {
  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      phone: form.get("phone"),
      role: "PATIENT",
    };
    try {
      const { data } = await api.post("/auth/signup", payload);
      if (data.role !== "PATIENT") {
        alert("Unexpected role in response.");
        return;
      }
      setAuth(data.token, data.role, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      });
      location.hash = "#/patient-profile";
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  }

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
              className="rounded-xl w-64 h-64 object-cover block md:hidden mx-auto"
            />
            <img
              src={loginLogo}
              alt="Signup"
              className="rounded-xl w-full max-w-md object-contain hidden md:block"
            />
          </div>

          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold">Patient Sign up</h2>
            </div>

            <div className="hero-card">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input className="input" name="name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input className="input" name="email" type="email" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input className="input" name="phone" type="tel" required />
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
                  Create account
                </button>
              </form>

              <div className="mt-4 text-center text-sm muted">
                Already have an account?{" "}
                <a href="#/login" className="text-primary-600 hover:underline">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
