// src/pages/PostDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postApi from "../api/postapi"; // axios instance for posts

export default function PostDetail() {
  const { id } = useParams(); // get post id from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postApi.get(`/posts/${id}`);
        setPost(res.data);
        console.log("fetched");
      } catch (err) {
        console.error(err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <p className="text-muted">by {post.author}</p>
      <p>{post.content}</p>
      <p>
        {post.comments.length} comments | 👍 {post.likes.length} likes
      </p>
      <div className="mt-4">
      <h4>Comments</h4>
      {post.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="list-group">
          {post.comments.map((c, i) => (
            <li key={i} className="list-group-item">
              <strong>{c.author}</strong> &middot;{" "}
              <br />
              {c.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
}
