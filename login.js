// Firebase configuration (replace with your own Firebase config)
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
  const auth = firebase.auth();
  
  // Google Sign-In
  document.getElementById("google-signin-btn").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        // Redirect to chat page after login
        window.location.href = "chat.html";
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error);
      });
  });
  