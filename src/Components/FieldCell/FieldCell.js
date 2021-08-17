import React, { useState, useEffect } from 'react';

import './FieldCell.css';

const FieldCell = ({
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

  const extraClassOpened =
    value === -1 ? ' field__cell_exploded' : ' field__cell_discovered';
  return (
    <div
      className={
        'field__cell' +
        (isPressed ? extraClassOpened : isFlagged ? ' field__cell_flagged' : '')
      }
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
