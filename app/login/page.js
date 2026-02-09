"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err) {
            setError("Login failed. Please check your email and password.");
            console.error(err);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (err) {
            setError("Google sign-in failed.");
            console.error(err);
        }
    };

    return (
        <div className="login-container fade-in">
            <img src="/app-icon.png" alt="App Icon" className="app-icon" />
            <h2>Welcome Back!</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin} id="email-login-form">
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    required
                    className="form-fade-in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    required
                    className="form-fade-in"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="button-glow">Log In</button>
            </form>

            <div style={{ margin: '20px 0', fontSize: '14px', color: '#666' }}>OR</div>

            <button id="google-signin-btn" className="button-glow" onClick={handleGoogleLogin} style={{ backgroundColor: '#fff', color: '#757575', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/google-icon.png" alt="Google Logo" style={{ width: '20px', marginRight: '10px' }} />
                Sign in with Google
            </button>

            <p style={{ marginTop: '15px' }} className="or-fade-in">
                Don't have an account? <Link href="/signup" style={{ color: '#357ae8', textDecoration: 'none' }}>Sign Up</Link>
            </p>
        </div>
    );
}
