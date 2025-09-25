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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Message />} />
        <Route path="/lg" element={<ListGroup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>  
//  <div>
  //  <Message />
    //<ListGroup />
  //</div>
);

}

export default App;
