import React, { useState, useEffect } from 'react';

const MaquinaEscribirInquilino = () => {
  const [textoVisible, setTextoVisible] = useState('');
  const textoCompleto = [
    "¡Bienvenido a su página de Inquilino! Desde acá podrá ver sus cuentas y tareas pendientes, y visualizar su perfil de usuario.",
    "Para visualizar su perfil y editar su correo electrónico y contraseña si lo necesita, ingrese a su Perfil.",
    "Para visualizar sus tareas y cuentas pendientes, haga click en el ícono respectivo."
  ];

  useEffect(() => {
    let currentCharacterIndex = 0;
    let currentParagraphIndex = 0;
    let fullText = '';
    let paragraphCompleted = false;

    const intervalId = setInterval(() => {
      if (currentParagraphIndex < textoCompleto.length) {
        if (currentCharacterIndex < textoCompleto[currentParagraphIndex].length) {
          fullText += textoCompleto[currentParagraphIndex][currentCharacterIndex];
          setTextoVisible(fullText);
          currentCharacterIndex++;
        } else {
          paragraphCompleted = true;
        }

        if (paragraphCompleted) {
          if (currentParagraphIndex < textoCompleto.length - 1) {
            fullText += '<br />';
            setTextoVisible(fullText);
            currentParagraphIndex++;
            currentCharacterIndex = 0;
            paragraphCompleted = false;
          } else {
            clearInterval(intervalId);
          }
        }
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="quienes-somos-parrafo" dangerouslySetInnerHTML={{ __html: textoVisible }} />
  );
};

export default MaquinaEscribirInquilino;