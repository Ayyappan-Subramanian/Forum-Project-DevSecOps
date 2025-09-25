import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          by {post.author} on {new Date(post.createdAt).toLocaleDateString()}
        </h6>
        <p className="card-text">{post.content.substring(0, 150)}...</p>
        <p className="mb-2">
          <span className="me-3"> {post.comments.length} comments</span>
          <span>👍 {post.likes.length} likes</span>
        </p>
        <Link to={`/posts/${post._id}`} className="card-link">
          Read More
        </Link>
      </div>
    </div>
  );
}
