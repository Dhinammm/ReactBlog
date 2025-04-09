import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [current_user, setCurrentuser] = useState(null);
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
    axios
      .get(`http://localhost:3000/articles?page=${page}`, {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        setArticles(response.data.articles);
        setCurrentuser(response.data.current_user);
        setCount(response.data.count);
       
      })
      .catch((error) => {
        console.error(error);
      });
  }, [page]);

  return (
    <div
      className="container mt-4 p-4 rounded shadow-lg"
      style={{
        background: "linear-gradient(to right, #f8f9fa, #e3f2fd)",
        minHeight: "100vh",
      }}
    >
    <h1 className="text-center mb-2 text-dark">Articles List</h1>

{current_user && (
  <div className="d-flex justify-content-start mb-4">
    <Link
      to="/articles/new"
      className="btn btn-info fw-bold px-4 py-2 rounded shadow-sm"
    >
      Create Article
    </Link>
  </div>
)}


     

      <ul className="list-group mb-3">
        {articles.map((article) => (
          <li
            key={article.id}
            className="list-group-item border-0 shadow-sm rounded mb-2"
          >
            <Link
              to={`/articles/${article.id}`}
              className="text-decoration-none fw-bold text-dark"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between">
        <Link
          to="/users"
          className="btn btn-outline-secondary fw-bold px-4 py-2 rounded shadow-sm"
        >
          See all authors
        </Link>

        
        
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
  );
}

export default Articles;
