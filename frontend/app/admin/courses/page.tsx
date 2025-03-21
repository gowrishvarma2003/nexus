'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './AdminCourses.module.css'; // <-- Import the CSS module

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
        <div className={styles.adminCoursesContainer}>
            <h2>Manage Courses</h2>
            <Link href="/admin/courses/add">
                <button className={styles.addCourseButton}>Add New Course</button>
            </Link>

            {loading ? (
                <p>Loading courses...</p>
            ) : (
                <ul className={styles.courseList}>
                    {courses.map((course) => (
                        <li key={course._id} className={styles.courseItem}>
                            {course.title} ({course.courseCode}) – {course.credits} credits
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(course._id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
