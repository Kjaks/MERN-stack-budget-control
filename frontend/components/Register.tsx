// components/Register.tsx
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
            // Suponiendo que `name`, `email` y `password` están correctamente definidos y capturados del formulario
            const response = await axios.post('http://localhost:8000/api/register', { name, email, password });
    
            // Extraer el token desde la respuesta
            const { token } = response.data;
    
            // Guardar el token y el nombre de usuario en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userName', name); // Guardar el nombre en localStorage
    
            // Redirigir al usuario a la página de bienvenida
            router.push('/welcome');
        } catch (error) {
            console.error('Error en el registro:', error);
        }
    };
    

    return (
        <form onSubmit={handleRegister}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
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
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
