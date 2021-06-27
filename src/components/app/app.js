import React, { useState } from "react";

import Field from "../field/field";
import Options from "../options/options";

function App () {
  /* State Hooks */
  const [difficulty, setDifficulty] = useState("beginner");
  const [status, setStatus] = useState("not_started");
  console.log("Статус текущий:", status);
  /* End of State Hooks */

  const changeDifficulty = (new_difficulty) => {
    setStatus("not_started");
    setDifficulty(new_difficulty);
  };

  const startGame = () => {
    setStatus("started");
  };

  const loseGame = () => {
    setStatus("lost");
  };

  const winGame = () => {
    setStatus("won");
  };

  const restartGame = () => {
    setStatus("not_started");
  };

  return (
    <main className="app">
      <Field
        difficulty={difficulty}
        status={status}
        onStart={startGame}
        onWin={winGame}
        onLose={loseGame}
        onRestart={restartGame}
      />
      <Options onChangeDifficulty={changeDifficulty} onRestart={restartGame} />
    </main>
  );
};
export default App;