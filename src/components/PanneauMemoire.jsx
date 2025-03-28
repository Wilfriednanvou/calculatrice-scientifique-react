import React from 'react';

const PanneauMemoire = React.memo(({ memoire }) => {
  const valeurTotale = memoire.M;
  const valeurPositive = memoire.MPlus;
  const valeurNegative = memoire.MMoins;
  
  // Formatage du nombre pour l'affichage
  const formaterNombre = (nombre) => {
    if (nombre === 0) return '0';
    
    const valeurAbsolue = Math.abs(nombre);
    if (valeurAbsolue < 0.0000001 || valeurAbsolue > 9999999999) {
      return nombre.toExponential(6);
    }
    
    return parseFloat(nombre.toPrecision(10)).toString();
  };
  
  return (
    <div className="panneau-memoire" role="region" aria-label="État de la mémoire">
      <div className="memoire-header">
        <h3>Mémoire</h3>
      </div>
      <div className="element-memoire">
        <div className="valeur-memoire" aria-label="Valeur totale en mémoire">
          {formaterNombre(valeurTotale)}
        </div>
        <div className="details-memoire">
          <div>Additions (M+): {formaterNombre(valeurPositive)}</div>
          <div>Soustractions (M-): {formaterNombre(valeurNegative)}</div>
        </div>
      </div>
      <div className="memoire-aide">
        <h4>Utilisation de la mémoire</h4>
        <ul>
          <li><strong>M+</strong> - Ajoute la valeur actuelle à la mémoire</li>
          <li><strong>M-</strong> - Soustrait la valeur actuelle de la mémoire</li>
          <li><strong>MR</strong> - Rappelle la valeur en mémoire</li>
          <li><strong>MC</strong> - Efface la mémoire</li>
        </ul>
      </div>
    </div>
  );
});

PanneauMemoire.displayName = 'PanneauMemoire';

export default PanneauMemoire;