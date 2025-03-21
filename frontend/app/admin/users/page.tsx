'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminUsers() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = () => {
        if (token) {
            setLoading(true);
            fetch('https://nexus-jh17.vercel.app/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setUsers(data))
                .catch((error) => console.error('Error fetching users:', error))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await fetch(`https://nexus-jh17.vercel.app/api/users/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    alert('User deleted successfully');
                    fetchUsers();
                } else {
                    alert(data.message || 'Deletion failed');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            }
        }
    };

    return (
        <div>
            <h2>Manage Users</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <ul className="admin-list">
                    {users.map((user) => (
                        <li key={user._id}>
                            {user.name} – {user.email} – {user.role}
                            <button className="admin-button" onClick={() => handleDelete(user._id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
