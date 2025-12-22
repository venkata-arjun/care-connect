import React from "react";

export default function BackButton({ className = "" }) {
  function goBack() {
    // Prefer history.back() so it works for SPA and normal navigation
    if (window.history.length > 1) window.history.back();
    else location.hash = "#/";
  }

  return (
    <button
      onClick={goBack}
      aria-label="Go back"
      className={
        "inline-flex items-center gap-2 text-sm font-semibold text-blue-600 " +
        className
      }
    >
      <span aria-hidden>←</span>
      Back
    </button>
  );
}
