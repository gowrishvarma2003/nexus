'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.token && data.user) {
            login(data.token, data.user);
            router.push('/');
        } else {
            alert(data.message || 'Login failed');
        }
    };

    return (
        <div className='flex' style={{ padding: '2rem' }}>
            <h1 className=''>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ display: 'block', marginBottom: '1rem' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ display: 'block', marginBottom: '1rem' }}
                />
                <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                Don't have an account?{' '}
                <Link href="/signup" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Register here
                </Link>.
            </p>
        </div>
    );
}
