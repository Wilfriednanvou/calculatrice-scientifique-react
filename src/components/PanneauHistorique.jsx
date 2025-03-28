import React, { useCallback } from 'react';

// Fonction utilitaire pour formater les dates de manière conviviale
const formatDate = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diff = now - date;
  
  // Si moins d'une minute
  if (diff < 60000) {
    return "À l'instant";
  }
  // Si moins d'une heure
  else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  // Si aujourd'hui
  else if (date.toDateString() === now.toDateString()) {
    return `Aujourd'hui à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  // Si hier
  else if (new Date(now - 86400000).toDateString() === date.toDateString()) {
    return `Hier à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  // Sinon
  else {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
};

const PanneauHistorique = React.memo(({ historique, onSelectHistorique, onEffacerHistorique }) => {
  // Gestionnaire pour la navigation au clavier
  const handleKeyDown = useCallback((e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectHistorique(item.formule, item.resultat, item.estEnRadians);
    }
  }, [onSelectHistorique]);

  // Si l'historique est vide
  if (!historique || historique.length === 0) {
    return (
      <div className="panneau-historique" role="region" aria-label="Historique des calculs">
        <h3>Historique</h3>
        <p className="historique-vide">Aucun calcul récent</p>
      </div>
    );
  }

  return (
    <div className="panneau-historique" role="region" aria-label="Historique des calculs">
      <div className="historique-header">
        <h3>Historique</h3>
        <button 
          className="bouton-effacer-historique" 
          onClick={onEffacerHistorique}
          aria-label="Effacer tout l'historique"
        >
          Effacer
        </button>
      </div>
      <div className="liste-historique">
        {historique.map((item, index) => (
          <div 
            key={index} 
            className="element-historique"
            onClick={() => onSelectHistorique(item.formule, item.resultat, item.estEnRadians)}
            tabIndex={0}
            role="button"
            aria-label={`Formule: ${item.formule}, Résultat: ${item.resultat}`}
            onKeyDown={(e) => handleKeyDown(e, item)}
          >
            <div className="formule-historique" title={item.formule}>
              {item.formule}
            </div>
            <div className="resultat-historique" title={item.resultat}>
              {item.resultat}
            </div>
            <div className="details-historique">
              <span className="date-historique">{formatDate(item.date)}</span>
              {item.estEnRadians !== undefined && (
                <span className="mode-historique">
                  {item.estEnRadians ? 'Radians' : 'Degrés'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PanneauHistorique.displayName = 'PanneauHistorique';

export default PanneauHistorique;