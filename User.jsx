import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import Home from "./Home";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
function User() {
  const [users, setUsers] = useState([]);
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
    axios.get(`http://localhost:3000/users?page=${page}`, {
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        setUsers(response.data.users);
        setCurrentuser(response.data.current_user);
        setCount(response.data.count);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [page]);

  return (
    <div className="container mt-4">
   
      <h1 className="text-primary text-center mb-4">Users List</h1>
      <ul className="list-group mb-3">
        {users.map((user) => (
          <li key={user.id} className="list-group-item">
            <Link to={`/users/${user.id}`} className="text-decoration-none">
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
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

export default User;