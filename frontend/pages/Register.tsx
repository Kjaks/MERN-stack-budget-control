import React from 'react';

const RegisterPage: React.FC = () => {
    return (
        <div>
            <h1>Registro de Usuario</h1>
            <form>
                <div>
                    <label>Usuario:</label>
                    <input type="text" />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" />
                </div>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default RegisterPage;
