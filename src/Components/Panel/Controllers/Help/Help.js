import React from 'react';

import { Button, CardHeadline2, CardParagraph2 } from '@sberdevices/plasma-ui';

import './Help.css';

const Help = ({
  active,
  themeColorsDark,
  assistantCharacter,
  assistantAppealOfficial,
  onSetHelpActive: setHelpActive,
}) => {
  // Словарь формы обращения персонажа
  const helpText = () => {
    let dictAppeal = null;
    if (assistantAppealOfficial) {
      dictAppeal = {
        word01: 'Вы',
        word02: 'Вам',
        word03: 'скажите',
        word04: 'можете',
        word05: 'назовите',
      };
    } else {
      dictAppeal = {
        word01: 'ты',
        word02: 'тебе',
        word03: 'скажи',
        word04: 'можешь',
        word05: 'назови',
      };
    }
    let tempText = '';
    tempText = `Цель игры Профессиональный сапёр – открыть все пустые ячейки, не попадая при этом ни на одну мину. 
    Чтобы открыть ячейку ${dictAppeal.word02} необходимо сказать "открыть" и назвать координаты ячейки, например, А1.
    Для того чтобы отметить клетку с предполагаемой миной ${dictAppeal.word03} "флаг" и ${dictAppeal.word05} координаты ячейки, например, Б2.
    Чтобы приостановить игру ${dictAppeal.word01} ${dictAppeal.word04} сказать "пауза", а для возобновления игры "продолжить". 
    Начать новую игру ${dictAppeal.word04} по команде "снова" или "заново". Уровень игры меняется командой "сложность" с указанием
    одного из вариантов "новичок", "любитель" или "профессионал". 
    Правила игры вызываются командой "помощь", а закрываются словом "закрыть".`;
    return tempText;
  };

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
          onClick={() => setHelpActive(false)}
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
};

export default Help;
