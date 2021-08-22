import React from 'react';

import { Button, Radiobox } from '@sberdevices/plasma-ui';

import './Controllers.css';

const Controllers = ({
  assistantRef,
  status,
  difficulty,
  onChangeDifficulty: changeDifficulty,
  onSetStatusRestartGame: setStatusRestartGame,
  onSetStatusPauseGame: setStatusPauseGame,
  onSetHelpActive: setHelpActive,
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
            disabled={
              status !== 'not_started' && status !== 'new' ? true : false
            }
            checked={difficulty === 'beginner' ? true : false}
            onChange={(e) => {
              changeDifficulty(e.currentTarget.value);
              assistantRef.current.sendData({
                action: { action_id: 'saDifLow' },
              });
            }}
          />
        </div>

        <div className="radio">
          <Radiobox
            name="Difficulty"
            label="Любитель"
            value="amateur"
            disabled={
              status !== 'not_started' && status !== 'new' ? true : false
            }
            checked={difficulty === 'amateur' ? true : false}
            onChange={(e) => {
              changeDifficulty(e.currentTarget.value);
              assistantRef.current.sendData({
                action: { action_id: 'saDifMid' },
              });
            }}
          />
        </div>

        <div className="radio">
          <Radiobox
            name="Difficulty"
            label="Профессионал"
            value="profi"
            disabled={
              status !== 'not_started' && status !== 'new' ? true : false
            }
            checked={difficulty === 'profi' ? true : false}
            onChange={(e) => {
              changeDifficulty(e.currentTarget.value);
              assistantRef.current.sendData({
                action: { action_id: 'saDifHigh' },
              });
            }}
          />
        </div>
      </div>

      <div className="btn-group">
        <Button
          view="primary"
          size="s"
          disabled={
            !(
              status === 'started' ||
              status === 'pause' ||
              status === 'lost' ||
              status === 'won'
            )
              ? true
              : false
          }
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
          disabled={status !== 'started' ? true : false}
          onClick={() => {
            setStatusPauseGame();
            assistantRef.current.sendData({ action: { action_id: 'saPause' } });
          }}
        >
          Пауза
        </Button>

        <Button
          className="btn"
          view="primary"
          size="s"
          disabled={status === 'started' ? true : false}
          onClick={() => {
            setHelpActive('open_app');
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
