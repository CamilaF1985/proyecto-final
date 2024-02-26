const validarFactura = (factura) => {
    //validar que factura tenga entre 1 y 10 caracteres
    const longitudFactura = factura.trim().length;
    return longitudFactura >= 1 && longitudFactura <= 10;
};

const validarMonto = (monto) => {
    // Verificar si el monto es un entero válido mayor a 0
    const esEntero = /^\d+$/.test(monto);
    const esMayorACero = parseInt(monto, 10) > 0;

    return esEntero && esMayorACero;
};


const validarDescripcion = (descripcion) => {
    //validar que factura tenga entre 4 y 20 caracteres
    const longitudDescripcion = descripcion.trim().length;
    return longitudDescripcion >= 4 && longitudDescripcion <= 20;
};

export const validarGasto = {
    //exporta todas las funciones
    factura: validarFactura,
    monto: validarMonto,
    descripcion: validarDescripcion,
};
