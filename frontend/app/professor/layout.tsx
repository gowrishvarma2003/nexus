'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <header>
                <h1>Professor Dashboard</h1>
                <p>Welcome, {user?.name}</p>
                <nav>
                    <ul>
                        <li>
                            <Link href="/professor/courses">My Courses</Link>
                        </li>
                    </ul>
                </nav>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main>{children}</main>
        </div>
    );
}
