const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";
const USER_KEY = "auth_user";

export function setAuth(token, role, userInfo = {}) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
}
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}
export function getUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : {};
  } catch (e) {
    return {};
  }
}
export function isAuthenticated() {
  return !!getToken();
}
export function hasRole(roles) {
  if (!roles || roles.length === 0) return true;
  const role = getRole();
  return Array.isArray(roles) ? roles.includes(role) : roles === role;
}
export function doctorLogin(credentials) {
  // ...existing code...
  // After successful login, redirect to the doctor-home page
  location.hash = "#/doctor-home";
}
