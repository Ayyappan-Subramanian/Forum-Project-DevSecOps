// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

//Create global context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //State for logged-in user
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  //console.log(jwtDecode(token));

  //Check for token in localStorage on app load
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        console.log(decodedUser);
        setUser(decodedUser);
        setToken(storedToken);
      } catch {
        sessionStorage.removeItem("token");
      }
    }
  }, []);

  const login = (jwtToken) => {
    sessionStorage.setItem("token", jwtToken);
    const decodedUser = jwtDecode(jwtToken);
    setUser(decodedUser);
    setToken(jwtToken);
    console.log(decodedUser);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  //Provide user and setUser to all children
  return (
    <AuthContext.Provider value={{ user, token, setUser, login, logout }}>
      {/*Render all children components inside provider */}
      {children}
    </AuthContext.Provider>
  );
};
