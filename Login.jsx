import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "danger"

  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
  axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;

  function handleLogin(event) {
    event.preventDefault();

    axios
      .post("/users/sign_in", {
        user: { email, password },
      })
      .then(() => {
        setAlertMessage("Login successful!");
        setAlertType("success");
        setTimeout(() => (window.location.href = "/"), 1500); // Redirect after showing success
      })
      .catch(() => {
        setAlertMessage("Invalid email or password");
        setAlertType("danger");
      });
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center text-primary mb-4">Log in</h2>

            {alertMessage && (
              <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                {alertMessage}
                <button type="button" className="btn-close" onClick={() => setAlertMessage("")}></button>
              </div>
            )}

            <form onSubmit={handleLogin} className="needs-validation">
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  required
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary square-btn fw-bold">
                  Log in
                </button>
              </div>
            </form>

            <div className="text-center mt-3">
              <a href="/users/sign_up">Sign up</a> | <a href="/users/password/new">Forgot password?</a>
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

export default Login;
