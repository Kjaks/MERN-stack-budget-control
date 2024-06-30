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
            router.push('/welcome');
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
