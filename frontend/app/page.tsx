'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role === 'admin') {
      router.push('/admin');
    } else if (user.role === 'professor') {
      router.push('/professor');
    } else if (user.role === 'student') {
      router.push('/student');
    }
  }, [user, router]);

  return <div>Loading...</div>;
}
