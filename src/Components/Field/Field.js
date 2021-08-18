import React, { useEffect } from 'react';

import './Field.css';
import FieldCell from '../FieldCell/FieldCell';
//import flag from '../../Assets/flag_white.svg';

const Field = ({
  difficulty,
  status,
  fieldData,
  fieldMatrix,
  openedCellsMatrix,
  LETTERS,
  onSetStatusRestartGame: setStatusRestartGame,
  onSetStatusStartGame: setStatusStartGame,
  onOpenCellWithStr: openCellWithStr,
  onToggleFlag: toggleFlag,
  onMessageNotification: messageNotification,
}) => {
  useEffect(() => {
    if (status === 'won') {
      messageNotification('Завершение игры', 'Победа!', 'success');
    } else if (status === 'lost') {
      messageNotification('Завершение игры', 'Поражение!', 'danger');
    } else if (status === 'pause') {
      messageNotification('Пауза', 'Игра приостановлена!', 'warning');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Генерация ячеек игрового поля
  const generateFieldDivs = (fieldSize) => {
    const fieldDivs = [];
    fieldDivs.push(<div key="-А0"></div>);
    for (let i = 0; i < fieldSize.x; i++) {
      fieldDivs.push(
        <div className="field__letters" key={LETTERS[i]}>
          {LETTERS[i]}
        </div>
      );
    }
    for (let i = 1; i <= fieldSize.y; i++) {
      fieldDivs.push(
        <div className="field__numbers" key={i}>
          {i}
        </div>
      );
      for (let j = 0; j < fieldSize.x; j++) {
        fieldDivs.push(
          <FieldCell
            key={LETTERS[j] + i}
            keyStr={LETTERS[j] + i}
            pressed={openedCellsMatrix[i - 1][j] === 1}
            flagged={openedCellsMatrix[i - 1][j] === -1}
            onPress={openCellWithStr}
            onRightClick={toggleFlag}
            value={fieldMatrix[i - 1][j]}
          />
        );
      }
    }
    return fieldDivs;
  };

  return (
    <main className="main">
      <div className={'field field_' + difficulty}>
        {status === 'won' || status === 'lost' ? (
          <div
            className={
              'field__poster' +
              (status === 'won' ? ' field__poster_win' : ' field__poster_lose')
            }
            onClick={setStatusRestartGame}
          ></div>
        ) : null}
        {status === 'pause' ? (
          <div
            className={'field__poster field__poster_pause'}
            onClick={setStatusStartGame}
          ></div>
        ) : null}
        {generateFieldDivs(fieldData)}
      </div>
    </main>
  );
};

export default Field;
