import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email
    };
  } catch {
    return null;
  }
}