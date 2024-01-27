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
    } else if (rut.charAt(rut.length - 1) === 0) { // el 0 corresponde a 11
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

const validate = {
    rut: validateRut
}

export default validate;