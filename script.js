// Get DOM elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

// Function to format time
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutesStr} ${ampm}`;
}

// Function to create a message element
function createMessageElement(text, isSent = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);
    
    if (!isSent) {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = 'A';
        messageDiv.appendChild(avatarDiv);
    }
    
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

// Function to send a message
function sendMessage() {
    const text = messageInput.value.trim();
    
    if (text === '') {
        return;
    }
    
    // Create and add the message
    const messageElement = createMessageElement(text, true);
    chatMessages.appendChild(messageElement);
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate a response after a delay (for demo purposes)
    setTimeout(() => {
        const responses = [
            "That's interesting! Tell me more.",
            "I see what you mean.",
            "Thanks for sharing that!",
            "Cool! 😊",
            "Absolutely agree!",
            "That makes sense.",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseElement = createMessageElement(randomResponse, false);
        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000 + Math.random() * 1000);
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Focus on input when page loads
messageInput.focus();

// Add some interactivity to icon buttons
document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Add a ripple effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});

// Smooth scroll behavior
chatMessages.style.scrollBehavior = 'smooth';

console.log('Claw Chat initialized successfully! 🎉');
