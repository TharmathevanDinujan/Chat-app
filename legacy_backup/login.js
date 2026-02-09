
const firebaseConfig = {
  apiKey: "AIzaSyDwPkk3G7O0ajVydw4toexCsapEx6bFSaU",
  authDomain: "chat-app-83303.firebaseapp.com",
  databaseURL: "https://chat-app-83303-default-rtdb.firebaseio.com",
  projectId: "chat-app-83303",
  storageBucket: "chat-app-83303.appspot.com",
  messagingSenderId: "414327509570",
  appId: "1:414327509570:web:02492875b0a4e6268e53db",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById("google-signin-btn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("Google sign-in successful:", result.user);
      window.location.href = "chat.html"; 
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error);
    });
});

document.getElementById("email-login-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Email sign-in successful:", userCredential.user);
      window.location.href = "chat.html";
    })
    .catch((error) => {
      console.error("Error during email sign-in:", error);
      showNotification("Login failed. Please check your email and password.");
    });
});

function showNotification(message) {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  
  notificationMessage.textContent = message;
  notification.style.display = "block"; 
  
  setTimeout(() => {
    notification.style.display = "none"; 
  }, 5000);
}
