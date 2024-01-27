import axios from 'axios';

const sendContactForm = async (formData) => {
  try {
    // Realizar la solicitud al endpoint /send_mail del backend
    const response = await axios.post('http://localhost:5000/send_mail', formData);

    // Imprimir la respuesta en la consola
    console.log('Respuesta del servidor:', response.data);

    return response.data;  
  } catch (error) {
    // Manejar errores si la solicitud falla
    console.error('Error al enviar el formulario de contacto:', error);
    throw error;  
  }
};

export { sendContactForm };
