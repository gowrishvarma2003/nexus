'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

export default function AdminPrograms() {
    const { token } = useAuth();
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPrograms = () => {
        if (token) {
            setLoading(true);
            fetch('https://nexus-59gq-j1athuizy-projects121.vercel.app/api/programs', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setPrograms(data))
                .catch((error) => console.error('Error fetching programs:', error))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this program?')) {
            try {
                const res = await fetch(`https://nexus-59gq-j1athuizy-projects121.vercel.app/api/programs/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Program deleted successfully');
                    fetchPrograms();
                } else {
                    alert(data.message || 'Deletion failed');
                }
            } catch (error) {
                console.error('Error deleting program:', error);
                alert('Error deleting program');
            }
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Manage Programs</h2>
            <Link href="/admin/programs/add">
                <button style={{ marginBottom: '1rem' }}>Add New Program</button>
            </Link>
            {loading ? (
                <p>Loading programs...</p>
            ) : (
                <ul>
                    {programs.map((program) => (
                        <li key={program._id}>
                            {program.name} – {program.description}
                            <button onClick={() => handleDelete(program._id)} style={{ marginLeft: '1rem' }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
