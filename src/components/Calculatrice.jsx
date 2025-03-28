import React, { useState, useEffect, useCallback, useRef } from 'react';
import Affichage from './Affichage';
import ClavierStandard from './ClavierStandard';
import ClavierScientifique from './ClavierScientifique';
import PanneauHistorique from './PanneauHistorique';
import PanneauMemoire from './PanneauMemoire';
import useCalculatrice from '../hooks/useCalculatrice';
import '../styles/Calculatrice.css';

export default function Calculatrice() {
  const [afficherHistorique, setAfficherHistorique] = useState(false);
  const [afficherMemoire, setAfficherMemoire] = useState(false);
  const [modeScientifique, setModeScientifique] = useState(() => {
    // Restaurer depuis localStorage si disponible
    const savedMode = localStorage.getItem('calculatrice-mode-scientifique');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [themeSombre, setThemeSombre] = useState(() => {
    // Vérifier d'abord localStorage pour la préférence utilisateur
    const savedTheme = localStorage.getItem('calculatrice-theme-sombre');
    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }
    // Sinon utiliser les préférences système
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Ref pour savoir si c'est le premier rendu
  const firstRender = useRef(true);
  
  const {
    affichage,
    formule,
    memoire,
    historique,
    estEnRadians,
    gererEntreeNombre,
    gererEntreeOperateur,
    gererParenthese,
    gererEgal,
    gererEffacer,
    gererRetour,
    gererPourcentage,
    gererChangementSigne,
    gererOperationMemoire,
    basculerModeAngle,
    reutiliserHistorique,
    effacerHistorique
  } = useCalculatrice();

  const basculerTheme = useCallback(() => {
    setThemeSombre(prev => !prev);
  }, []);
  
  // Sauvegarde des préférences utilisateur
  useEffect(() => {
    if (!firstRender.current) {
      localStorage.setItem('calculatrice-theme-sombre', JSON.stringify(themeSombre));
      localStorage.setItem('calculatrice-mode-scientifique', JSON.stringify(modeScientifique));
    } else {
      firstRender.current = false;
    }
  }, [themeSombre, modeScientifique]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const gererToucheClavier = (e) => {
      // Empêcher les comportements par défaut pour certaines touches
      if (['+', '-', '*', '/', '=', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      // Gestion des entrées numériques
      if (/^[0-9]$/.test(e.key)) {
        gererEntreeNombre(e.key);
      }
      // Gestion des opérateurs
      else if (e.key === '+') {
        gererEntreeOperateur('+');
      }
      else if (e.key === '-') {
        gererEntreeOperateur('-');
      }
      else if (e.key === '*') {
        gererEntreeOperateur('×');
      }
      else if (e.key === '/') {
        gererEntreeOperateur('÷');
      }
      else if (e.key === '^') {
        gererEntreeOperateur('^');
      }
      else if (e.key === '.') {
        gererEntreeNombre('.');
      }
      else if (e.key === 'Enter' || e.key === '=') {
        gererEgal();
      }
      else if (e.key === 'Escape') {
        gererEffacer();
      }
      else if (e.key === 'Backspace') {
        gererRetour();
      }
      else if (e.key === '%') {
        gererPourcentage();
      }
      else if (e.key === '(' || e.key === ')') {
        gererParenthese(e.key);
      }
      // Touches pour mode scientifique
      else if (e.key.toLowerCase() === 's' && e.ctrlKey && modeScientifique) {
        gererEntreeOperateur('sin');
      }
      else if (e.key.toLowerCase() === 'c' && e.ctrlKey && modeScientifique) {
        gererEntreeOperateur('cos');
      }
      else if (e.key.toLowerCase() === 't' && e.ctrlKey && modeScientifique) {
        gererEntreeOperateur('tan');
      }
      else if (e.key.toLowerCase() === 'l' && e.ctrlKey && modeScientifique) {
        gererEntreeOperateur('log');
      }
      else if (e.key.toLowerCase() === 'n' && e.ctrlKey && modeScientifique) {
        gererEntreeOperateur('ln');
      }
      else if (e.key.toLowerCase() === 'r' && e.ctrlKey && modeScientifique) {
        gererEntreeOperateur('sqrt');
      }
      else if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault();
        gererEntreeNombre('π');
      }
      else if (e.key.toLowerCase() === 'e' && e.ctrlKey) {
        e.preventDefault();
        gererEntreeNombre('e');
      }
      // Bascule entre mode standard et scientifique
      else if (e.key === 'm' && e.ctrlKey) {
        e.preventDefault();
        setModeScientifique(prev => !prev);
      }
      // Bascule d'affichage de l'historique
      else if (e.key === 'h' && e.ctrlKey) {
        e.preventDefault();
        setAfficherHistorique(prev => !prev);
        setAfficherMemoire(false);
      }
      // Bascule d'affichage de la mémoire
      else if (e.key === 'j' && e.ctrlKey) {
        e.preventDefault();
        setAfficherMemoire(prev => !prev);
        setAfficherHistorique(false);
      }
      // Bascule du thème
      else if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault();
        basculerTheme();
      }
    };

    window.addEventListener('keydown', gererToucheClavier);
    return () => {
      window.removeEventListener('keydown', gererToucheClavier);
    };
  }, [
    gererEntreeNombre, 
    gererEntreeOperateur, 
    gererParenthese, 
    gererEgal, 
    gererEffacer, 
    gererRetour, 
    gererPourcentage,
    modeScientifique,
    basculerTheme
  ]);

  // Détection des changements dans les préférences du système d'exploitation
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const gererChangementPreference = (e) => {
      // Ne pas remplacer une préférence définie manuellement
      if (localStorage.getItem('calculatrice-theme-sombre') === null) {
        setThemeSombre(e.matches);
      }
    };
    
    // Certains navigateurs utilisent addEventListener, d'autres change
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', gererChangementPreference);
    } else {
      mediaQuery.addListener(gererChangementPreference);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', gererChangementPreference);
      } else {
        mediaQuery.removeListener(gererChangementPreference);
      }
    };
  }, []);

  // Appliquer le thème à l'ensemble du document
  useEffect(() => {
    document.body.classList.toggle('theme-sombre-global', themeSombre);
  }, [themeSombre]);

  return (
    <div className={`conteneur-calculatrice ${themeSombre ? 'theme-sombre' : ''}`}>
      <div className={`calculatrice ${modeScientifique ? 'scientifique' : ''}`}>
        <div className="barre-options">
          <div className="options-gauche">
            <span className="calculatrice-titre">
              {modeScientifique ? 'Calculatrice scientifique' : 'Calculatrice standard'}
            </span>
          </div>
          <div className="options-droite">
            <button 
              className="bouton-theme" 
              onClick={basculerTheme}
              title={themeSombre ? "Passer au thème clair" : "Passer au thème sombre"}
              aria-label={themeSombre ? "Passer au thème clair" : "Passer au thème sombre"}
            >
              {themeSombre ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        
        <Affichage affichage={affichage} formule={formule} />
        
        <div className="bascules-mode" role="tablist">
          <button 
            className={`bascule-mode ${modeScientifique ? '' : 'actif'}`}
            onClick={() => setModeScientifique(false)}
            role="tab"
            aria-selected={!modeScientifique}
            aria-controls="clavier-standard"
          >
            Standard
          </button>
          <button 
            className={`bascule-mode ${modeScientifique ? 'actif' : ''}`}
            onClick={() => setModeScientifique(true)}
            role="tab"
            aria-selected={modeScientifique}
            aria-controls="clavier-scientifique"
          >
            Scientifique
          </button>
          <button 
            className={`bascule-mode ${afficherHistorique ? 'actif' : ''}`}
            onClick={() => {
              setAfficherHistorique(!afficherHistorique);
              setAfficherMemoire(false);
            }}
            role="tab"
            aria-selected={afficherHistorique}
            aria-controls="panneau-historique"
          >
            Historique
          </button>
          <button 
            className={`bascule-mode ${afficherMemoire ? 'actif' : ''}`}
            onClick={() => {
              setAfficherMemoire(!afficherMemoire);
              setAfficherHistorique(false);
            }}
            role="tab"
            aria-selected={afficherMemoire}
            aria-controls="panneau-memoire"
          >
            Mémoire
          </button>
        </div>
        
        <div role="tabpanel" id={modeScientifique ? "clavier-scientifique" : "clavier-standard"}>
          {modeScientifique ? (
            <ClavierScientifique 
              onNombreClick={gererEntreeNombre}
              onOperateurClick={gererEntreeOperateur}
              onParentheseClick={gererParenthese}
              onEgalClick={gererEgal}
              onEffacerClick={gererEffacer}
              onRetourClick={gererRetour}
              onPourcentageClick={gererPourcentage}
              onChangementSigneClick={gererChangementSigne}
              onMemoireClick={gererOperationMemoire}
              onBasculeAngleClick={basculerModeAngle}
              estEnRadians={estEnRadians}
            />
          ) : (
            <ClavierStandard 
              onNombreClick={gererEntreeNombre}
              onOperateurClick={gererEntreeOperateur}
              onEgalClick={gererEgal}
              onEffacerClick={gererEffacer}
              onRetourClick={gererRetour}
              onPourcentageClick={gererPourcentage}
              onChangementSigneClick={gererChangementSigne}
              onMemoireClick={gererOperationMemoire}
            />
          )}
        </div>
        
        <div className="info-raccourcis">
          <details>
            <summary>Raccourcis clavier disponibles</summary>
            <div className="liste-raccourcis">
              <div className="colonne-raccourcis">
                <p><kbd>Ctrl</kbd> + <kbd>M</kbd> : Changer de mode</p>
                <p><kbd>Ctrl</kbd> + <kbd>H</kbd> : Afficher l'historique</p>
                <p><kbd>Ctrl</kbd> + <kbd>J</kbd> : Afficher la mémoire</p>
                <p><kbd>Ctrl</kbd> + <kbd>D</kbd> : Changer de thème</p>
                <p><kbd>Ctrl</kbd> + <kbd>P</kbd> : Pi (π)</p>
                <p><kbd>Ctrl</kbd> + <kbd>E</kbd> : Nombre d'Euler (e)</p>
              </div>
              <div className="colonne-raccourcis">
                <p><kbd>Entrée</kbd> ou <kbd>=</kbd> : Calculer</p>
                <p><kbd>Echap</kbd> : Effacer</p>
                <p><kbd>Retour</kbd> : Supprimer le dernier caractère</p>
                <p><kbd>+</kbd>, <kbd>-</kbd>, <kbd>*</kbd>, <kbd>/</kbd>, <kbd>^</kbd> : Opérateurs</p>
                <p><kbd>(</kbd>, <kbd>)</kbd> : Parenthèses</p>
                <p><kbd>%</kbd> : Pourcentage</p>
              </div>
            </div>
          </details>
        </div>
      </div>
      
      {afficherHistorique && (
        <div role="tabpanel" id="panneau-historique">
          <PanneauHistorique 
            historique={historique} 
            onSelectHistorique={reutiliserHistorique}
            onEffacerHistorique={effacerHistorique}
          />
        </div>
      )}
      
      {afficherMemoire && (
        <div role="tabpanel" id="panneau-memoire">
          <PanneauMemoire memoire={memoire} />
        </div>
      )}
    </div>
  );
}