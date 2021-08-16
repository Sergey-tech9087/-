import React, { useState, useEffect } from 'react';

import './FieldCell.css';

const FieldCell = ({
  key_str,
  is_pressed,
  is_flagged,
  onPress: openCellWithStr,
  onRightClick: toggleFlag,
  value,
}) => {
  const [isPressed, setPressed] = useState(false);
  const [isFlagged, setFlagged] = useState(false);

  useEffect(() => {
    setPressed(is_pressed);
    setFlagged(is_flagged);
  }, [is_pressed, is_flagged]);

  const thisPress = () => {
    openCellWithStr(key_str);
  };

  const thisRightClick = (e) => {
    e.preventDefault();
    toggleFlag(key_str);
  };

  const extra_class_opened =
    value === -1 ? ' field__cell_exploded' : ' field__cell_discovered';
  return (
    <div
      className={
        'field__cell' +
        (isPressed
          ? extra_class_opened
          : isFlagged
          ? ' field__cell_flagged'
          : '')
      }
      onClick={thisPress}
      onContextMenu={(e) => thisRightClick(e)}
      data-x={key_str.charAt(0)}
      data-y={key_str.substr(1)}
    >
      {isPressed && value !== -1 ? value : null}
    </div>
  );
};

export default FieldCell;
