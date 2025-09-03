// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Login page
router.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/chat');
  }
  res.render('login', { error: null });
});

// Login handler
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    
    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    
    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    
    res.redirect('/chat');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'An error occurred during login' });
  }
});

// Register page
router.get('/register', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/chat');
  }
  res.render('register', { error: null });
});

// Register handler
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      return res.render('register', { error: 'Passwords do not match' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.render('register', { error: 'User already exists with this email or username' });
    }
    
    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    // Set session
    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    
    res.redirect('/chat');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'An error occurred during registration' });
  }
});

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

module.exports = router;