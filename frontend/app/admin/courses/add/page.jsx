'use client';

import { useRouter } from 'next/navigation';
import CourseForm from '../from';

export default function AddCoursePage() {
    const router = useRouter();

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
