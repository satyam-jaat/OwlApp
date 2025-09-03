// routes/chat.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Chat page
router.get('/chat', requireAuth, async (req, res) => {
  try {
    // Get last 100 messages
    const messages = await Message.find({ room: 'general' })
      .populate('sender', 'username')
      .sort({ timestamp: 1 })
      .limit(100);
    
    res.render('chat', { 
      username: req.session.username,
      userId: req.session.userId,
      messages: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.render('chat', {
      username: req.session.username,
      userId: req.session.userId,
      messages: []
    });
  }
});

router.delete("/chat", requireAuth, async(req, res) => {
  try {
    await Message.deleteMany();
    res.redirect("/chat");
  } catch(error) {
    console.error("Error fetching messages:", error);
  }
});

module.exports = router;