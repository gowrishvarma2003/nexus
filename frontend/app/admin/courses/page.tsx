'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

export default function AdminCourses() {
    const { token } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/courses', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setCourses(data));
        }
    }, [token]);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Manage Courses</h2>
            {/* Button to redirect to the Add Course page */}
            <Link href="/admin/courses/add">
                <button style={{ marginBottom: '1rem' }}>Add New Course</button>
            </Link>
            <ul>
                {courses.map((course) => (
                    <li key={course._id}>
                        {course.title} ({course.courseCode}) – {course.credits} credits
                    </li>
                ))}
            </ul>
        </div>
    );
}
