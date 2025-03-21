'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

/* Import our new admin.css */
import '../styles/admin.css'; // Adjust the path as needed

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome, {user?.name}</p>
                <nav className="admin-nav">
                    <ul>
                        <li>
                            <Link href="/admin/users">Manage Users</Link>
                        </li>
                        <li>
                            <Link href="/admin/programs">Manage Programs</Link>
                        </li>
                        <li>
                            <Link href="/admin/courses">Manage Courses</Link>
                        </li>
                    </ul>
                </nav>
                <button className="admin-button" onClick={handleLogout}>Logout</button>
            </header>
            <main>{children}</main>
        </div>
    );
}
