import React, { useState } from 'react';
import axios from 'axios';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: ''
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post<{ token: string }>('http://localhost:8000/api/register', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            console.log('Registro exitoso. Token:', token);
            // Aquí podrías redirigir al usuario a otra página o mostrar un mensaje de éxito
        } catch (error) {
            console.error('Error al registrar:', error);
            // Aquí podrías manejar el error de alguna manera (por ejemplo, mostrar un mensaje de error)
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="text-center">
            <form className="mt-8" onSubmit={handleRegister}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-2 p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
