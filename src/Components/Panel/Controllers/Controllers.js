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
          <div className="radio">
            <Radiobox
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
                  action: {
                    action_id: 'saStatusForDiff',
                    parameters: {
                      status: `${status}`,
                      diff: `новичок`,
                    },
                  },
                });
              }}
            />
          </div>

          <div className="radio">
            <Radiobox
              className="radio-margin-left"
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
                  action: {
                    action_id: 'saStatusForDiff',
                    parameters: {
                      status: `${status}`,
                      diff: `любитель`,
                    },
                  },
                });
              }}
            />
          </div>

          <div className="radio">
            <Radiobox
              className="radio-margin-left"
              name="Difficulty"
              label="Мастер"
              value="profi"
              disabled={
                status !== 'not_started' && status !== 'new' ? true : false
              }
              checked={difficulty === 'profi' ? true : false}
              onChange={(e) => {
                changeDifficulty(e.currentTarget.value);
                assistantRef.current.sendData({
                  action: {
                    action_id: 'saStatusForDiff',
                    parameters: {
                      status: `${status}`,
                      diff: `мастер`,
                    },
                  },
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="btn-group">
        <div>
          <Button
            view="primary"
            size="m"
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
            view="warning"
            size="m"
            disabled={status !== 'started' ? true : false}
            onClick={() => {
              setStatusPauseGame();
              assistantRef.current.sendData({
                action: { action_id: 'saPause' },
              });
            }}
          >
            Пауза
          </Button>

          <Button
            className="btn"
            view="primary"
            size="m"
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
    </div>
  );
};

export default Controllers;
