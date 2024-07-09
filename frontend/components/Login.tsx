import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error state

        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password }, { timeout: 10000 });

            const { userId, name } = response.data;
            console.log('userId:', userId);
            console.log('Name:', name);

            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', name);

            router.push('/clientData');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    setError('Request timed out. Please try again.');
                } else if (error.response && error.response.data && error.response.data.error) {
                    setError(error.response.data.error);
                } else {
                    setError('Login failed. Please check your credentials and try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            console.error('Login error:', error);
        }
    };

    return (
        <form onSubmit={handleLogin} className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            <div className="mb-4">
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-6">
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Login
            </button>
        </form>
    );
};

export default Login;
