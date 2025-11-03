// src/pages/MyPosts.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import postApi from "../api/postapi";
import PostCard from "../Components/postCard";
import publicApi from "../api/publicapi";

export default function MyPosts() {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch posts by logged-in user
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      try {
        const res = await publicApi.get("/posts");
        // Filter posts by author
        const myPosts = res.data.filter((p) => p.author === user.name);
        setPosts(myPosts);
      } catch (err) {
        console.error(err);
        setError("Failed to load your posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setCreating(true);
    try {
      const res = await postApi.post(
        "/posts",
        { title: newTitle, content: newContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts([res.data, ...posts]); // prepend new post
      setNewTitle("");
      setNewContent("");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await postApi.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await postApi.delete(`/posts/${postId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(
        posts.map((p) => {
          if (p._id === postId) {
            return { ...p, comments: p.comments.filter((c) => c._id !== commentId) };
          }
          return p;
        })
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading your posts...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Posts</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowCreate(!showCreate)}
      >
        {showCreate ? "Cancel" : "Create New Post"}
      </button>

      {showCreate && (
        <form className="mb-4" onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Title"
            className="form-control mb-2"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            className="form-control mb-2"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button type="submit" className="btn btn-success" disabled={creating}>
            {creating ? "Creating..." : "Create Post"}
          </button>
        </form>
      )}

      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            showDelete={true}
            onDeletePost={() => handleDeletePost(post._id)}
            onDeleteComment={handleDeleteComment}
            user={user}
          />
        ))
      )}
    </div>
  );
}
