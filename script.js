// Firebase configuration (same as before)
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

// Set username from Google Auth
auth.onAuthStateChanged((user) => {
  if (user) {
    username = user.displayName;
    usernameInput.value = username;
  } else {
    // Redirect to login if not authenticated
    window.location.href = "index.html";
  }
});

// Listen for new messages in the database
db.ref("messages").on("child_added", (snapshot) => {
  const messageData = snapshot.val();
  displayMessage(messageData.text, messageData.sender);
});

// Display messages in chat box
function displayMessage(text, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(sender === username ? "sent" : "received");
  messageElement.textContent = `${sender}: ${text}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to the database
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== "" && username) {
    db.ref("messages").push({
      text: messageText,
      sender: username
    }).then(() => {
      messageInput.value = "";
    }).catch((error) => {
      console.error("Error sending message:", error);
    });
  }
}

// Sign out functionality
document.getElementById("signout-btn").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
});
