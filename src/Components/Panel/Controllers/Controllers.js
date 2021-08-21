import React from 'react';

import { Button, Radiobox } from '@sberdevices/plasma-ui';

import './Controllers.css';

const Controllers = ({
  assistantRef,
  difficulty,
  onChangeDifficulty: changeDifficulty,
  onSetStatusRestartGame: setStatusRestartGame,
  onSetStatusPauseGame: setStatusPauseGame,
  onSetHelpActive: setHelpActive,
  onHelpText: helpText,
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
            label="Профессионал"
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
            setStatusRestartGame();
          }}
        >
          Новая игра
        </Button>

        <Button
          className="btn"
          view="primary"
          size="s"
          onClick={() => {
            setStatusPauseGame();
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
            assistantRef.current.sendData({
              action: {
                action_id: 'saHelp',
                parameters: {
                  text: ``,
                },
              },
            });
          }}
        >
          Правила
        </Button>
      </div>
    </div>
  );
};

export default Controllers;
