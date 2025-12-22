import React, { useRef, useState } from "react";
import logo from "../assets/hospital-logo.png";
import adminLogo from "../assets/admin-logo.png";

export default function About() {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full blur-3xl opacity-20"></div>
            <img
              src={logo}
              alt="Care Connect logo"
              className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full shadow-2xl ring-1 ring-white/50 object-cover"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-sky-800 to-gray-900 bg-clip-text text-transparent">
            Care Connect
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connecting patients, doctors, and healthcare administrators with a
            modern, secure, and intuitive platform for seamless care
            coordination.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              "Easy Booking",
              "Secure Records",
              "Fast Prescriptions",
              "24/7 Support",
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full bg-sky-50 text-sky-700 text-sm font-medium border border-sky-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-12">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 bg-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 hover:bg-sky-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get in Touch
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Instant Appointments",
              desc: "Book, reschedule or cancel appointments in seconds with real-time availability.",
            },
            {
              title: "Digital Prescriptions",
              desc: "Securely view and manage prescriptions from your doctor instantly.",
            },
            {
              title: "Dedicated Support",
              desc: "Our team is always ready to assist with any questions or technical issues.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl hover:border-sky-200 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-5">
            {/* Image side - just the raw image */}
            <div className="lg:col-span-2 p-8 lg:p-12 flex items-center justify-center bg-white">
              <img
                src={adminLogo}
                alt="Healthcare professional"
                className="w-80 h-80 lg:w-96 lg:h-96 object-cover"
              />
            </div>

            {/* Form side */}
            <div
              ref={formRef}
              className="lg:col-span-3 p-8 lg:p-12 lg:border-l border-gray-100"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                We'd love to hear from you! Fill out the form and we'll get back
                to you shortly.
              </p>

              {submitted && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-center gap-3 animate-fade-in">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Message sent successfully! We'll get back to you soon.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help you today?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-sky-600 text-white font-semibold rounded-xl shadow-lg hover:bg-sky-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
