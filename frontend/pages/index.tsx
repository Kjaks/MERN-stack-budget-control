import React, { useState } from 'react';
import Register from '../components/Register';
import Login from '../components/Login'; // Importamos el componente de Login

const HomePage: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false); // Estado para controlar qué componente mostrar

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
            <div className="text-center mb-12">
                <h1 className="text-6xl font-extrabold text-gray-800">CASHOW</h1>
                <p className="mt-6 text-2xl text-gray-600">Your Personal Budget Manager</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                {showLogin ? (
                    <Login />
                ) : (
                    <Register />
                )}
                <div className="mt-4">
                    {showLogin ? (
                        <p className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer" onClick={() => setShowLogin(false)}>
                            Need to create an account?
                        </p>
                    ) : (
                        <p className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer" onClick={() => setShowLogin(true)}>
                            Already have an account?
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;

