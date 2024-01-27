const formatRut = (rut) => {

  if (rut == null || rut.length === 0) {
    return "";
  }

  let cont = 0;
  let formato;

  rut = rut.split('.').join('');
  rut = rut.split('-').join('');

  let regex = /^(\d*)[k|K|0-9]{1}$/;

  if (rut.length === 0) {
    return "";
  } else if (rut.length > 1 && regex.test(rut)) {
    formato = "-" + rut.substring(rut.length - 1);
    for (let i = rut.length - 2; i >= 0; i--) {
      formato = rut.substring(i, i + 1) + formato;
      cont++;
      if (cont === 3 && i !== 0) {
        formato = "." + formato;
        cont = 0;
      }
    }
    return formato;
  } else {
    return regex.test(rut) ? rut : formatRut(rut.substring(0, rut.length - 1));
  }
}

const format = {
  rut: formatRut
}

export default format;