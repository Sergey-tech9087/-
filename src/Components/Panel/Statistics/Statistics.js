import React from 'react';

import { Badge } from '@sberdevices/plasma-ui';
import { IconApps, IconClock, IconWarning } from '@sberdevices/plasma-icons';

import './Statistics.css';

// TODO: Исключить вывод статуса (status - в параметрах и его вывод)
const Statistics = ({
  fieldNoOpenRef,
  fieldCount,
  flagsCount,
  minesCount,
  timeGame,
}) => {
  // Перевод времени
  const toHHMMSS = (secs) => {
    let secNum = parseInt(secs, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor(secNum / 60) % 60;
    let seconds = secNum % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };

  return (
    <div className="statistics-container">
      <IconApps />
      <Badge text={`${fieldNoOpenRef} / ${fieldCount}`} size="l" />

      <IconWarning className="icon-warning" />
      <Badge text={`${flagsCount} / ${minesCount}`} size="l" />

      <IconClock className="icon-clock" />
      <Badge text={toHHMMSS(timeGame)} size="l" />
    </div>
  );
};

export default Statistics;
