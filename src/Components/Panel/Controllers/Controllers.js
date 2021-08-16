import React from 'react';

import { Button, Radiobox } from '@sberdevices/plasma-ui';

import './Controllers.css';

const Controllers = ({
  difficulty,
  onChangeDifficulty: changeDifficulty,
  onRestart: restartGame,
  onPauseGame: pauseGame,
  onHelpActive: setHelpActive,
}) => {
  return (
    <div className="controller-container">
      <div className="radio-group">
        <div>
          <Radiobox
            id="1"
            name="Difficulty"
            label="Новичок"
            value="beginner"
            checked={difficulty === 'beginner' ? true : false}
            onChange={(e) => {
              changeDifficulty(e.currentTarget.value);
            }}
          />
        </div>

        <div className="radio">
          <Radiobox
            name="Difficulty"
            label="Любитель"
            value="amateur"
            checked={difficulty === 'amateur' ? true : false}
            onChange={(e) => {
              changeDifficulty(e.currentTarget.value);
            }}
          />
        </div>

        <div className="radio">
          <Radiobox
            name="Difficulty"
            label="Профи"
            value="profi"
            checked={difficulty === 'profi' ? true : false}
            onChange={(e) => {
              changeDifficulty(e.currentTarget.value);
            }}
          />
        </div>
      </div>

      <div className="btn-group">
        <Button
          view="primary"
          size="s"
          onClick={() => {
            restartGame();
          }}
        >
          Новая игра
        </Button>

        <Button
          className="btn"
          view="primary"
          size="s"
          onClick={() => {
            pauseGame();
          }}
        >
          Пауза
        </Button>

        <Button
          className="btn"
          view="primary"
          size="s"
          onClick={() => {
            setHelpActive(true);
          }}
        >
          Правила
        </Button>
      </div>
    </div>
  );
};

export default Controllers;
