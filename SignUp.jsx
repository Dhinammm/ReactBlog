import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./Home";
import { Link } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/users", {
        user: { name, email, password, password_confirmation: passwordConfirmation },
      });

      alert("Account created successfully!");
      window.location.href = "/";
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Something went wrong! Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center text-success mb-4">Sign Up</h2>

            {errors.length > 0 && (
              <div className="alert alert-danger">
                <ul className="mb-0">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="needs-validation">
              <div className="mb-3">
                <label className="form-label fw-bold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter your password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-success square-btn fw-bold">
                  Create Account
                </button>
              </div>
            </form>

            <div className="text-center mt-3">
              <a href="/users/sign_in">Log in</a> | <a href="/">Home</a>
            </div>
          </div>
         
        </div>
      </div>

      <style>
        {`
          .square-btn {
            border-radius: 0 !important;
          }
        `}
      </style>
    </div>
  );
}

export default SignUp;
