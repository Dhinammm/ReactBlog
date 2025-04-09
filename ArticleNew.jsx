import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import SignOutButton from "./SignOutButton";

function ArticleNew() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const navigate = useHistory();

  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
  axios.defaults.headers.common["X-CSRF-Token"] = csrf;
  

  function titlehandler(event) {
    setTitle(event.target.value);
  }

  function contenthandler(event) {
    setContent(event.target.value);
  }

  function Cancel() {
    navigate.push("/articles");
  }

  function createhandler() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
  
    axios
      .post(
        "http://localhost:3000/articles",
        { title, content },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setAlertMessage("Article created successfully.");
        setAlertType("success");
        navigate.push('/');
      })
      .catch((error) => {
        setAlertMessage("Article created successfully.");
        setAlertType("success");
        navigate.push('/');
      });
  }
  
  

  return (
    <div className="container mt-5">
     <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Create a New Article</h2>

        {alertMessage && (
          <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
            {alertMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlertMessage("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-bold">Title</label>
          <input
            type="text"
            className="form-control"
            onChange={titlehandler}
            value={title}
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Content</label>
          <textarea
            className="form-control"
            rows="6"
            onChange={contenthandler}
            value={content}
            placeholder="Write your article content here..."
            required
          ></textarea>
        </div>

        <div className="d-flex justify-content-between">
          <button onClick={createhandler} className="btn btn-success px-4 fw-bold">
            Submit
          </button>
          <button onClick={Cancel} className="btn btn-dark px-4 fw-bold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArticleNew;
