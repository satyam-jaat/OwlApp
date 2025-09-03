// public/js/chat.js
let socket;
let currentUser;
let currentUserId;

function initChat(username, userId) {
    currentUser = username;
    currentUserId = userId;
    
    // Connect to Socket.io
    socket = io();
    
    // Join the general room
    socket.emit('join-room', 'general');
    
    // Set up event listeners
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Listen for incoming messages
    socket.on('chat-message', function(data) {
        addMessageToChat(data.sender, data.message, data.timestamp);
    });
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (message) {
        // Emit message to server
        socket.emit('chat-message', {
            senderId: currentUserId,
            senderName: currentUser,
            message: message,
            room: 'general'
        });
        
        // Clear input
        messageInput.value = '';
    }
}

// public/js/chat.js
function addMessageToChat(sender, message, timestamp) {
    const chatMessages = document.getElementById('chat-messages');
    
    const messageElement = document.createElement('div');
    
    // Check if the message is from the current user
    if (sender === currentUser) {
        messageElement.className = 'message user-message';
    } else {
        messageElement.className = 'message other-message';
    }
    
    const senderSpan = document.createElement('span');
    senderSpan.className = 'sender';
    senderSpan.textContent = sender + ':';
    
    // Add line break after sender (to match EJS structure)
    const br1 = document.createElement('br');
    
    const contentSpan = document.createElement('span');
    contentSpan.className = 'content';
    contentSpan.textContent = message;
    
    // Add line break after content (to match EJS structure)
    const br2 = document.createElement('br');
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'timestamp';
    timeSpan.textContent = new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Append all elements in the correct order
    messageElement.appendChild(senderSpan);
    messageElement.appendChild(br1);
    messageElement.appendChild(contentSpan);
    messageElement.appendChild(br2);
    messageElement.appendChild(timeSpan);
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}