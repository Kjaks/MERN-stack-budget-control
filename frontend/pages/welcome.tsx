import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Welcome: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        } else {
            router.push('/');
        }
    }, [router]);

    if (!userName) {
        return <div>Loading...</div>; // O un indicador de carga mientras se redirige
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
            <div className="text-center mb-12">
                <h1 className="text-6xl font-extrabold text-gray-800">Welcome</h1>
                <p className="mt-6 text-2xl text-gray-600">Hello, {userName}!</p>
            </div>
        </div>
    );
};

export default Welcome;
