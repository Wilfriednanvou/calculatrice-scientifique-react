import React, { useEffect, useRef, useState } from 'react';

const Affichage = React.memo(({ affichage, formule }) => {
  const affichageRef = useRef(null);
  const formuleRef = useRef(null);
  const [resizing, setResizing] = useState(false);
  const estErreur = affichage === 'Erreur' || affichage.startsWith('Erreur:');
  
  // Effet pour ajuster la taille de la police dynamiquement
  useEffect(() => {
    if (affichageRef.current) {
      const element = affichageRef.current;
      const parentWidth = element.parentElement.offsetWidth;
      
      // Éviter le redimensionnement pendant les animations
      if (resizing) return;
      
      setResizing(true);
      
      // Réinitialiser d'abord la taille de police
      element.style.fontSize = '28px';
      
      // Si le contenu déborde, ajuster la taille de police
      if (element.scrollWidth > parentWidth) {
        const ratio = parentWidth / element.scrollWidth;
        const newSize = Math.max(16, Math.floor(28 * ratio)); // taille min: 16px
        element.style.fontSize = `${newSize}px`;
      }
      
      // Ajuster également la taille de la formule si nécessaire
      if (formuleRef.current) {
        const formulElement = formuleRef.current;
        const formuleParentWidth = formulElement.parentElement.offsetWidth;
        
        formulElement.style.fontSize = '14px';
        
        if (formulElement.scrollWidth > formuleParentWidth) {
          const ratio = formuleParentWidth / formulElement.scrollWidth;
          const newSize = Math.max(10, Math.floor(14 * ratio)); // taille min: 10px
          formulElement.style.fontSize = `${newSize}px`;
        }
      }
      
      // Rétablir l'état après le redimensionnement
      setTimeout(() => setResizing(false), 100);
    }
  }, [affichage, formule, resizing]);
  
  return (
    <div 
      className="calculatrice-affichage" 
      role="textbox" 
      aria-live="polite"
      aria-atomic="true"
    >
      <div 
        ref={formuleRef}
        className="formule" 
        aria-label="Formule de calcul"
        title={formule}
      >
        {formule}
      </div>
      <div 
        ref={affichageRef}
        className={`valeur-actuelle ${estErreur ? 'erreur' : ''} ${affichage !== '0' && !estErreur ? 'resultat-calcule' : ''}`}
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