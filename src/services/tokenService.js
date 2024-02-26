import Swal from 'sweetalert2';

// Verificar si el token ha expirado
export function isTokenExpired() {
    const expirationTimestamp = sessionStorage.getItem('tokenExpiration');
    if (!expirationTimestamp) {
        // No hay información sobre la expiración del token
        return true;
    }
    const currentTimestamp = new Date().getTime();
    return currentTimestamp > parseInt(expirationTimestamp, 10);
}

// Limpiar el token y realizar acciones de cierre de sesión
export function handleLogout(navigate) {
    sessionStorage.removeItem('miToken');
    sessionStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userType');
    localStorage.removeItem('rut');
    localStorage.removeItem('id_unidad');

    // Muestra una alerta al usuario
    Swal.fire({
        icon: 'info',
        title: 'Su sesión ha expirado!',
        text: 'Por favor, inicie sesión nuevamente.',
    }).then(() => {
        // Redirigir al usuario a la página de inicio de sesión
        navigate('/');
    });
}
