import { useEffect, useMemo, useState } from "react";
import BackButton from "./components/BackButton";
import { isAuthenticated, getRole, clearAuth } from "./lib/auth";
import { PatientLogin } from "./pages/auth/PatientLogin.jsx";
import { PatientSignup } from "./pages/auth/PatientSignup.jsx";
import { DoctorLogin } from "./pages/auth/DoctorLogin.jsx";
import { AdminLogin } from "./pages/auth/AdminLogin.jsx";
import { PatientProfile } from "./pages/patient/PatientProfile.jsx";
import { PatientDashboard } from "./pages/patient/PatientDashboard.jsx";
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { DoctorProfile } from "./pages/doctor/DoctorProfile.jsx";
import Home from "./pages/Home.jsx";
import logoImg from "./assets/hospital-logo.png";
import About from "./pages/About.jsx";

function Header({ currentHash }) {
  const authed = isAuthenticated();
  const role = getRole();
  const [menuOpen, setMenuOpen] = useState(false);
  let dashboard = "#/";
  if (role === "ADMIN") dashboard = "#/admin";
  else if (role === "DOCTOR") dashboard = "#/doctor";
  else dashboard = "#/patient-profile";

  // Minimal header for home page
  if (currentHash === "#/" || currentHash === "") {
    return (
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
          <a href="#/" className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Care Connect"
              className="site-logo rounded-md"
            />
            <span className="text-2xl font-extrabold">Care Connect</span>
          </a>

          <nav className="hidden sm:flex items-center gap-2">
            <a
              href="#/"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Home
            </a>
            <a
              href="#/about"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              About
            </a>

            {authed ? (
              <>
                <a
                  href={dashboard}
                  className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </a>
                <button
                  onClick={() => {
                    clearAuth();
                    location.hash = "#/login";
                  }}
                  className="ml-2 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : null}
          </nav>

          {/* Mobile menu button (always visible) */}
          <div className="sm:hidden">
            <>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                aria-label="Open menu"
                className="p-2 rounded-md border border-gray-200 bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {menuOpen ? (
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>

              {menuOpen ? (
                <div className="absolute right-4 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <div className="p-2">
                    <a
                      href="#/"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Home
                    </a>
                    <a
                      href="#/about"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      About
                    </a>

                    {authed ? (
                      <>
                        <a
                          href={dashboard}
                          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Dashboard
                        </a>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            clearAuth();
                            location.hash = "#/login";
                          }}
                          className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
        <a href="#/" className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Care Connect"
            className="site-logo rounded-md"
          />
          <span className="text-2xl font-extrabold">Care Connect</span>
        </a>
        <nav className="hidden sm:flex items-center gap-2">
          <a
            href="#/"
            className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Home
          </a>
          <a
            href="#/about"
            className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            About
          </a>
          {authed ? (
            <>
              <a
                href={dashboard}
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </a>
              <button
                onClick={() => {
                  clearAuth();
                  location.hash = "#/login";
                }}
                className="ml-2 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : null}
        </nav>

        {/* Mobile menu button (always visible) */}
        <div className="sm:hidden">
          <>
            <button
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Open menu"
              className="p-2 rounded-md border border-gray-200 bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {menuOpen ? (
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </button>

            {menuOpen ? (
              <div className="absolute right-4 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <div className="p-2">
                  <a
                    href="#/"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Home
                  </a>
                  <a
                    href="#/about"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    About
                  </a>

                  {authed ? (
                    <>
                      <a
                        href={dashboard}
                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </a>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          clearAuth();
                          location.hash = "#/login";
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        </div>
      </div>
    </header>
  );
}

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function App() {
  const hash = useHashRoute();
  const authed = isAuthenticated();
  const role = getRole();

  const Route = useMemo(() => {
    switch (hash) {
      case "#/login":
        return () => <PatientLogin />;
      case "#/signup":
        return () => <PatientSignup />;
      case "#/doctor-login":
        return () => <DoctorLogin />;
      case "#/admin-login":
        return () => <AdminLogin />;
      case "#/patient-profile":
        return () =>
          authed && role === "PATIENT" ? <PatientProfile /> : <AccessDenied />;
      case "#/doctor":
        return () =>
          authed && role === "DOCTOR" ? <DoctorDashboard /> : <AccessDenied />;
      case "#/admin":
        return () =>
          authed && role === "ADMIN" ? <AdminDashboard /> : <AccessDenied />;
      case "#/doctor-profile":
        return () =>
          authed && role === "DOCTOR" ? <DoctorProfile /> : <AccessDenied />;
      case "#/doctor-home":
        return () => (
          <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <button
              onClick={() => (location.hash = "#/doctor-profile")}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              Go to Profile
            </button>
            <button
              onClick={() => (location.hash = "#/doctor")}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Go to Dashboard
            </button>
          </div>
        );
      case "#/about":
        return () => <About />;
      case "#/":
      default:
        return () => <Home />;
    }
  }, [hash, authed, role]);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Header currentHash={hash} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {hash !== "#/" && (
          <div className="mb-4">
            <BackButton />
          </div>
        )}
        <Route />
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Hospital App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="card">
      <div className="card-header">Access denied</div>
      <div className="card-body">
        You don't have permission to view this page.
      </div>
    </div>
  );
}

export default App;
