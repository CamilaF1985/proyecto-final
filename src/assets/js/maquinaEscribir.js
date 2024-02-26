import React, { useState, useEffect } from 'react';

const MaquinaEscribir = () => {
  const [textoVisible, setTextoVisible] = useState('');
  const textoCompleto = [
    "¡Comparte una vivienda con más personas! No se preocupe... Nuestra aplicación está diseñada para distribuir, en forma equitativa, gastos y tareas domésticos entre cohabitantes.",
    "Si administra una vivienda compartida, regístrese y podrá registrar a sus inquilinos, y asignar nuevas tareas y gastos a su unidad habitacional. ¡La aplicación se encargará de distribuirlos!",
    "Tanto usted como los demás habitantes de la vivienda que administra, podrán ver sus gastos y tareas pendientes, y marcarlos como realizados, en las secciones 'Gastos pendientes' y 'Tareas Pendientes' respectivamente.", 
    "¡No olvide revisar el Panel de Administración para ver qué otras funcionalidades ofrece nuestra solución!"
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

export default MaquinaEscribir;








