import React from 'react';

export default function ClavierScientifique({ 
  onNombreClick, 
  onOperateurClick, 
  onEgalClick, 
  onEffacerClick,
  onRetourClick,
  onPourcentageClick,
  onChangementSigneClick,
  onMemoireClick,
  onParentheseClick,
  onBasculeAngleClick,
  estEnRadians
}) {
  return (
    <div className="calculatrice-clavier scientifique">
      <div className="ligne-clavier">
        <button className="bouton-memoire" onClick={() => onMemoireClick('MC')}>MC</button>
        <button className="bouton-memoire" onClick={() => onMemoireClick('MR')}>MR</button>
        <button className="bouton-memoire" onClick={() => onMemoireClick('M+')}>M+</button>
        <button className="bouton-memoire" onClick={() => onMemoireClick('M-')}>M-</button>
      </div>

      <div className="ligne-clavier">
        <button 
          className="bouton-scientifique"
          onClick={onBasculeAngleClick}
        >
          {estEnRadians ? 'RAD' : 'DEG'}
        </button>
        <button className="bouton-operation" onClick={onEffacerClick}>C</button>
        <button className="bouton-operation" onClick={onRetourClick}>⌫</button>
        <button className="bouton-operateur" onClick={() => onOperateurClick('÷')}>÷</button>
      </div>

      <div className="ligne-clavier">
        <button className="bouton-scientifique" onClick={() => onOperateurClick('sin')}>sin</button>
        <button className="bouton-scientifique" onClick={() => onOperateurClick('cos')}>cos</button>
        <button className="bouton-scientifique" onClick={() => onOperateurClick('tan')}>tan</button>
        <button className="bouton-operateur" onClick={() => onOperateurClick('×')}>×</button>
      </div>

      <div className="ligne-clavier">
        <button className="bouton-scientifique" onClick={() => onOperateurClick('log')}>log</button>
        <button className="bouton-scientifique" onClick={() => onOperateurClick('ln')}>ln</button>
        <button className="bouton-scientifique" onClick={() => onOperateurClick('e^')}>e^x</button>
        <button className="bouton-operateur" onClick={() => onOperateurClick('-')}>-</button>
      </div>

      <div className="ligne-clavier">
        <button className="bouton-scientifique" onClick={() => onOperateurClick('sqrt')}>√</button>
        <button className="bouton-scientifique" onClick={() => onOperateurClick('^')}>x^y</button>
        <button className="bouton-scientifique" onClick={() => onOperateurClick('π')}>π</button>
        <button className="bouton-operateur" onClick={() => onOperateurClick('+')}>+</button>
      </div>

      <div className="ligne-clavier">
        <button className="bouton-scientifique" onClick={() => onParentheseClick('(')}>(</button>
        <button className="bouton-scientifique" onClick={() => onParentheseClick(')')}>)</button>
        <button className="bouton-operation" onClick={onPourcentageClick}>%</button>
        <button className="bouton-operation" onClick={onChangementSigneClick}>±</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-nombre" onClick={() => onNombreClick('7')}>7</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('8')}>8</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('9')}>9</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('e')}>e</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-nombre" onClick={() => onNombreClick('4')}>4</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('5')}>5</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('6')}>6</button>
        <button className="bouton-egal" rowSpan="2" onClick={onEgalClick}>=</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-nombre" onClick={() => onNombreClick('1')}>1</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('2')}>2</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('3')}>3</button>
      </div>
      
      <div className="ligne-clavier">
        <button className="bouton-nombre bouton-zero" onClick={() => onNombreClick('0')}>0</button>
        <button className="bouton-nombre" onClick={() => onNombreClick('.')}>.</button>
      </div>
    </div>
  );
}