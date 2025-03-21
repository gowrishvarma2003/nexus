'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProfessorCourses() {
    const { token, user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token && user) {
            setLoading(true);
            fetch(`https://nexus-jh17.vercel.app/api/courses?professorEmail=${encodeURIComponent(user.email)}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setCourses(data))
                .catch((error) => console.error('Error fetching courses:', error))
                .finally(() => setLoading(false));
        }
    }, [token, user]);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>My Courses</h2>
            {loading ? (
                <p>Loading courses...</p>
            ) : courses.length > 0 ? (
                <ul>
                    {courses.map((course) => (
                        <li key={course._id}>
                            {course.title} ({course.courseCode}) – {course.credits} credits
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No courses found for your account.</p>
            )}
        </div>
    );
}
