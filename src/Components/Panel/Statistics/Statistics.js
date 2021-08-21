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
  onToHHMMSS: toHHMMSS,
}) => {
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
