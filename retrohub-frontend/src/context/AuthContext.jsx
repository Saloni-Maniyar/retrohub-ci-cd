import { createContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

    // change: make sure stored token (if exists) is properly validated and user restored
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          // token expired
          sessionStorage.removeItem("token");
          setToken(null);
          setIsLoggedIn(false);
        } else {
          // change: restore token and user after login
          setToken(storedToken);
          setIsLoggedIn(true);
          setUser({ id: decoded.id, email: decoded.email });
        }
      } catch {
        sessionStorage.removeItem("token");
        setToken(null);
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, []); // change: runs once to restore token on refresh or after login redirect

  // logout function
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  // change: wrapped context in useMemo for stable value
  const contextValue = useMemo(
    () => ({ isLoggedIn, logout, setIsLoggedIn, token, setToken, user, setUser }),
    [isLoggedIn, token, user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
