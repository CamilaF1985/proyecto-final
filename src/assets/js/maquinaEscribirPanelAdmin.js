import React, { useState, useEffect } from 'react';

const MaquinaEscribirPanelAdmin = () => {
  const [textoVisible, setTextoVisible] = useState('');
  const textoCompleto = [
    "¡Bienvenido al panel de Administración! Desde acá podrá gestionar los inquilinos, tareas y gastos de su unidad habitacional.",
    "Para agregar o eliminar tareas, gastos o inquilinos, solo haga click en el enlace correspondiente.",
    "De igual modo, podrá editar la dirección de su unidad habitacional si lo requiere."
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

export default MaquinaEscribirPanelAdmin;