import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import axios from "axios";
import Home from "./Home";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";

function UserShow() {
  const [user, setUser] = useState({ id: 0, name: "" });
  const [auth, setAuth] = useState(true);
  const [articles, setArticles] = useState([]);
  const [fake, setFake] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  const csrf = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  axios.defaults.headers["X-CSRF-Token"] = csrf;
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  function increment() {
    setPage(page + 1);
  }

  function decrement() {
    if (page === 1) return;
    setPage(page - 1);
  }
  
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${id}?page=${page}`, {
          headers: { Accept: "application/json" },
        });

        if (response.data.res === false) {
          setUser(response.data.user);
          setArticles(response.data.articles);
          setFake(response.data.fake);
          setAuth(false);
          setCount(response.data.count);
        } else {
          history.push("/not_found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [id,page]);

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      history.push(`/users`);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Back Button in its own row */}
      <div className="mb-3">
        <Link to="/articles" className="btn btn-outline-dark">
          ← Back
        </Link>
      </div>

      {/* Main User Card */}
      <div className="p-4 bg-blue text-light rounded shadow">
        <h3 className="mb-4 text-warning fw-bold">{user.name}</h3>

        <ul className="list-group list-group-flush mb-3">
          {articles.length > 0 ? (
            articles.map((article) => (
              <li key={article.id} className="list-group-item bg-blue text-light">
                <Link to={`/articles/${article.id}`} className="text-info">
                  {article.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-warning">User hasn't posted any articles.</li>
          )}
        </ul>

        
        <div className="row mt-5">

          <div className="col-md-6 d-flex flex-column align-items-start">
            {!fake && !auth && (
              <Link
                to="/articles/new"
                className="btn btn-success fw-bold shadow-sm mb-2"
              >
                Create Article
              </Link>
            )}
          </div>

          <div className="col-md-6 d-flex justify-content-end align-items-end">
            {!fake && (
              <button
                onClick={deleteHandler}
                className="btn btn-danger fw-bold shadow-sm"
              >
                Delete Account
              </button>
            )}
          </div>
         
        </div>
         {(page > 1 || count > page * 5) && (
            <div className="mt-4 d-flex justify-content-between">
              {page > 1 ? (
                <button
                  onClick={decrement}
                  className="btn btn-outline-primary px-4 py-2 shadow-sm rounded-pill"
                >
                  Prev
                </button>
              ) : <div></div>}

              {count > page * 5 && (
                <button
                  onClick={increment}
                  className="btn btn-outline-secondary px-4 py-2 shadow-sm rounded-pill"
                >
                  Next
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default UserShow;
