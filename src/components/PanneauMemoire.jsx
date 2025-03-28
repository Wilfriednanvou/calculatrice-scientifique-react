import React from 'react';

const PanneauMemoire = React.memo(({ memoire }) => {
  const valeurMemoireActuelle = memoire.MPlus - memoire.MMoins;
  
  return (
    <div className="panneau-memoire">
      <h3>Mémoire</h3>
      {valeurMemoireActuelle === 0 ? (
        <p>La mémoire est vide</p>
      ) : (
        <div className="element-memoire">
          <div className="valeur-memoire">M = {valeurMemoireActuelle}</div>
          <div className="details-memoire">
            <div>M+ = {memoire.MPlus}</div>
            <div>M- = {memoire.MMoins}</div>
          </div>
        </div>
      )}
    </div>
  );
});

PanneauMemoire.displayName = 'PanneauMemoire';

export default PanneauMemoire;