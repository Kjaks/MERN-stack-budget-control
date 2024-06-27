import React from 'react';
import Link from 'next/link';
import Register from './Register';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
            <div className="text-center mb-12">
                <h1 className="text-6xl font-extrabold text-gray-800">CASHOW</h1>
                <p className="mt-6 text-2xl text-gray-600">Your Personal Budget Manager</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <Register />
                <div className="mt-4">
                    <Link href="/Login">
                        <p className="text-blue-500 hover:text-blue-700 hover:underline">
                            Already have an account?
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
