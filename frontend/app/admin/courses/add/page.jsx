'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import CourseForm from '../from'; // Adjust path if needed

export default function AddCoursePage() {
    const { user } = useAuth();
    const router = useRouter();

    // onSuccess callback navigates back to the courses list
    const handleSuccess = () => {
        router.push('/admin/courses');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Add New Course</h2>
            <CourseForm mode="add" onSuccess={handleSuccess} />
            <button onClick={() => router.push('/admin/courses')} style={{ marginTop: '1rem' }}>
                Back to Courses
            </button>
        </div>
    );
}
