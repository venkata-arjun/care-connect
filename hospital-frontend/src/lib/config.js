export const CONFIG = {
  BASE_URL:
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : `http://${location.hostname}:5000`,
};
