const mongoose = require('mongoose');

//Defining comment schema for the post
const commentSchema = new mongoose.Schema({
  author:{type: String, required: true},
  text:{type: String, required: true},
  createdAt: {type: String, default: Date.now}
});


//defining the schema for the post request

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [commentSchema], //embedding the above created 
  
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'  // each like is tied to a user
    }
  ]
});

module.exports = mongoose.model('Post', postSchema);