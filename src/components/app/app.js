import React, { useRef, useState } from "react";

import Field from "../field/field";
import Options from "../options/options";

const App = () => {
  /* State Hooks */

  const [difficulty, setDifficulty] = useState("beginner");
  //const [status, setStatus] = useState("not_started");

  const status = useRef("not_started")

  /* End of State Hooks */

  const changeDifficulty = (new_difficulty) => {
    //setStatus("not_started");
    status.current = "not_started"
    setDifficulty(new_difficulty);
  };

  const startGame = () => {
    //setStatus("started");
    status.current = "started"
    // callback();
  };

  const loseGame = () => {
    status.current = "lost"
    //setStatus("lost");
  };

  const winGame = () => {
    status.current = "won"
    //setStatus("won");
  };

  const restartGame = () => {
    status.current = "not_started"
    //setStatus("not_started");
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