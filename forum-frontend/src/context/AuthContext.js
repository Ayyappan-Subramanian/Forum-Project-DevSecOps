// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

//Create global context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //State for logged-in user
  const [user, setUser] = useState(null);

  //Check for token in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      //Decode user info from token
      const decodedUser = jwtDecode(token);
      //Update state
      setUser(decodedUser);
    }
  }, []);

  //Provide user and setUser to all children
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {/*Render all children components inside provider */}
      {children}
    </AuthContext.Provider>
  );
};
