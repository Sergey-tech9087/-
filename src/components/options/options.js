import React from "react";

import "./options.css";

const Options = ({
  onChangeDifficulty: changeDifficulty,
  onRestart: restartGame,
}) => {
  return (
    <div className="options">
      {/* <select
        className="options__difficulty"
        defaultValue="beginner"
        onChange={(e) => changeDifficulty(e.currentTarget.value)}
      >
        <option value="beginner">Простой</option>
        <option value="amateur">Средний</option>
        <option
          value="profi"
          className="options__difficulty-option options__difficulty-option_profi"
        >
          Сложный
        </option>
      </select> */}
    </div>
  );
};

export default Options;