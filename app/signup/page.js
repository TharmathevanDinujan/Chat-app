"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Link from 'next/link';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!gender) {
            setError('Please select a gender.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile with full name (and potentially store gender in DB later)
            await updateProfile(userCredential.user, {
                displayName: fullName
            });

            console.log("User registered:", userCredential.user);
            setSuccess("Account created successfully! Redirecting...");
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (err) {
            setError("Registration failed. " + err.message);
            console.error(err);
        }
    };

    return (
        <div className="signup-container fade-in">
            <h2>Create a New Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <div className="popup" style={{ display: 'block', position: 'relative', top: 'auto', right: 'auto', marginBottom: '10px' }}>{success}</div>}

            <form onSubmit={handleSignup} id="signup-form">
                <input
                    type="text"
                    id="signup-fullname"
                    placeholder="Full Name"
                    required
                    className="form-fade-in"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <input
                    type="email"
                    id="signup-email"
                    placeholder="Email"
                    required
                    className="form-fade-in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    id="signup-password"
                    placeholder="Password"
                    required
                    className="form-fade-in"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="gender-container">
                    <label className="gender-label">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            required
                            onChange={(e) => setGender(e.target.value)}
                        /> Male
                    </label>
                    <label className="gender-label">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            required
                            onChange={(e) => setGender(e.target.value)}
                        /> Female
                    </label>
                </div>
                <button
                    type="submit"
                    className="button-glow">
                    Sign Up
                </button>
            </form>
            <p style={{ marginTop: '15px' }} className="or-fade-in">
                Already have an account? <Link href="/login" style={{ color: '#357ae8', textDecoration: 'none' }}>Log In</Link>
            </p>

            {/* Styled JSX for local popup if needed, though global css handles .popup */}
            <style jsx>{`
        .popup {
            background-color: #95cfbe;
            color: white;
            padding: 10px;
            border-radius: 5px;
            animation: popup-animation 0.5s forwards;
        }
        @keyframes popup-animation {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
