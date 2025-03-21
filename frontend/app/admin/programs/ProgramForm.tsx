'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

interface ProgramData {
    _id?: string;
    name: string;
    description: string;
}

interface ProgramFormProps {
    mode: 'add' | 'edit';
    initialData?: ProgramData;
    onSuccess?: () => void;
}

export default function ProgramForm({ mode, initialData, onSuccess }: ProgramFormProps) {
    const { token } = useAuth();
    const router = useRouter();

    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const programData: ProgramData = { name, description };

        try {
            const res = await fetch(
                mode === 'add'
                    ? 'https://nexus-jh17.vercel.app/api/programs'
                    : `https://nexus-jh17.vercel.app/api/programs/${initialData?._id}`,
                {
                    method: mode === 'add' ? 'POST' : 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(programData),
                }
            );
            const data = await res.json();
            if (res.ok) {
                alert(`Program ${mode === 'add' ? 'added' : 'updated'} successfully`);
                if (onSuccess) onSuccess();
                router.push('/admin/programs');
            } else {
                alert(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{mode === 'add' ? 'Add New Program' : 'Edit Program'}</h2>
            <div>
                <label>Program Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <button className="admin-button" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : mode === 'add' ? 'Add Program' : 'Update Program'}
            </button>
        </form>
    );
}
