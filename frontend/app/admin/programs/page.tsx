// app/admin/programs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminPrograms() {
    const { token } = useAuth();
    const [programs, setPrograms] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/programs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setPrograms(data));
        }
    }, [token]);

    return (
        <div>
            <h2>Manage Programs</h2>
            <ul>
                {programs.map((program) => (
                    <li key={program._id}>
                        {program.name} - {program.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}
