import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/register', { name, email, password });

            // Extraer el token y userId desde la respuesta
            const { token, userId } = response.data;

            // Guardar el token, userId y el nombre de usuario en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId); // Guardar el userId en localStorage
            localStorage.setItem('userName', name); // Guardar el nombre en localStorage

            console.log(userId);
            console.log(name);

            // Redirigir al usuario a la página de bienvenida
            router.push('/clientData');
        } catch (error) {
            console.error('Error en el registro:', error);
        }
    };

    return (
        <form onSubmit={handleRegister} className="max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <div className="mb-4">
                <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
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
                Register
            </button>
        </form>
    );
};

export default Register;
