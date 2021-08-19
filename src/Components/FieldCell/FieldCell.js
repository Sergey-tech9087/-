import React, { useState, useEffect } from 'react';

import FlagWhite from '../../Assets/FlagWhite.svg';
import Bomb from '../../Assets/Bomb.svg';

import './FieldCell.css';

const FieldCell = ({
  assistantCharacter,
  keyStr,
  pressed,
  flagged,
  onPress: openCellWithStr,
  onRightClick: toggleFlag,
  value,
}) => {
  const [isPressed, setPressed] = useState(false);
  const [isFlagged, setFlagged] = useState(false);

  // Обработка нажатия кнопки мыши и установки флага
  useEffect(() => {
    setPressed(pressed);
    setFlagged(flagged);
  }, [pressed, flagged]);

  // Обработка клика мыши
  const thisPress = () => {
    openCellWithStr(keyStr);
  };

  // Обработка нажатия правой кнопки мыши
  const thisRightClick = (e) => {
    e.preventDefault();
    toggleFlag(keyStr);
  };

  const extraClassStyle = () => {
    let tempClassStyle = {
      backgroundColor: null,
      backgroundImage: null,
    };

    if (!isPressed) {
      tempClassStyle.backgroundColor =
        assistantCharacter === 'sber'
          ? 'rgb(33, 160, 56, 0.5)'
          : assistantCharacter === 'eva'
          ? 'rgb(7, 140, 228, 0.5)'
          : 'rgb(181, 89, 243, 0.5)';
    } else if (value !== -1) {
      tempClassStyle.backgroundColor =
        assistantCharacter === 'sber'
          ? '#21A038'
          : assistantCharacter === 'eva'
          ? '#078CE4'
          : '#B559F3';
    } else {
      tempClassStyle.backgroundColor = 'tomato';
      tempClassStyle.backgroundImage = `url(${Bomb})`;
    }

    if (isFlagged) tempClassStyle.backgroundImage = `url(${FlagWhite})`;

    return tempClassStyle;
  };

  return (
    <div
      className={'field__cell'}
      style={extraClassStyle()}
      onClick={thisPress}
      onContextMenu={(e) => thisRightClick(e)}
      data-x={keyStr.charAt(0)}
      data-y={keyStr.substr(1)}
    >
      {isPressed && value !== -1 ? value : null}
    </div>
  );
};

export default FieldCell;
