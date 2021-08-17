import React from 'react';

import { Button, CardHeadline2, CardParagraph2 } from '@sberdevices/plasma-ui';

import './Help.css';

const Help = ({
  active,
  assistantAppealOfficial,
  onSetHelpActive: setHelpActive,
}) => {
  // Словарь формы обращения персонажа
  const helpText = () => {
    let dictAppeal = null;
    if (assistantAppealOfficial) {
      dictAppeal = {
        word01: 'Вы',
        word02: 'Вас',
        word03: 'Вам',
        word04: 'скажите',
        word05: 'выполните',
        word06: 'установите',
      };
    } else {
      dictAppeal = {
        word01: 'ты',
        word02: 'тебя',
        word03: 'тебе',
        word04: 'скажи',
        word05: 'выполни',
        word06: 'установи',
      };
    }
    let tempText = '';
    tempText = `Lorem ${dictAppeal.word01} ipsum ${dictAppeal.word02} dolor ${dictAppeal.word03} 
      sit ${dictAppeal.word04} amet, ${dictAppeal.word05} consectetur ${dictAppeal.word06} 
      adipiscing elit. Sed vehicula ullamcorper ligula, at tincidunt magna euismod in. Integer in
      fringilla nulla. Curabitur in efficitur enim, eu varius erat. Maecenas vel ante nibh. 
      Vivamus nulla lacus, rutrum non interdum quis, imperdiet quis purus. Fusce lobortis commodo 
      felis. Fusce auctor augue non neque luctus, et hendrerit arcu porta.`;
    return tempText;
  };

  return (
    <div
      className={active ? 'modal active' : 'modal'}
      onClick={() => setHelpActive(false)}
    >
      <div
        className={active ? 'modal__content active' : 'modal__content'}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeadline2 className="main-word" style={{ fontSize: '150%' }}>
          Правила
        </CardHeadline2>
        <CardParagraph2
          className="paragraph"
          style={{ fontSize: '90%' }}
          lines={10}
        >
          {helpText()}
        </CardParagraph2>

        <Button
          className="btn-close"
          view="primary"
          onClick={() => setHelpActive(false)}
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
};

export default Help;
