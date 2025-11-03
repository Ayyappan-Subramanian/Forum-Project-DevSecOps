import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import postApi from "../api/postapi";
import PostCard from "../Components/postCard";
import publicApi from "../api/publicapi";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token, logout } = useContext(AuthContext);

  //New state for create post form
  const [showCreate, setShowCreate] = useState(false); 
  const [newTitle, setNewTitle] = useState(""); 
  const [newContent, setNewContent] = useState(""); 
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

useEffect(() => {
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await publicApi.get("/posts"); // no token added
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, []);


  //New function to handle create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setCreating(true);
    try {
      const res = await postApi.post(
        "/posts",
        { title: newTitle, content: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`, //pass JWT token from context
          },
        }
      );
      setPosts([res.data, ...posts]); // prepend new post
      setNewTitle("");
      setNewContent("");
      setShowCreate(false); // close the dialog
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading posts...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return <p className="text-center mt-5 text-muted">You are not logged in.</p>;

  return (
    <div className="container mt-4">

      {/*Create Post Button*/}
{user && (
  <div className="d-flex justify-content-center mb-4">
    <div className="card shadow-sm w-75">
      <div className="card-body text-center">
        <p className="text-muted mb-3 fs-5">
          What’s on your mind, <strong>{user.name}</strong>?
        </p>
        <button
          className="btn btn-success"
          onClick={() => setShowCreate(true)}
        >
          Create Post
        </button>
      </div>
    </div>
  </div>
)}

      

      {/* Create Post Dialog */}
      {showCreate && (
        <div className="mb-4 p-3 border rounded bg-light">
          <h5>Create New Post</h5>
          <form onSubmit={handleCreatePost}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <textarea
              className="form-control mb-2"
              placeholder="Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
            ></textarea>
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-success"
                disabled={creating}
              >
                {creating ? "Creating..." : "Submit Post"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 className="mb-4">All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}
