'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <div style={{ padding: '2rem' }}>
            <header>
                <h1>Admin Dashboard</h1>
                <p>Welcome, {user?.name}</p>
                <nav>
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
                <button
                    onClick={() => {
                        logout();
                        router.push('/login');
                    }}
                >
                    Logout
                </button>
            </header>
            <main>{children}</main>
        </div>
    );
}
