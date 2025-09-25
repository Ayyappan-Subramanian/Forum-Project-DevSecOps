import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";      // your Axios instance
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required. Please enter");
      return;
    }

    setLoading(true);
    try {
      // POST request to your backend register endpoint
      const res = await api.post("/register", { username, email, password });
      // If backend returns a token + user
      if (res.data.message == "User created successfully") {
        //localStorage.setItem("token", res.data.token);
        //setUser(res.data.user);
        setSuccess(true);  // show the pop-up/alert
        setUserName("");       // optional: clear input fields
        setEmail("");
        setPassword("");
        //navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ minWidth: "350px", maxWidth: "400px" }}>
        <h2 className="card-title text-center mb-4">Create Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {success && (
            <div className="alert alert-success">
            Registration successful!{" "}
            <Link to="/login" className="alert-link">
                Click here to login
            </Link>
            </div>
        )}


        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <a href="/login">Login</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}
