'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">Create an Account</h1>
                <p className="mb-6 text-center text-sm text-gray-500">
                    Fill out the form below to get started.
                </p>
                <form onSubmit={handleSignup} className="flex flex-col space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-600">Name</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-600">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                            placeholder="your-email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-600">Role</label>
                        <select
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'admin' | 'professor' | 'student')}
                            required
                        >
                            <option value="student">Student</option>
                            <option value="professor">Professor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="mt-2 w-full rounded-md bg-purple-500 py-2 text-lg font-semibold text-white shadow-md transition-colors hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-purple-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
