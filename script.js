// Global variables
let currentChatId = null;
let chatHistory = [];
let renameChatId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadChatHistory();
});

// Sidebar functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
}

// Chat management
function newChat() {
    const chatId = Date.now();
    const chatTitle = 'New Chat ' + (chatHistory.length + 1);
    
    const newChat = {
        id: chatId,
        title: chatTitle,
        messages: [],
        pinned: false,
        timestamp: new Date()
    };
    
    chatHistory.unshift(newChat);
    currentChatId = chatId;
    
    saveChatHistory();
    renderChatHistory();
    clearChatContainer();
    closeSidebar();
    
    // Add welcome message
    addAIMessage("Hello! I'm BlazarAI 🚀\nHow can I help you today?");
}

function selectChat(chatId) {
    currentChatId = chatId;
    const chat = chatHistory.find(c => c.id === chatId);
    
    if (chat) {
        clearChatContainer();
        chat.messages.forEach(message => {
            if (message.type === 'user') {
                addUserMessage(message.content);
            } else {
                addAIMessage(message.content);
            }
        });
    }
    
    closeSidebar();
}

function pinChat(event, chatId) {
    event.stopPropagation();
    
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
        chat.pinned = !chat.pinned;
        saveChatHistory();
        renderChatHistory();
    }
}

function renameChat(event, chatId) {
    event.stopPropagation();
    renameChatId = chatId;
    
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
        document.getElementById('newChatTitle').value = chat.title;
        document.getElementById('renameModal').classList.add('active');
    }
}

function closeRenameModal() {
    document.getElementById('renameModal').classList.remove('active');
    renameChatId = null;
}

function confirmRename() {
    const newTitle = document.getElementById('newChatTitle').value.trim();
    
    if (newTitle && renameChatId) {
        const chat = chatHistory.find(c => c.id === renameChatId);
        if (chat) {
            chat.title = newTitle;
            saveChatHistory();
            renderChatHistory();
        }
    }
    
    closeRenameModal();
}

function deleteChat(event, chatId) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this chat?')) {
        chatHistory = chatHistory.filter(c => c.id !== chatId);
        
        if (currentChatId === chatId) {
            currentChatId = null;
            clearChatContainer();
            addAIMessage("Welcome to BlazarAI! Start a new chat to begin.");
        }
        
        saveChatHistory();
        renderChatHistory();
    }
}

// Message functions
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    input.value = '';
    autoResize(input);
    
    // Save to current chat
    if (currentChatId) {
        const chat = chatHistory.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages.push({ type: 'user', content: message, timestamp: new Date() });
            saveChatHistory();
        }
    } else {
        // Create new chat if none selected
        newChat();
        const chat = chatHistory.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages.push({ type: 'user', content: message, timestamp: new Date() });
        }
    }
    
    // Generate AI response
    generateAIResponse(message);
}

function addUserMessage(content) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addAIMessage(content) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function generateAIResponse(userMessage) {
    // Simulate AI thinking
    setTimeout(() => {
        const responses = [
            "I understand you're saying: \"" + userMessage + "\". That's interesting! Tell me more.",
            "Great question! As BlazarAI, I'm here to help you with that.",
            "I'm processing your request... 🤔\nYou said: \"" + userMessage + "\"",
            "That's a fascinating point! I'd love to discuss this further.",
            "I'm BlazarAI, your HTML-based AI assistant! How can I help you with: \"" + userMessage + "\"?",
            "Interesting input! Let me analyze that for you...",
            "I appreciate you sharing: \"" + userMessage + "\". What would you like to explore next?"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        addAIMessage(response);
        
        // Save AI response to chat history
        if (currentChatId) {
            const chat = chatHistory.find(c => c.id === currentChatId);
            if (chat) {
                chat.messages.push({ type: 'ai', content: response, timestamp: new Date() });
                saveChatHistory();
            }
        }
    }, 1000 + Math.random() * 2000);
}

// File options
function toggleFileOptions() {
    const fileOptions = document.getElementById('fileOptions');
    fileOptions.classList.toggle('show');
}

function uploadFile() {
    alert('File upload functionality would go here!');
    toggleFileOptions();
}

function uploadImage() {
    alert('Image upload functionality would go here!');
    toggleFileOptions();
}

function takePhoto() {
    alert('Camera would open here!');
    toggleFileOptions();
}

// Utility functions
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function scrollToBottom() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function clearChatContainer() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
}

function renderChatHistory() {
    const historyContainer = document.querySelector('.chat-history');
    historyContainer.innerHTML = '';
    
    // Separate pinned and unpinned chats
    const pinnedChats = chatHistory.filter(chat => chat.pinned);
    const unpinnedChats = chatHistory.filter(chat => !chat.pinned);
    
    // Render pinned chats first
    pinnedChats.forEach(chat => {
        historyContainer.appendChild(createChatItem(chat));
    });
    
    // Render unpinned chats
    unpinnedChats.forEach(chat => {
        historyContainer.appendChild(createChatItem(chat));
    });
}

function createChatItem(chat) {
    const chatItem = document.createElement('div');
    chatItem.className = `chat-item ${chat.pinned ? 'pinned' : ''}`;
    chatItem.onclick = () => selectChat(chat.id);
    
    chatItem.innerHTML = `
        <div class="chat-title">${chat.title}</div>
        <div class="chat-actions">
            <button class="action-btn" onclick="pinChat(event, ${chat.id})">
                <i class="${chat.pinned ? 'fas' : 'far'} fa-star"></i>
            </button>
            <button class="action-btn" onclick="renameChat(event, ${chat.id})">
                <i class="far fa-edit"></i>
            </button>
            <button class="action-btn" onclick="deleteChat(event, ${chat.id})">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
    `;
    
    return chatItem;
}

// Local storage functions
function saveChatHistory() {
    localStorage.setItem('blazarai_chats', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('blazarai_chats');
    if (saved) {
        chatHistory = JSON.parse(saved);
        renderChatHistory();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl+Enter or Cmd+Enter to send message
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        sendMessage();
    }
    
    // Escape to close sidebar or modal
    if (event.key === 'Escape') {
        closeSidebar();
        closeRenameModal();
        const fileOptions = document.getElementById('fileOptions');
        fileOptions.classList.remove('show');
    }
});

// Close file options when clicking outside
document.addEventListener('click', function(event) {
    const fileOptions = document.getElementById('fileOptions');
    const inputActions = document.getElementById('inputActions');
    
    if (!inputActions.contains(event.target)) {
        fileOptions.classList.remove('show');
    }
});
