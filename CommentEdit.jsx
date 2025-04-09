import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function CommentEdit() {
    //const [comment, setComment] = useState("");
    const [content, setContent] = useState("");
    const { id } = useParams(); 
    const { article_id } = useParams();
        
    useEffect(() => {
        axios.get(`http://localhost:3000/articles/${article_id}/blog_comments/${id}`, { headers: { Accept: "application/json" } })
            .then(response => {
                setContent(response.data.comment.content);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    function updateHandler() {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (!csrfToken) {
            console.error("CSRF token missing");
            return;
        }

        axios.put(`/articles/${article_id}/blog_comments/`, 
            { comment: { id, content } },
            {
                headers: {
                    "X-CSRF-Token": csrfToken,
                    "Content-Type": "application/json",
                },
            }
        )
        .then(response => {
            alert("Comment updated successfully");
            window.location.href = `/articles/${id}`;
        })
        .catch(error => {
            alert("Error updating article");
        });
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-center mb-4">Edit Comment</h2>
                {console.log('333333333333333333333333333333333333333333333333333333333333333333333333')}
             

                <div className="mb-3">
                    <label className="form-label fw-bold">Content</label>
                    <textarea 
                        rows="5" 
                        className="form-control"
                        onChange={(e) => setContent(e.target.value)} 
                        value={content}
                    />
                </div>

                <div className="d-flex justify-content-end mt-3">
    <Link to={`/articles/${id}`} className="btn btn-secondary fw-bold px-4 py-2 me-2">
        Cancel
    </Link>
    
    <button 
        onClick={updateHandler} 
        className="btn btn-success fw-bold px-4 py-2"
    >
        Submit changes
    </button>
</div>

            </div>
        </div>
    );
}

export default CommentEdit;
