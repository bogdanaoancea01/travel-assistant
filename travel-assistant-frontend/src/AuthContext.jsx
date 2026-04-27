import { createContext, useContext, useState } from "react";
import { getUserFromToken } from "./utilities/getUserFromToken";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUserFromToken());
    
  const login = (token) => {
    sessionStorage.setItem("token", token);
    const userData = getUserFromToken();
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
