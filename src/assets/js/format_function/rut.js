export default function formatRut(input, event) {
    let rut = input.value.replace(/[^0-9kK]/g, '');

    // Verificar si la tecla de retroceso está presionada y el valor está vacío o contiene solo un guion
    if ((event && event.inputType === 'deleteContentBackward') || (input.selectionStart === 0 && input.selectionEnd === rut.length)) {
        input.value = '';
    }
    else {
        if (input.value.length === 1) {
            let formattedRut = rut
            input.value = formattedRut;
        }
        else {
            let bodyRut = rut.slice(0, -1)
            let dv = rut.slice(-1);

            let x = bodyRut.length
            switch (x) {

                case 1: bodyRut = bodyRut
                    break;
                case 2: bodyRut = bodyRut
                    break;
                case 3: bodyRut = bodyRut
                    break;
                case 4: bodyRut = bodyRut.substring(0, 1) + '.' + bodyRut.substring(1, bodyRut.length)
                    break
                case 5: bodyRut = bodyRut.substring(0, 2) + '.' + bodyRut.substring(2, bodyRut.length)
                    break
                case 6: bodyRut = bodyRut.substring(0, 3) + '.' + bodyRut.substring(3, bodyRut.length)
                    break
                case 7: bodyRut = bodyRut.substring(0, 1) + '.' + bodyRut.substring(1, 4) + '.' + bodyRut.substring(4, bodyRut.length)
                    break
                case 8: bodyRut = bodyRut.substring(0, 2) + '.' + bodyRut.substring(2, 5) + '.' + bodyRut.substring(5, bodyRut.length)
                    break
                case 9: bodyRut = bodyRut.substring(0, 3) + '.' + bodyRut.substring(3, 6) + '.' + bodyRut.substring(6, bodyRut.length)
                    break
                case 10: bodyRut = bodyRut.substring(0, 4) + '.' + bodyRut.substring(4, 7) + '.' + bodyRut.substring(7, bodyRut.length)
                    break

            }

        }
    }
}