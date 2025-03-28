import React from 'react';

export default function ClavierStandard({ 
  onNombreClick, 
  onOperateurClick, 
  onEgalClick, 
  onEffacerClick, 
  onRetourClick,
  onPourcentageClick,
  onChangementSigneClick,
  onMemoireClick
}) {
  return (
    <div className="calculatrice-clavier">
      <div className="ligne-clavier">
        <button className="bouton-memoire" onClick={() => onMemoireClick('MC')}>MC</button>
        <button className="bouton-memoire" onClick={() => onMemoireClick('MR')}>MR</button>
        <button className="bouton-memoire" onClick={() => onMemoireClick('M+')}>M+</button>
        <button className="bouton-memoire" onClick={() => onMemoireClick('M-')}>M-</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-effacer" onClick={onEffacerClick}>C</button>
        <button className="bouton-operation" onClick={onRetourClick}>⌫</button>
        <button className="bouton-operation" onClick={onPourcentageClick}>%</button>
        <button className="bouton-operateur" onClick={() => onOperateurClick('÷')}>÷</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-nombre" onClick={() => onNombreClick('7')}>7</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('8')}>8</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('9')}>9</button>
        <button className="bouton-operateur" onClick={() => onOperateurClick('×')}>×</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-nombre" onClick={() => onNombreClick('4')}>4</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('5')}>5</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('6')}>6</button>
        <button className="bouton-operateur" onClick={() => onOperateurClick('-')}>-</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-nombre" onClick={() => onNombreClick('1')}>1</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('2')}>2</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('3')}>3</button>
        <button className="bouton-operateur" onClick={() => onOperateurClick('+')}>+</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-operation" onClick={onChangementSigneClick}>±</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('0')}>0</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('.')}>.</button>
        <button className="bouton-egal" onClick={onEgalClick}>=</button>
      </div>
    </div>
  );
}