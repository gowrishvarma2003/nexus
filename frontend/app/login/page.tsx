"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";  // adjust path as needed
import Link from "next/link";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();  // Auth context hook
    const router = useRouter();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        const res = await fetch("https://nexus-jh17.vercel.app/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.token && data.user) {
            // Store auth info via context, localStorage, etc.
            login(data.token, data.user);
            router.push("/");
        } else {
            alert(data.message || "Login failed");
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.loginForm} onSubmit={handleLogin}>
                <h1 className={styles.loginTitle}>Login</h1>

                <input
                    className={styles.loginInput}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    className={styles.loginInput}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className={styles.loginButton} type="submit">
                    Login
                </button>

                <p className={styles.loginFooter}>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className={styles.loginLink}>
                        Register here
                    </Link>
                    .
                </p>
            </form>
        </div>
    );
}
