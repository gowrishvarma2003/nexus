// app/layout.tsx
// import '../globals.css';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: 'University Management System',
  description: 'Manage programs, courses, and users',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
