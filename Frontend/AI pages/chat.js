const conversation = document.getElementById('conversation');
const chat = document.getElementById('chat');
const userInput = document.getElementById('user_input');

const apiLink = "http://localhost:5000/ask";

// Function to create message elements
function createMessageElement(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "user-message" : "AI-message";
    
    const heading = document.createElement("h2");
    heading.textContent = isUser ? "You:" : "zombozoAI:";
    
    const message = document.createElement("p");
    message.textContent = text;
    
    messageDiv.appendChild(heading);
    messageDiv.appendChild(message);
    
    return messageDiv;
}

// Function to create loading indicator
function createLoadingIndicator() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "chaotic-orbit";
    loadingDiv.style.display = "flex";
    return loadingDiv;
}

// Function to scroll to bottom of conversation
function scrollToBottom() {
    conversation.scrollTop = conversation.scrollHeight;
}

// Function to handle errors
function handleError(error) {
    const errorMessage = createMessageElement(
        "Sorry, I encountered an error. Please try again later.",
        false
    );
    conversation.appendChild(errorMessage);
    scrollToBottom();
    console.error("Error:", error);
}

// Function to disable/enable input during processing
function toggleInput(disabled = false) {
    userInput.disabled = disabled;
    const submitButton = chat.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = disabled;
    }
}

// Main submit handler
chat.addEventListener('submit', async(event) => {
    event.preventDefault();
    
    const message = userInput.value.trim();
    
    if (!message) {
        alert("Please enter a message!");
        return;
    }
    
    // Add user message to conversation
    const userMessage = createMessageElement(message, true);
    conversation.appendChild(userMessage);
    
    // Clear input and disable while processing
    userInput.value = '';
    toggleInput(true);
    
    // Add loading indicator
    const loadingDiv = createLoadingIndicator();
    conversation.appendChild(loadingDiv);
    scrollToBottom();
    
    try {
        const response = await fetch(apiLink, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ question: message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove loading indicator
        loadingDiv.remove();
        
        if (data.response) {
            // Add AI response to conversation
            const aiMessage = createMessageElement(data.response, false);
            conversation.appendChild(aiMessage);
            scrollToBottom();
        } else {
            throw new Error("No response data received");
        }
    } catch (error) {
        loadingDiv.remove();
        handleError(error);
    } finally {
        toggleInput(false);
    }
});

// Add input handling for better UX
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        chat.dispatchEvent(new Event('submit'));
    }
});

// Prevent empty submissions on button click
document.querySelector('.chat-methods button').addEventListener('click', (event) => {
    if (!userInput.value.trim()) {
        event.preventDefault();
        alert("Please enter a message!");
    }
});

// Handle microphone button (placeholder for future implementation)
document.querySelector('.fa-microphone').addEventListener('click', () => {
    alert("Voice input feature coming soon!");
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Update aria-expanded for accessibility
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
});