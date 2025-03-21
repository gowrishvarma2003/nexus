'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function StudentPrograms() {
    const { token } = useAuth();
    const [programs, setPrograms] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetch('https://nexus-59gq-j1athuizy-projects121.vercel.app/api/programs', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setPrograms(data))
                .catch((error) => console.error('Error fetching programs:', error));
        }
    }, [token]);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>University Programs</h2>
            {programs.map((program) => (
                <div key={program._id} style={{ marginBottom: '1rem' }}>
                    <h3>{program.name}</h3>
                    <p>{program.description}</p>
                </div>
            ))}
        </div>
    );
}
