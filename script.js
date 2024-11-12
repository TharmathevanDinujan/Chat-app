// Firebase configuration (replace with your own config)
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
  
  const chatBox = document.getElementById("chat-box");
  const messageInput = document.getElementById("message-input");
  
  let username = null; // User's chosen username
  
  // Function to set the username
  function setUsername() {
    const usernameInput = document.getElementById("username-input");
    username = usernameInput.value.trim();
  
    if (username) {
      usernameInput.disabled = true;
      document.querySelector(".username-container button").disabled = true;
      console.log(`Username set to: ${username}`);
    } else {
      alert("Please enter a valid username!");
    }
  }
  
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
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  }
  
  // Send message to the database
  function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (messageText !== "" && username) {
      db.ref("messages").push({
        text: messageText,
        sender: username
      }).then(() => {
        console.log("Message sent successfully");
      }).catch((error) => {
        console.error("Error sending message:", error);
      });
      
      messageInput.value = ""; // Clear input after sending
    } else if (!username) {
      alert("Please set a username before sending a message.");
    }
  }
  