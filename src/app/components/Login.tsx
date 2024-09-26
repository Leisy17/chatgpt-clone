import React, { useState } from 'react';
import '../../styles/AuthForm.css';

type Conversation = {
    id: string;
    title: string;
    createdAt: string;
};

type LoginProps = {
    onLoginSuccess: (user: { id: string; conversations: Conversation[] }) => void;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            // Attempt to log in
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const user = await response.json();

            if (!user.user.id) {
                throw new Error('User ID is undefined');
            }

            const conversationsResponse = await fetch(`/api/conversations/${user.user.id}`);
            if (!conversationsResponse.ok && conversationsResponse.status !== 404) {
                const errorData = await conversationsResponse.json();
            throw new Error(errorData.error || 'Could not fetch conversations.');
        }

        if (conversationsResponse.status === 404) {
            onLoginSuccess({ id: user.id, conversations: [] });
            return;
        }

        const conversations = await conversationsResponse.json();

        onLoginSuccess({ id: user.id, conversations });
        } catch (err: any) {
            setError(err.message || 'Unknown error occurred');
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
