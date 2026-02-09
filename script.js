// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwPkk3G7O0ajVydw4toexCsapEx6bFSaU",
  authDomain: "chat-app-83303.firebaseapp.com",
  databaseURL: "https://chat-app-83303-default-rtdb.firebaseio.com",
  projectId: "chat-app-83303",
  storageBucket: "chat-app-83303.firebasestorage.app",
  messagingSenderId: "414327509570",
  appId: "1:414327509570:web:02492875b0a4e6268e53db"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const usernameInput = document.getElementById("username-input");
let username = null;

// Set username from authentication
auth.onAuthStateChanged((user) => {
  if (user) {
    username = user.displayName || user.email;
    usernameInput.value = username;
  } else {
    // Redirect to login if not authenticated
    window.location.href = "index.html";  // Make sure you have a login page
  }
});

// Listen for new messages in the database
db.ref("messages").on("child_added", (snapshot) => {
  const messageData = snapshot.val();
  displayMessage(messageData.text, messageData.sender, messageData.timestamp);
});

// Display messages in chat box
function displayMessage(text, sender, timestamp) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(sender === username ? "sent" : "received");
  messageElement.textContent = `${sender}: ${text}`;

  // Add timestamp
  const timestampElement = document.createElement("div");
  timestampElement.classList.add("timestamp");
  timestampElement.textContent = new Date(timestamp).toLocaleString();
  messageElement.appendChild(timestampElement);

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to the database
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== "" && username) {
    db.ref("messages").push({
      text: messageText,
      sender: username,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
      messageInput.value = "";
    }).catch((error) => {
      console.error("Error sending message:", error);
    });
  }
}

// Sign out user
document.getElementById("signout-btn").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html"; // Redirect to login page
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
});
