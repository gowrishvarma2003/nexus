// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminUsers() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setUsers(data));
        }
    }, [token]);

    return (
        <div>
            <h2>Manage Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.name} – {user.email} – {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
}
