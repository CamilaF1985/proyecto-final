const validateRut = (rut) => {

    if (rut == null || rut.length === 0) {
        return true;
    }

    rut = rut.split('.').join('');
    rut = rut.split('-').join('');

    //Valor acumulado para el calculo de la formula del dígito verificador
    let nAcumula = 0;
    //Factor por el cual se debe multiplicar el valor de la posicion
    let nFactor = 2;
    //Digito verificador
    let nDv = 0;
    let nDvReal;
    //Extraemos el ultimo numero o letra que corresponde al verificador
    //La K corresponde a 10
    if (rut.charAt(rut.length - 1).toUpperCase() === 'K') {
        nDvReal = 10;
    } else if (rut.charAt(rut.length - 1) === '0') { // el 0 corresponde a 11
        nDvReal = 11;
    } else {
        nDvReal = rut.charAt(rut.length - 1);
    }

    for (let nPos = rut.length - 2; nPos >= 0; nPos--) {
        nAcumula += rut.charAt(nPos).valueOf() * nFactor;
        nFactor++;
        if (nFactor > 7) nFactor = 2;
    }

    nDv = 11 - (nAcumula % 11)
    if (nDv === parseInt(nDvReal)) {
        return true;
    } else {
        return false;
    }
}

const validarContrasena = (contrasena) => {
    //validar que la contraseña tenga minimo 8 caracteres, al menos 1 letra, 1 numero y un caracter expecial
    return contrasena.length >= 8 &&
        /[A-Za-zÑñÁáÉéÍíÓóÚúüÜ]/.test(contrasena) &&
        /\d/.test(contrasena) &&
        /[@$!%#?&]/.test(contrasena);
};

const validarEmail = (email) => {
    //validar que el mail tenga @ y un dominio
    return email.includes('@') &&
        email.split('@')[1].includes('.');
};

const validarNombre = (nombre) => {
    //validar que nombre tenga entre 4 y 15 caracteres
    const longitudNombre = nombre.trim().length;
    return longitudNombre >= 4 && longitudNombre <= 15;
};

const validarNombreUnidad = (nombreUnidad) => {
    //validar que unidad tenga entre 4 y 15 caracteres
    const longitudNombreUnidad = nombreUnidad.trim().length;
    return longitudNombreUnidad >= 4 && longitudNombreUnidad <= 15;
};

const validarCalle = (calle) => {
    //validar que calle tenga entre 4 y 30 caracteres
    const longitudCalle = calle.trim().length;
    return longitudCalle >= 4 && longitudCalle <= 30;
};

const validarNumero = (numero) => {
    //validar que numero tenga maximo 10 caracteres, puede quedar nulo
    return numero.trim().length <= 10;
};

const validarDeptoCasa = (deptoCasa) => {
    //validar que deptoCasa tenga maximo 10 caracteres, puede quedar nulo
    return !deptoCasa || deptoCasa.trim().length <= 10;
};


export const validarRegistro = {
    //exporta todas las funciones
    rut: validateRut,
    contrasena: validarContrasena,
    email: validarEmail,
    nombre: validarNombre,
    nombreUnidad: validarNombreUnidad,
    calle: validarCalle,
    numero: validarNumero,
    deptoCasa: validarDeptoCasa,
};

