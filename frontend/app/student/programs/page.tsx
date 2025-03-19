// app/student/programs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function StudentPrograms() {
    const { token } = useAuth();
    const [programs, setPrograms] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/programs', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setPrograms(data));
        }
    }, [token]);

    return (
        <div>
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
