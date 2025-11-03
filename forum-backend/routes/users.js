const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

//registering new user
router.post('/register', async (req, res) => {
    try{
        const {username, email, password} = req.body;

        //to check if the user already exists
        const existingUser = await User.findOne({email});
        if (existingUser)
          return res.status(400).json({message: 'User already exists'});

            //Hash the password before saving
        const salt = await bcrypt.genSalt(10);       // generate random salt
        const hashedPassword = await bcrypt.hash(password, salt);
        //create a new user with hashed password
        const newUser = new User({username, email, password: hashedPassword});
        //const newUser = new User({username, email, password}); //Creates a new instance of the User model and stores it in a variable newUser so that it can be referred easily later.
        const savedUser = await newUser.save();

        res.status(201).json({message: 'User created successfully'});

    } catch (error) {
        res.status(500).json({message: 'User creation unsuccesful', error});
    }

    
});

//user login
// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: email });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    //Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.username },    // payload
      'mysecretkey',                         // secret key (should come from env variable)
      { expiresIn: '1h' }                    // expires in 1 hour
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});


router.get('/profile', authMiddleware, async (req, res) => { //adding authMiddleware makes you check the token and allow to do the task only if logged in
  try {
    res.json({
      message: 'Welcome to your profile',
      user: req.user  // contains { id, email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

module.exports = router;