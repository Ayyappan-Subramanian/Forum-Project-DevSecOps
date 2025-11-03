import logo from './logo.svg';
import './App.css';
import Message from './Message';
import ListGroup from './Components/ListGroup';
import Login from './pages/login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/register';
import Home from './pages/home';
import PostCard from './Components/postCard';
import PostDetail from './pages/postDetails';
import MyPosts from './pages/mypost';
import Navbar from "./Components/navbar";
import ProtectedRoute from "./protectedroutes";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Message />} />
        <Route path="/lg" element={<ListGroup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypost"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>  
//  <div>
  //  <Message />
    //<ListGroup />
  //</div>
);

}

export default App;
