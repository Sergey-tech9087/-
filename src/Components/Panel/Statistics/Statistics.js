import React from 'react';

import { Badge } from '@sberdevices/plasma-ui';
import { IconApps, IconClock, IconWarning } from '@sberdevices/plasma-icons';

import './Statistics.css';

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
      <div>
        <div className="icon">
          <IconApps />
        </div>
        <Badge text={`${fieldNoOpenRef} / ${fieldCount}`} size="l" />
      </div>

      <div>
        <div className="icon">
          <IconWarning className="icon-margin" />
        </div>
        <Badge text={`${flagsCount} / ${minesCount}`} size="l" />
      </div>

      <div>
        <div className="icon">
          <IconClock className="icon-margin" />
        </div>
        <Badge text={toHHMMSS(timeGame)} size="l" />
      </div>
    </div>
  );
};

export default Statistics;
