// routes/chat.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require("../models/User");

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

    const allUsers = await User.find({});
    
    res.render('chat', { 
      allUsers,
      username: req.session.username,
      userId: req.session.userId,
      messages: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.render('chat', {
      allUsers,
      username: req.session.username,
      userId: req.session.userId,
      messages: []
    });
  }
});

router.get('/chat/:roomId', requireAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ room: roomId })
      .populate('sender', 'username')
      .sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.json({ messages: [] });
  }
});


router.delete("/chat/:roomId", requireAuth, async(req, res) => {
  try {
    const {roomId} = req.params;
    await Message.deleteMany({room: roomId});
    res.redirect("/chat");
  } catch(error) {
    console.error("Error fetching messages:", error);
  }
});

module.exports = router;