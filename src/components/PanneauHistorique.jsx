import React from 'react';

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
            onClick={() => onSelectHistorique(item.formule, item.resultat)}
            tabIndex={0}
            role="button"
            aria-label={`Formule: ${item.formule}, Résultat: ${item.resultat}`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectHistorique(item.formule, item.resultat);
              }
            }}
          >
            <div className="formule-historique">{item.formule}</div>
            <div className="resultat-historique">{item.resultat}</div>
            {item.date && (
              <div className="date-historique">{formatDate(item.date)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

PanneauHistorique.displayName = 'PanneauHistorique';

export default PanneauHistorique;