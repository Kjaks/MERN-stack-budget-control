// Register.tsx
import React, { useState } from 'react';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para manejar el registro (puede incluir validaciones y envío de datos a un servidor)
        console.log('Registrando usuario:', { username, email, password });
    };

    return (
            <div className="text-center">
                <form className="mt-8" onSubmit={handleRegister}>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-2 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
