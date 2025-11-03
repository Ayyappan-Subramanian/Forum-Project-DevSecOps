const express = require('express'); //importing the express package
const router = express.Router(); //Create a new router object to define modular routes
const Post = require('../models/post'); //importing the post.js schema reference
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');


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
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    //console.log("REQ.USER:", req.user);
    console.log("REQ.USER:", req.user);
    const { title, content } = req.body;
    const author = req.user.name;
    const newPost = new Post({ title, content, author });
    const savedPost = await newPost.save(); //newPost.save() Post.find() are mongoose methods to interact with Mongoose DB
    res.status(201).json(savedPost);//because the variable name you used to import is Post so Post.find(), but ideally it could be anything
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  //const author = req.user.name;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  }

  catch (error) {
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

// Delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    console.log("Deleting Post:", post.author, "Req User:", req.user.name);

    if (post.author !== req.user.name) // Only the creator can delete
      return res.status(403).json({ message: 'You can only delete your own post' });

    // Use deleteOne instead of remove
    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

//To post a comment
router.post('/:id/comments', authMiddleware, async (req, res) =>{
  try{
  //const {author, text} = req.body;
  const { text } = req.body;
  const author = req.user.name;
  const cmt = await Post.findById(req.params.id);
  if (!cmt) return res.status(404).json({message: 'Post not Found'});

  cmt.comments.push({author, text});
  await cmt.save();
  //res.status(201).json(cmt);
  const addedComment = cmt.comments[cmt.comments.length - 1];
  res.status(201).json(addedComment); 
  }
  catch(error){
  res.status(500).json({message: 'Error Adding Comment', error});
  }
})


//Delete a comment
router.delete('/:id/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    console.log("Deleting Comment:", comment.author, "Req User:", req.user.name);

    if (comment.author !== req.user.name)
      return res.status(403).json({ message: 'You can only delete your own comment' });

    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (post.likes.some((id) => id.equals(userObjectId))) {
      return res.status(400).json({ message: 'You already liked this post da' });
    }

    //if(post.likes.includes(userId)){ //post.likes.includes() - includes is a inbuilt method, post.likes comes from the post schema and you have an array called likes inside post so referred as post.like
      //return res.status(400).json({message: 'You already liked this post'});
    //}

    post.likes.push(userObjectId);
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
    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message: 'Post not found'});

    const userObjectId = new mongoose.Types.ObjectId(userId);

    post.likes = post.likes.filter(
   (id) => id && id.equals && !id.equals(userObjectId)
   );

  //post.likes = post.likes.filter(id => !id.equals(userObjectId));


    //post.likes = post.likes.filter(id => id.toString() !== userObjectId.toString()); //!= loosely not equal (compares only value), !== strictly not equal (compares both value and type)
    await post.save(); //You cannot save or update just a sub-array independently; you have to update the parent 
    //That is why we have post.save and not post.likes.save();

    res.status(200).json({message: 'Like Removed', likesCount: post.likes.length});
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Error unliking post', error: error.message || error });
  }
})



module.exports = router;
