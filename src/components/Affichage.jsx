import React, { useEffect, useRef } from 'react';

const Affichage = React.memo(({ affichage, formule }) => {
  const affichageRef = useRef(null);
  const estErreur = affichage === 'Erreur' || affichage.startsWith('Erreur:');
  
  // Effet pour ajuster la taille de la police lorsque le contenu est trop grand
  useEffect(() => {
    if (affichageRef.current) {
      const element = affichageRef.current;
      const parentWidth = element.parentElement.offsetWidth;
      
      // Réinitialiser d'abord la taille de police
      element.style.fontSize = '28px';
      
      // Si le contenu déborde, ajuster la taille de police
      if (element.scrollWidth > parentWidth) {
        const ratio = parentWidth / element.scrollWidth;
        const newSize = Math.max(16, Math.floor(28 * ratio)); // taille min: 16px
        element.style.fontSize = `${newSize}px`;
      }
    }
  }, [affichage]);
  
  return (
    <div 
      className="calculatrice-affichage" 
      role="textbox" 
      aria-live="polite"
      aria-atomic="true"
    >
      <div 
        className="formule" 
        aria-label="Formule de calcul"
        title={formule}
      >
        {formule}
      </div>
      <div 
        ref={affichageRef}
        className={`valeur-actuelle ${estErreur ? 'erreur' : ''}`}
        aria-label={estErreur ? "Erreur" : "Résultat actuel"}
        title={affichage}
      >
        {affichage}
      </div>
    </div>
  );
});

Affichage.displayName = 'Affichage';

export default Affichage;