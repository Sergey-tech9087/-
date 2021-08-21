import React from 'react';

import { Button, CardHeadline2, CardParagraph2 } from '@sberdevices/plasma-ui';

import './Help.css';

const Help = ({
  active,
  themeColorsDark,
  assistantRef,
  assistantCharacter,
  onSetHelpActive: setHelpActive,
  onHelpText: helpText,
}) => {
  const extraClassStyle = themeColorsDark
    ? assistantCharacter === 'sber'
      ? { backgroundColor: 'rgb(33, 160, 56, 0.5)' }
      : assistantCharacter === 'eva'
      ? { backgroundColor: 'rgb(7, 140, 228, 0.5)' }
      : { backgroundColor: 'rgb(181, 89, 243, 0.5)' }
    : assistantCharacter === 'sber'
    ? { backgroundColor: 'rgb(190 239 199)' }
    : assistantCharacter === 'eva'
    ? { backgroundColor: 'rgb(127 195 240)' }
    : { backgroundColor: 'rgb(213 164 246)' };

  return (
    <div
      className={active ? 'modal active' : 'modal'}
      onClick={() => setHelpActive(false)}
    >
      <div
        className={active ? 'modal__content active' : 'modal__content'}
        style={extraClassStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeadline2 className="main-word" style={{ fontSize: '150%' }}>
          Правила
        </CardHeadline2>
        <CardParagraph2
          className="paragraph"
          style={{ fontSize: '100%' }}
          lines={30}
        >
          {helpText()}
        </CardParagraph2>

        <Button
          className="btn-close"
          view="primary"
          onClick={() => {
            setHelpActive(false);
            assistantRef.current.sendData({
              action: { action_id: 'saCloseHelp' },
            });
          }}
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
};

export default Help;
