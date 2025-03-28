import { useState, useCallback, useRef, useMemo } from 'react';

export default function useCalculatrice() {
  const [affichage, setAffichage] = useState('0');
  const [formule, setFormule] = useState('');
  const [memoire, setMemoire] = useState({
    M: 0,
    MPlus: 0,
    MMoins: 0,
    MR: 0,
    MC: 0
  });
  const [historique, setHistorique] = useState([]);
  const [estEnRadians, setEstEnRadians] = useState(false);
  const [dernierResultat, setDernierResultat] = useState(null);
  
  // Cache des calculs pour éviter de recalculer les mêmes expressions
  const cacheCalculs = useRef(new Map());
  
  // Cache des validations pour éviter de revalider les mêmes formules
  const cacheValidations = useRef(new Map());
  
  // Vérification robuste de la validité d'une formule mathématique
  const estFormulaValide = useCallback((formule) => {
    // Vérifier le cache d'abord
    if (cacheValidations.current.has(formule)) {
      return cacheValidations.current.get(formule);
    }
    
    if (!formule || formule.trim() === '') {
      cacheValidations.current.set(formule, true);
      return true;
    }
    
    // Vérifier les parenthèses non équilibrées
    let compteurParentheses = 0;
    for (let i = 0; i < formule.length; i++) {
      if (formule[i] === '(') compteurParentheses++;
      if (formule[i] === ')') compteurParentheses--;
      if (compteurParentheses < 0) {
        cacheValidations.current.set(formule, false);
        return false;
      }
    }
    if (compteurParentheses !== 0) {
      cacheValidations.current.set(formule, false);
      return false;
    }
    
    // Vérifier les opérateurs consécutifs invalides (mais autoriser le moins après un opérateur)
    if (/[×÷][×÷+]/.test(formule)) {
      cacheValidations.current.set(formule, false);
      return false;
    }
    
    // Vérifier si termine par un opérateur (sauf si c'est un signe négatif après un autre opérateur)
    if (/[+×÷^]$/.test(formule)) {
      cacheValidations.current.set(formule, false);
      return false;
    }
    
    // Vérifier les fonctions sans argument
    const fonctionsRegex = /(?:sin|cos|tan|log|ln|sqrt)\($/;
    if (fonctionsRegex.test(formule)) {
      cacheValidations.current.set(formule, false);
      return false;
    }
    
    // Vérifier les divisions par zéro évidentes (plus exhaustif)
    if (/÷0(?![.]?\d)/.test(formule) || /÷\(0\)/.test(formule)) {
      cacheValidations.current.set(formule, false);
      return false;
    }
    
    // Si toutes les vérifications passent, la formule est valide
    cacheValidations.current.set(formule, true);
    return true;
  }, []);
  
  // Fonction optimisée pour effectuer des calculs
  const calculer = useCallback((formule) => {
    if (!formule) return { valeur: '0', erreur: false };
    
    // Vérifier si le calcul est dans le cache
    const cacheKey = `${formule}_${estEnRadians ? 'rad' : 'deg'}`;
    if (cacheCalculs.current.has(cacheKey)) {
      return cacheCalculs.current.get(cacheKey);
    }
    
    if (!estFormulaValide(formule)) {
      return { valeur: 'Erreur: formule invalide', erreur: true };
    }
    
    try {
      // Remplacer les fonctions mathématiques par leurs équivalents JavaScript
      let formuleModifiee = formule
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/e(?!\^)/g, 'Math.E');
      
      // Gestion des fonctions trigonométriques selon le mode (radians ou degrés)
      if (!estEnRadians) {
        // Conversion degrés → radians pour les fonctions trigonométriques
        formuleModifiee = formuleModifiee
          .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)')
          .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)')
          .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
      } else {
        formuleModifiee = formuleModifiee
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(');
      }
      
      // Autres fonctions mathématiques
      formuleModifiee = formuleModifiee
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/e\^/g, 'Math.exp(');
      
      // Utiliser Function au lieu de eval pour plus de sécurité
      // eslint-disable-next-line no-new-func
      const resultat = new Function('return ' + formuleModifiee)();
      
      // Validation des résultats
      if (isNaN(resultat)) {
        const reponse = { valeur: 'Erreur: résultat non numérique', erreur: true };
        cacheCalculs.current.set(cacheKey, reponse);
        return reponse;
      }
      
      if (!isFinite(resultat)) {
        const reponse = { 
          valeur: resultat > 0 ? 'Infinity' : '-Infinity', 
          erreur: false 
        };
        cacheCalculs.current.set(cacheKey, reponse);
        return reponse;
      }
      
      // Formatage optimal des nombres pour l'affichage
      const valeurAbsolue = Math.abs(resultat);
      let valeurFormatee;
      
      if (valeurAbsolue === 0) {
        valeurFormatee = '0';
      } else if (valeurAbsolue < 0.0000001 || valeurAbsolue > 9999999999) {
        // Notation scientifique pour les très grands ou très petits nombres
        valeurFormatee = resultat.toExponential(6);
      } else {
        // Limiter à 10 chiffres significatifs et supprimer les zéros inutiles
        valeurFormatee = String(parseFloat(resultat.toPrecision(10)));
      }
      
      const reponse = { valeur: valeurFormatee, erreur: false };
      
      // Gestion du cache avec une limite de taille
      if (cacheCalculs.current.size > 100) {
        // Supprimer l'entrée la plus ancienne si le cache est trop grand
        const oldestKey = cacheCalculs.current.keys().next().value;
        cacheCalculs.current.delete(oldestKey);
      }
      cacheCalculs.current.set(cacheKey, reponse);
      
      return reponse;
    } catch (error) {
      console.error("Erreur de calcul:", error);
      const reponse = { 
        valeur: `Erreur: ${error.message.substring(0, 30)}${error.message.length > 30 ? '...' : ''}`, 
        erreur: true 
      };
      cacheCalculs.current.set(cacheKey, reponse);
      return reponse;
    }
  }, [estEnRadians, estFormulaValide]);

  // Gestion optimisée de l'entrée des nombres
  const gererEntreeNombre = useCallback((num) => {
    setAffichage(prev => {
      if (prev === '0' || prev === 'Erreur' || prev.startsWith('Erreur:')) return num;
      // Éviter plusieurs points décimaux
      if (num === '.' && prev.includes('.')) return prev;
      return prev + num;
    });
    
    setFormule(prev => {
      // Si nous venons de calculer un résultat, recommencer avec le nouveau nombre
      if (dernierResultat !== null) {
        setDernierResultat(null);
        return num;
      }
      
      // Si le dernier caractère est une parenthèse fermante, ajouter un opérateur de multiplication implicite
      if (prev.endsWith(')')) {
        return prev + '×' + num;
      }
      
      // Si le dernier caractère est π ou e, ajouter un opérateur de multiplication implicite
      if (prev.endsWith('π') || prev.endsWith('e')) {
        return prev + '×' + num;
      }
      
      // Éviter plusieurs points décimaux dans le même nombre
      if (num === '.') {
        const partieActuelle = prev.split(/[+\-×÷(]/g).pop();
        if (partieActuelle && partieActuelle.includes('.')) return prev;
      }
      
      return prev + num;
    });
  }, [dernierResultat]);

  // Gestion optimisée de l'entrée des opérateurs
  const gererEntreeOperateur = useCallback((operateur) => {
    // Réinitialiser le dernier résultat
    setDernierResultat(null);
    
    // Vérifier le dernier caractère de la formule
    const dernierCaractere = formule.slice(-1);
    const estOperateur = ['+', '-', '×', '÷', '^'].includes(dernierCaractere);
    
    // Si on tente d'ajouter un opérateur après un autre opérateur, remplacer l'ancien
    // Sauf si c'est un moins (-) après une parenthèse ouvrante ou un autre opérateur (pour les nombres négatifs)
    if (estOperateur && ['+', '×', '÷', '^'].includes(operateur)) {
      setFormule(prev => prev.slice(0, -1) + operateur);
      setAffichage(operateur);
      return;
    }
    
    // Cas spécial: permettre le moins (-) après un opérateur pour les nombres négatifs
    if (estOperateur && operateur === '-') {
      setFormule(prev => prev + operateur);
      setAffichage(operateur);
      return;
    }
    
    // Cas où le résultat précédent est utilisé avec le nouvel opérateur
    if (dernierResultat !== null) {
      setFormule(dernierResultat + operateur);
      setAffichage(operateur);
      setDernierResultat(null);
      return;
    }
    
    // Empêcher les opérateurs au début sauf le moins (pour les nombres négatifs)
    // et les fonctions spéciales
    const fonctionsSpeciales = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'];
    if (formule === '' && operateur !== '-' && !fonctionsSpeciales.includes(operateur)) {
      return;
    }
    
    // Ajouter une parenthèse ouvrante après certaines fonctions
    if (fonctionsSpeciales.includes(operateur)) {
      setFormule(prev => prev + operateur + '(');
      setAffichage(operateur);
    } else {
      setFormule(prev => prev + operateur);
      setAffichage(operateur);
    }
  }, [formule, dernierResultat]);

  // Gestion des parenthèses
  const gererParenthese = useCallback((parenthese) => {
    // Cas spécial pour les parenthèses fermantes
    if (parenthese === ')') {
      // Vérifier s'il y a des parenthèses ouvrantes non fermées
      let ouvrantes = 0;
      let fermantes = 0;
      for (let i = 0; i < formule.length; i++) {
        if (formule[i] === '(') ouvrantes++;
        if (formule[i] === ')') fermantes++;
      }
      if (fermantes >= ouvrantes) return; // Ne pas ajouter de parenthèse fermante s'il n'y a pas d'ouvrante correspondante
    }
    
    // Pour la parenthèse ouvrante, ajouter un opérateur de multiplication si nécessaire
    if (parenthese === '(' && /[0-9πe]$/.test(formule)) {
      setFormule(prev => prev + '×(');
      setAffichage('(');
    } else {
      setAffichage(prev => prev === '0' || prev === 'Erreur' || prev.startsWith('Erreur:') ? parenthese : prev + parenthese);
      setFormule(prev => prev + parenthese);
    }
    setDernierResultat(null);
  }, [formule]);

  // Fonction d'égalité et de calcul
  const gererEgal = useCallback(() => {
    if (!formule) return;
    
    try {
      const resultatObj = calculer(formule);
      
      if (resultatObj.erreur) {
        setAffichage(resultatObj.valeur);
        return;
      }
      
      setAffichage(resultatObj.valeur);
      setDernierResultat(resultatObj.valeur);
      
      // Si la formule ne contient pas déjà un signe égal
      if (!formule.includes('=')) {
        const formuleComplete = formule + '=' + resultatObj.valeur;
        setFormule(formuleComplete);
        
        // Ajouter à l'historique uniquement si la formule est différente de la dernière entrée
        setHistorique(prev => {
          if (prev.length > 0 && prev[0].formule === formule) {
            return prev; // Ne pas ajouter de doublons
          }
          return [{ 
            formule, 
            resultat: resultatObj.valeur, 
            estEnRadians, 
            date: new Date() 
          }, ...prev].slice(0, 50); // Limiter à 50 entrées
        });
      }
    } catch (error) {
      setAffichage('Erreur: calcul impossible');
      console.error("Erreur lors du calcul:", error);
    }
  }, [formule, calculer, estEnRadians]);

  // Fonction pour effacer toute la formule
  const gererEffacer = useCallback(() => {
    setAffichage('0');
    setFormule('');
    setDernierResultat(null);
  }, []);

  // Fonction pour effacer un caractère
  const gererRetour = useCallback(() => {
    if (affichage === 'Erreur' || affichage.startsWith('Erreur:') || affichage.length <= 1) {
      setAffichage('0');
    } else {
      setAffichage(prev => prev.slice(0, -1) || '0');
    }
    
    setFormule(prev => {
      if (!prev || prev.length <= 1) return '';
      // Ne pas supprimer après un signe égal
      if (prev.includes('=')) return prev;
      
      // Si on supprime une fonction, supprimer la fonction entière
      const fonctions = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt('];
      for (const fnc of fonctions) {
        if (prev.endsWith(fnc)) {
          return prev.slice(0, prev.length - fnc.length);
        }
      }
      
      return prev.slice(0, -1);
    });
    
    setDernierResultat(null);
  }, [affichage]);

  // Fonction pour calculer le pourcentage
  const gererPourcentage = useCallback(() => {
    try {
      // Si nous avons une opération en cours, calculer le pourcentage du dernier nombre
      if (/[+\-×÷]/.test(formule)) {
        const parties = formule.split(/([+\-×÷])/);
        const dernierNombre = parties[parties.length - 1];
        const reste = formule.substring(0, formule.length - dernierNombre.length);
        
        const valeur = parseFloat(dernierNombre) / 100;
        setAffichage(String(valeur));
        setFormule(reste + valeur);
      } else {
        // Sinon, convertir le nombre actuel en pourcentage
        const valeur = parseFloat(affichage) / 100;
        setAffichage(String(valeur));
        setFormule(String(valeur));
      }
      
      setDernierResultat(null);
    } catch (error) {
      setAffichage('Erreur: opération impossible');
    }
  }, [affichage, formule]);

  // Fonction pour changer le signe
  const gererChangementSigne = useCallback(() => {
    if (affichage === '0' || affichage === 'Erreur' || affichage.startsWith('Erreur:')) return;
    
    setAffichage(prev => prev.startsWith('-') ? prev.substring(1) : '-' + prev);
    
    // Mise à jour de la formule selon le contexte
    setFormule(prev => {
      // Si la formule contient un signe égal, on ne modifie rien
      if (prev.includes('=')) return prev;
      
      // Si nous avons déjà une opération en cours
      if (/[+\-×÷^]/.test(prev)) {
        const parties = prev.split(/([+\-×÷^])/);
        const dernierNombre = parties[parties.length - 1];
        if (dernierNombre) {
          const reste = prev.substring(0, prev.length - dernierNombre.length);
          return reste + (dernierNombre.startsWith('-') ? dernierNombre.substring(1) : '-' + dernierNombre);
        }
      }
      return prev.startsWith('-') ? prev.substring(1) : '-' + prev;
    });
    
    setDernierResultat(null);
  }, [affichage]);

  // Fonction pour les opérations de mémoire
  const gererOperationMemoire = useCallback((operation) => {
    const valeurActuelle = parseFloat(affichage) || 0;
    
    switch (operation) {
      case 'M+':
        setMemoire(prev => ({
          ...prev, 
          MPlus: prev.MPlus + valeurActuelle, 
          M: prev.M + valeurActuelle
        }));
        break;
      case 'M-':
        setMemoire(prev => ({
          ...prev, 
          MMoins: prev.MMoins + valeurActuelle, 
          M: prev.M - valeurActuelle
        }));
        break;
      case 'MR':
        const valeurMemoire = memoire.M;
        setAffichage(String(valeurMemoire));
        // Si nous sommes en début de formule ou après un opérateur
        if (!formule || /[+\-×÷^(]$/.test(formule)) {
          setFormule(prev => prev + valeurMemoire);
        } else {
          setFormule(String(valeurMemoire));
        }
        break;
      case 'MC':
        setMemoire({ M: 0, MPlus: 0, MMoins: 0, MR: 0, MC: 0 });
        break;
      default:
        break;
    }
  }, [affichage, formule, memoire]);

  // Fonction pour basculer entre degrés et radians
  const basculerModeAngle = useCallback(() => {
    setEstEnRadians(prev => !prev);
    // Vider le cache lors du changement de mode pour forcer le recalcul
    cacheCalculs.current.clear();
  }, []);
  
  // Fonction pour réutiliser un calcul de l'historique
  const reutiliserHistorique = useCallback((formuleHistorique, resultatHistorique, modeRadiansHistorique) => {
    // Ne garder que la partie avant le signe égal
    const formuleBase = formuleHistorique.split('=')[0];
    setAffichage(resultatHistorique);
    setFormule(formuleBase);
    setDernierResultat(resultatHistorique);
    
    // Restaurer le mode radians/degrés utilisé pour ce calcul si disponible
    if (modeRadiansHistorique !== undefined && modeRadiansHistorique !== estEnRadians) {
      setEstEnRadians(modeRadiansHistorique);
      cacheCalculs.current.clear();
    }
  }, [estEnRadians]);
  
  // Fonction pour effacer l'historique
  const effacerHistorique = useCallback(() => {
    setHistorique([]);
  }, []);

  // Expose toutes les fonctions et états nécessaires
  return {
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
  };
}