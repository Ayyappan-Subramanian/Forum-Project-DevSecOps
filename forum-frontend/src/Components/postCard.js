import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post, user, onDeletePost }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          by {post.author} on {new Date(post.createdAt).toLocaleDateString()}
        </h6>
        <p className="card-text">{post.content.substring(0, 150)}...</p>
        <p className="mb-2">
          <span className="me-3">{post.comments.length} comments</span>
          <span> {post.likes.length} likes</span>
        </p>

        {/* Delete Post Button */}
        {user && user.name === post.author && (
          <button
            className="btn btn-danger btn-sm mb-2 me-2"
            onClick={() => onDeletePost(post._id)}
          >
            Delete Post
          </button>
        )}

        <Link to={`/posts/${post._id}`} className="card-link">
          Read More
        </Link>
      </div>
    </div>
  );
}
