const socket = io('http://localhost:8443', {
  path: '/api/comm/socket.io',
  extraHeaders: {
    Authorization: `Bearer `
  }
});

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');
const muteMicBtn = document.getElementById('muteMicBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomIdInput = document.getElementById('roomId');

let localStream;
let peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
let roomId;

// Get user media
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localStream = stream;
      localVideo.srcObject = stream;
    })
    .catch((error) => {
      alert(`Error accessing media devices: ${error.message}`);
    });
} else {
  alert("getUserMedia is not supported on this browser. Please use the latest version of Chrome or Firefox.");
}

socket.on('error', (error) => {
  alert(`Socket error: ${error.message}`);
  console.error('Socket error:', error);
});

// Join room
joinRoomBtn.addEventListener('click', () => {
  roomId = roomIdInput.value.trim();
  if (roomId) {
    socket.emit('joinRoom', roomId);
  }
});

// Initialize WebRTC after joining a room
socket.on('roomJoined', (roomId) => {
  console.log(`Joined room: ${roomId}`);
  initWebRTC();
});

// Initialize WebRTC and set up event listeners
function initWebRTC() {
  if(!peerConnection) {
    createPeerConnection();
  }

  socket.on('offer', async (offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer); // Send answer to specific room
  });

  socket.on('answer', (answer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('candidate', (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });
}

// Create Peer Connection
function createPeerConnection() {
  peerConnection = new RTCPeerConnection(config);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('candidate', event.candidate);
    }
  };

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
}

// Start Call
async function startCall() {
  if (!peerConnection) {
    createPeerConnection();
  }
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', offer); // Send offer to specific room
}

// Chat and messaging functions
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const body = chatInput.value.trim();
  if (body) {
    const msg = {
      body,
      username: socket.id,
    };
    socket.emit('chatMessage', msg);
    chatInput.value = '';
  }
}

socket.on('chatMessage', (msg) => {
  displayMessage(`${msg.username}: ${msg.body}`);
});

function displayMessage(message) {
  const msgElem = document.createElement('div');
  msgElem.textContent = message;
  messages.appendChild(msgElem);
}

// Toggle Mute Functionality
let isMuted = false;
muteMicBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  localStream.getAudioTracks()[0].enabled = !isMuted;
  muteMicBtn.textContent = isMuted ? 'Unmute Mic' : 'Mute Mic';
});

// Start call on button click
document.getElementById('startCallBtn').addEventListener('click', startCall);
