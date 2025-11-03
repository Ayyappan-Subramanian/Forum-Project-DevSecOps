import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login page after logout
  };
if (user)
{
  return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/home">
              Forum App
            </Link>

            <div className="d-flex ms-auto align-items-center">
              {user && (
                <span className="me-3">Logged in as: <strong>{user.name}</strong></span>
              )}
              <Link className="btn btn-outline-primary me-2" to="/home">
                Home
              </Link>

              <Link className="btn btn-outline-primary me-2" to="/mypost">
                My Posts
              </Link>

              {user && (
                <button className="btn btn-outline-danger" onClick={handleLogout} to="/login">
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>
  );
}
}
