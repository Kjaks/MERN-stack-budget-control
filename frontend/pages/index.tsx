import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Bienvenido a mi aplicación</h1>
            <p>Por favor, regístrate o inicia sesión.</p>
            <nav>
                <ul>
                    <li>
                        <Link href="/register">
                            Registrarse
                        </Link>
                    </li>
                    <li>
                        <Link href="/login">
                            Iniciar Sesión
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default HomePage;
