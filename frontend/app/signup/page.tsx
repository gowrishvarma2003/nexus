'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './SignupPage.module.css';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'professor' | 'student'>('student');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('https://nexus-jh17.vercel.app/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
        });
        const data = await res.json();

        if (res.ok) {
            alert('Signup successful! Please log in.');
            router.push('/login');
        } else {
            alert(data.message || 'Signup failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create an Account</h1>
                <p className={styles.subtitle}>Fill out the form below to get started.</p>

                <form onSubmit={handleSignup} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Name</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="your-email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Role</label>
                        <select
                            className={styles.select}
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value as 'admin' | 'professor' | 'student')
                            }
                            required
                        >
                            <option value="student">Student</option>
                            <option value="professor">Professor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.button}>
                        Sign Up
                    </button>
                </form>

                <p className={styles.footerText}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.link}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
