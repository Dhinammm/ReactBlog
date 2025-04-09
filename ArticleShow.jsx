import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Home";

function ArticleShow() {
  const [article, setArticle] = useState([]);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");
  const [comments, setComments] = useState([]);
  const [userNotLogged, setuserNotLogged] = useState(false);
  const [content, setContent] = useState("");
  const { id } = useParams();
  const [currentUser, setcurrentUser] = useState(0);
  const [showUndo, setshowUndo] = useState(false);
  const [timeOut, setTimeOut] = useState(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const history = useHistory();
  
  const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
  axios.defaults.headers["X-CSRF-Token"] = csrf;

  function increment() {
    setPage(page + 1);
  }

  function decrement() {
    if (page === 1) return;
    setPage(page - 1);
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3000/articles/${id}?page=${page}`, {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        if (response.data.not_found) {
          alert("Go back")
          history.push(`/not_found`);
        } else {
          setArticle(response.data.article);
          setComments(response.data.comments);
          setUser(response.data.user);
          setAuth(response.data.res);
          setuserNotLogged(response.data.user_not_logged);
          setcurrentUser(response.data.current_user_id);
          setCount(response.data.count);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page]);

  const handleUndo = () => {
    clearTimeout(timeOut);
    setshowUndo(false);
    alert("Undo successful. Article not deleted.");
  };

  function deleteHandler() {
    const confirm = window.confirm("Are you sure wanna delete the article?");
    if (!confirm) return;

    setshowUndo(true);
    const timeout = setTimeout(() => {
      axios
        .delete(`http://localhost:3000/articles/${id}`)
        .then(() => history.push(`/articles`))
        .catch((error) => {
          console.error("Error deleting article:", error);
        });

      setshowUndo(false);
    }, 5000);
    setTimeOut(timeout);
  }

  function deleteComments(comment_id) {
    const confirm = window.confirm("This comment will be deleted. Are you sure?");
    if (!confirm) return;
    axios
      .delete(`http://localhost:3000/articles/${article.id}/blog_comments/${comment_id}`)
      .then(() => window.location.href = `/articles/${article.id}`);
  }

  function contentHandler(event) {
    setContent(event.target.value);
  }

  function addComment() {
    if (content.trim() !== "") {
      axios.post(`http://localhost:3000/articles/${article.id}/blog_comments`, { content })
        .then(() => {
          alert("Comment posted successfully");
          history.push(`/articles/${article.id}`);
          window.location.reload();
        })
        .catch(error => {
          alert("An error occurred: " + error.message);
        });
    } else {
      alert("Please write some content to post.");
    }
  }
 
  return (
    <div>
      <div className="position-relative">
        <div className="position-absolute top-0 start-0 m-3">
          <Link to="/articles" className="btn btn-outline-dark">
            ← Back
          </Link>
        </div>

        <div className="container mt-5 p-4 bg-white rounded shadow-lg">
          <h1 className="text-primary text-center mb-3">{article.title}</h1>

          <p className="lead">{article.content}</p>

          <div><b>Author: </b><b className="text-info">{user.name}</b></div>
          <hr />

          {!userNotLogged && (
            <div className="mb-3">
              <h5>Add Comment</h5>
              <textarea
                rows="4"
                className="form-control"
                onChange={contentHandler}
                value={content}
                placeholder="Write a comment..."
              ></textarea>
              <button className="btn btn-primary mt-2" onClick={addComment}>
                Add Comment
              </button>
            </div>
          )}

          <h3 className="mt-4">Comments</h3>
          <ul className="list-group">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {comment.content}
                {comment.user_id === currentUser && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteComments(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>

          {auth && (
            <div className="mt-4 d-flex gap-2">
              <Link to={`/articles/${article.id}/edit`} className="btn btn-warning">
                Edit article
              </Link>
              <button className="btn btn-danger" onClick={deleteHandler}>
                Delete article
              </button>
            </div>
          )}

          {showUndo && (
            <div className="alert alert-warning mt-3 d-flex justify-content-between align-items-center">
              <span>Article "{article.title}" scheduled for deletion.</span>
              <button className="btn btn-outline-dark btn-sm" onClick={handleUndo}>
                Undo
              </button>
            </div>
          )}

          {/* Pagination Controls */}
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
    </div>
  );
}

export default ArticleShow;
