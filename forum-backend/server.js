require('dotenv').config();
//const Post = require('./models/post'); //importing the post.js. Now you don't need to import because it is imported in routes/posts.js


const express = require('express'); // 2
const cors = require('cors');
const mongoose = require('mongoose'); // 3
const postsRoutes = require('./routes/posts'); //imports routes/posts.js
const userRoutes = require('./routes/users');

const app = express(); 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true  // allow cookies if you are using them
}));
app.use(express.json());          // 5

mongoose.connect('mongodb+srv://ForumApp:MxIZA53B1@forumapp.rvjzldm.mongodb.net/forumdb?retryWrites=true&w=majority&appName=ForumApp', {})
.then(() => console.log('MongoDB Connected'))  // 7
.catch(err => console.error('MongoDB connection error:', err)); // 8

app.get('/', (req, res) => {       // 9
  res.send('API odudhu');          // 10
});

app.use('/api/posts', postsRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;  // 11
app.listen(PORT, () => {                 // 12
  console.log(`Server is running on port ${PORT}`); // 13
});
