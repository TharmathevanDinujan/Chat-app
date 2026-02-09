"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, push, onChildAdded, serverTimestamp } from 'firebase/database';

export default function ChatPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatBoxRef = useRef(null);
    const router = useRouter();

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Messages Listener
    useEffect(() => {
        if (!user) return;

        const messagesRef = ref(db, 'messages');
        const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
            const data = snapshot.val();
            setMessages((prev) => {
                if (prev.some(m => m.id === snapshot.key)) return prev;
                return [...prev, { id: snapshot.key, ...data }];
            });
        });

        return () => {
            // Firebase realtime database listeners are tricky to unsubscribe from single hook if generic, 
            // but explicit off() is needed often. 
            // For simplicity in this effect, we rely on component unmount cleanup if needed or just let it be for now 
            // as onChildAdded returns an unsubscribe function in newer SDKs? 
            // Check SDK version. generic imports suggest v9 modular.
            unsubscribe();
        };
    }, [user]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === "" || !user) return;

        const username = user.displayName || user.email;

        try {
            await push(ref(db, 'messages'), {
                text: newMessage,
                sender: username,
                timestamp: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return (
            <div className="background-animation">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
                    Loading...
                </div>
            </div>
        );
    }

    // Display name fallback
    const displayName = user.displayName || user.email;

    return (
        <div>
            <div className="background-animation">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>

            <div className="chat-container">
                <div className="username-container">
                    {/* Read-only username input to match old style, or just text */}
                    <input type="text" disabled value={displayName} placeholder="Username" />
                    <button onClick={handleSignOut} id="signout-btn">Sign Out</button>
                </div>

                <div className="chat-box" id="chat-box" ref={chatBoxRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender === displayName ? 'sent' : 'received'}`}>
                            {msg.sender}: {msg.text}
                            <div className="timestamp">
                                {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Just now'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        id="message-input"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}
