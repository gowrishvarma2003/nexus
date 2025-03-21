'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

export default function AdminCourses() {
    const { token } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCourses = () => {
        if (token) {
            setLoading(true);
            fetch('https://nexus-jh17.vercel.app/api/courses', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setCourses(data))
                .catch((error) => console.error('Error fetching courses:', error))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                const res = await fetch(`https://nexus-jh17.vercel.app/api/courses/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Course deleted successfully');
                    fetchCourses();
                } else {
                    alert(data.message || 'Deletion failed');
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Error deleting course');
            }
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Manage Courses</h2>
            <Link href="/admin/courses/add">
                <button style={{ marginBottom: '1rem' }}>Add New Course</button>
            </Link>
            {loading ? (
                <p>Loading courses...</p>
            ) : (
                <ul>
                    {courses.map((course) => (
                        <li key={course._id}>
                            {course.title} ({course.courseCode}) – {course.credits} credits
                            <button onClick={() => handleDelete(course._id)} style={{ marginLeft: '1rem' }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
