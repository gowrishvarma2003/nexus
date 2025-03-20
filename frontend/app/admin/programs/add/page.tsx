'use client';

import { useRouter } from 'next/navigation';
import ProgramForm from '../ProgramForm';

export default function AddProgramPage() {
    const router = useRouter();

    const handleSuccess = () => {
        router.push('/admin/programs');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Add New Program</h2>
            <ProgramForm mode="add" onSuccess={handleSuccess} />
            <button onClick={() => router.push('/admin/programs')} style={{ marginTop: '1rem' }}>
                Back to Programs
            </button>
        </div>
    );
}
