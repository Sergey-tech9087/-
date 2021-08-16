import React from 'react';

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
  onRestartGame: setStatusRestartGame,
  onStartGame: setStatusStartGame,
  onOpenCellWithStr: openCellWithStr,
  onToggleFlag: toggleFlag,
}) => {
  const generateFieldDivs = (field_size) => {
    const field_divs = [];
    field_divs.push(<div key="-А0"></div>);
    for (let i = 0; i < field_size.x; i++) {
      field_divs.push(
        <div className="field__letters" key={LETTERS[i]}>
          {LETTERS[i]}
        </div>
      );
    }
    for (let i = 1; i <= field_size.y; i++) {
      field_divs.push(
        <div className="field__numbers" key={i}>
          {i}
        </div>
      );
      for (let j = 0; j < field_size.x; j++) {
        field_divs.push(
          <FieldCell
            key={LETTERS[j] + i}
            key_str={LETTERS[j] + i}
            is_pressed={openedCellsMatrix[i - 1][j] === 1}
            is_flagged={openedCellsMatrix[i - 1][j] === -1}
            onPress={openCellWithStr}
            onRightClick={toggleFlag}
            value={fieldMatrix[i - 1][j]}
          />
        );
      }
    }
    return field_divs;
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
          >
            <span className="field__poster-text">
              {status === 'won' ? 'Победа!' : 'Проиграл!'}
            </span>
          </div>
        ) : null}
        {status === 'pause' ? (
          <div
            className={'field__poster field__poster_pause'}
            onClick={setStatusStartGame}
          >
            <span className="field__poster-text">{'Пауза!'}</span>
          </div>
        ) : null}
        {generateFieldDivs(fieldData)}
      </div>
    </main>
  );
};

export default Field;
