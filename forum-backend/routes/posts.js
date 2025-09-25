const express = require('express'); //importing the express package
const router = express.Router(); //Create a new router object to define modular routes
const Post = require('../models/post'); //importing the post.js schema reference

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});


// Create a post
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = new Post({ title, content, author });
    const savedPost = await newPost.save(); //newPost.save() Post.find() are mongoose methods to interact with Mongoose DB
    res.status(201).json(savedPost);//because the variable name you used to import is Post so Post.find(), but ideally it could be anything
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
});

// Update a post by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true, runValidators: true }
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
});

// Delete a post by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
});


//To post a comment
router.post('/:id/comments', async (req, res) =>{
  try{
  const {author, text} = req.body;
  const cmt = await Post.findById(req.params.id);
  if (!cmt) return res.status(404).json({message: 'Post not Found'});

  cmt.comments.push({author, text});
  await cmt.save();
  res.status(201).json(cmt);
  }
  catch(error){
  res.status(500).json({message: 'Error Adding Comment', error});
  }
})


//Delete a comment
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found', post });

    // Remove comment by its _id
    post.comments = post.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );

    await post.save();
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
});

//Update a comment

router.put('/:id/comments/:commentsId', async (req, res) => {
  try{
    const {author, text} = req.body;

    const post = await Post.findById(req.params.id);
    if(!post) return res.status(400).json({message: 'Post Not Found'});

    const comments = post.comments.id(req.params.commentsId);
    if(!comments) return res.status(404).json({message: 'No such comments'});
    
    if(comments.author !== author) return res.status(403).json({message: 'You can update only your own comment'});

    comments.text = text;
    await post.save();
    res.json(post.comments);
  }

  catch (error) {
    res.status(500).json({message: 'error updating comment', error})
    } 
})

//Like a post
router.post('/:id/like', async (req, res) => {
  try{
    const {userId} = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({message: 'Post not found'});

    if(post.likes.includes(userId)){ //post.likes.includes() - includes is a inbuilt method, post.likes comes from the post schema and you have an array called likes inside post so referred as post.like
      return res.status(400).json({message: 'You already liked this post'});
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json({message: 'Post Liked', likesCount: post.likes.length});
  } 
  catch (error){
      res.status(500).json({message: 'Error liking the post', error});
    }
})

//Removing a like
router.post('/:id/unlike', async (req, res) => {
  try{
    const {userId} = req.body;

    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message: 'Post not found'});

    post.likes = post.likes.filter(id => id.toString() !== userId); //!= loosely not equal (compares only value), !== strictly not equal (compares both value and type)
    await post.save(); //You cannot save or update just a sub-array independently; you have to update the parent 
    //That is why we have post.save and not post.likes.save();

    res.status(200).json({message: 'Like Removed', likesCount: post.likes.length});
  } catch (error) {
    res.status(500).json({message: 'Error liking post', error});
  }
})



module.exports = router;
