'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

interface CourseData {
    _id?: string;
    title: string;
    description: string;
    credits: number;
    courseCode: string;
    semester: string;
    program: string;
    professor?: string; // will store professor email
}

interface CourseFormProps {
    mode: 'add' | 'edit';
    initialData?: CourseData;
    onSuccess?: () => void;
}

interface Program {
    _id: string;
    name: string;
}

export default function CourseForm({ mode, initialData, onSuccess }: CourseFormProps) {
    const { token, user } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [credits, setCredits] = useState(initialData?.credits || 0);
    const [courseCode, setCourseCode] = useState(initialData?.courseCode || '');
    const [semester, setSemester] = useState(initialData?.semester || '');
    const [program, setProgram] = useState(initialData?.program || '');
    // For admin, professorInput stores the professor email entered; for professors, we use their own email.
    const [professorInput, setProfessorInput] = useState(
        initialData?.professor || (user?.role === 'professor' ? user.email : '')
    );
    const [programOptions, setProgramOptions] = useState<Program[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            fetch('https://nexus-59gq-j1athuizy-projects121.vercel.app/api/programs', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setProgramOptions(data);
                    if (!program && data.length > 0) {
                        setProgram(data[0]._id);
                    }
                })
                .catch((error) => console.error('Error fetching programs:', error));
        }
    }, [token]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // For admin, simply use the email entered in professorInput without converting it.
        const professorEmail = user?.role === 'admin' ? professorInput : user?.email;

        const courseData: CourseData = {
            title,
            description,
            credits,
            courseCode,
            semester,
            program,
            professor: professorEmail,
        };

        try {
            const res = await fetch(
                mode === 'add'
                    ? 'https://nexus-59gq-j1athuizy-projects121.vercel.app/api/courses'
                    : `https://nexus-59gq-j1athuizy-projects121.vercel.app/api/courses/${initialData?._id}`,
                {
                    method: mode === 'add' ? 'POST' : 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(courseData),
                }
            );
            const data = await res.json();
            if (res.ok) {
                alert(`Course ${mode === 'add' ? 'added' : 'updated'} successfully`);
                if (onSuccess) onSuccess();
                router.push(user?.role === 'admin' ? '/admin/courses' : '/professor/courses');
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
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2>{mode === 'add' ? 'Add New Course' : 'Edit Course'}</h2>
            <div style={{ marginBottom: '1rem' }}>
                <label>Course Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Credits:</label>
                <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    required
                    min={0}
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Course Code:</label>
                <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    required
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Semester:</label>
                <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Program:</label>
                <select value={program} onChange={(e) => setProgram(e.target.value)} required style={{ width: '100%' }}>
                    {programOptions.map((prog) => (
                        <option key={prog._id} value={prog._id}>
                            {prog.name}
                        </option>
                    ))}
                </select>
            </div>
            {user?.role === 'admin' && (
                <div style={{ marginBottom: '1rem' }}>
                    <label>Professor Email (Instructor):</label>
                    <input
                        type="email"
                        value={professorInput}
                        onChange={(e) => setProfessorInput(e.target.value)}
                        required
                        style={{ width: '100%' }}
                    />
                </div>
            )}
            {user?.role === 'professor' && (
                <div style={{ marginBottom: '1rem' }}>
                    <label>Instructor:</label>
                    <input type="text" value={user.email} disabled style={{ width: '100%' }} />
                </div>
            )}
            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : mode === 'add' ? 'Add Course' : 'Update Course'}
            </button>
        </form>
    );
}
