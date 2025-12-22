import { useEffect } from "react";

export default function Toast({
  type = "info",
  message = "",
  onClose = () => {},
  duration = 3500,
  position = "fixed",
}) {
  // Auto-dismiss after `duration`
  useEffect(() => {
    const t = setTimeout(() => onClose(), duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  // Inline position: centered, minimal red/green text
  if (position === "inline") {
    const colorClass =
      type === "error"
        ? "text-red-600"
        : type === "success"
        ? "text-green-600"
        : "text-gray-700";
    return (
      <div className="w-full flex justify-center">
        <div className={`${colorClass} text-sm text-center py-1`}>
          {message}
        </div>
      </div>
    );
  }

  const bgClass =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-gray-800";

  const containerStyle =
    position === "card-top"
      ? {
          position: "absolute",
          top: -46,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 40,
          width: "calc(100% - 32px)",
        }
      : { position: "fixed", top: 16, right: 16, zIndex: 60 };

  return (
    <div style={containerStyle}>
      <div
        className={`${bgClass} text-white shadow-lg rounded-md px-4 py-3 flex items-start space-x-3`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {type === "success" ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {type === "error"
              ? "Error"
              : type === "success"
              ? "Success"
              : "Notice"}
          </div>
          <div className="text-sm mt-0.5">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-white opacity-90 hover:opacity-100"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
