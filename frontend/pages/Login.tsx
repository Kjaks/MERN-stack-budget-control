// frontend/pages/login.tsx
import React from 'react';

const LoginPage: React.FC = () => {
    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form>
                <div>
                    <label>Usuario:</label>
                    <input type="text" />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginPage;
