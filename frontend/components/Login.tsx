import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });

            // Extraer el token y el nombre de usuario desde la respuesta del servidor
            const { token, name } = response.data;
            console.log(token);
            console.log(name);

            // Guardar el token y el nombre de usuario en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userName', name);

            // Redirigir al usuario a la página de bienvenida
            router.push('/clientData');
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
    };

    return (
            <form onSubmit={handleLogin} className="w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
