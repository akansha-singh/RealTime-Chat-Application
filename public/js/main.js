const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.divscroll');
 
// Get username and channel from URl
const {username, channel} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
//console.log(username, channel);

const socket = io();

// Join channel (sending to server.js)
socket.emit('joinChannel', { username, channel});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;
    
    // Emit message to server
    socket.emit('chatMessage',msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.divscroll').appendChild(div);
  }