import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import postApi from "../api/postapi"; // axios instance for posts
import { AuthContext } from "../context/AuthContext";
import publicApi from "../api/publicapi";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext); // current logged-in user
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await publicApi.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLikeToggle = async () => {
    if (!user) {
      alert("You must be logged in to like/unlike a post!");
      return;
    }

    try {
      if (post.likes.includes(user.id)) {
        await postApi.post(`/posts/${post._id}/unlike`, { userId: user.id });
        setPost({ ...post, likes: post.likes.filter((id) => id !== user.id) });
      } else {
        await postApi.post(`/posts/${post._id}/like`, { userId: user.id });
        setPost({ ...post, likes: [...post.likes, user.id] });
      }
    } catch (err) {
      console.error("Error toggling like:", err.response?.data || err);
      alert(err.response?.data?.message || "Error toggling like");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to comment!");
      return;
    }
    if (!commentText.trim()) return;

  try {
    const res = await postApi.post(
      `/posts/${post._id}/comments`,
      { text: commentText },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
      // Add new comment to state
      setPost({ ...post, comments: [...post.comments, res.data] });
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err);
      alert(err.response?.data?.message || "Error adding comment");
    }
  };

  //Delete comment handler
const { token } = useContext(AuthContext); // get token

const handleDeleteComment = async (commentId) => {
  try {
    await postApi.delete(`/posts/${post._id}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`, //Add this
      },
    });
    setPost({
      ...post,
      comments: post.comments.filter((c) => c._id !== commentId),
    });
  } catch (err) {
    console.error("Error deleting comment:", err.response?.data || err);
    alert(err.response?.data?.message || "Error deleting comment");
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <p className="text-muted">by {post.author}</p>
      <p>{post.content}</p>

      <button
        className={`btn ${post.likes.includes(user?._id) ? "btn-primary" : "btn-outline-primary"} mb-3`}
        onClick={handleLikeToggle}
      >
        {post.likes.length} {post.likes.includes(user?._id) ? "Liked" : "Like"}
      </button>

      <div className="mt-4">
        <h4>Comments</h4>
        {post.comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="list-group mb-3">
            {post.comments.map((c) => (
              <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>{c.author}</strong> &middot; {c.text}
                </span>
                {/* Delete button for comment author */}
                {user && user.name === c.author && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteComment(c._id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddComment}>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}
