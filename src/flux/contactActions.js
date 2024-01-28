import axios from 'axios';

const sendContactForm = async (formData) => {
  try {
    // Realizar la solicitud a la api
    const response = await axios.post('http://localhost:5000/send_mail', formData);
    console.log('Respuesta del servidor:', response.data); // Imprimir la respuesta en la consola
    return response.data;  
  } catch (error) {
    console.error('Error al enviar el formulario de contacto:', error); // Manejar errores si la solicitud falla
    throw error;  
  }
};
export { sendContactForm };
