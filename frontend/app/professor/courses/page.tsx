// app/professor/courses/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProfessorCourses() {
    const { token, user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/courses', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    const myCourses = data.filter(
                        (course: any) => course.professor?._id === user?.id
                    );
                    setCourses(myCourses);
                });
        }
    }, [token, user]);

    return (
        <div>
            <h2>My Courses</h2>
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
