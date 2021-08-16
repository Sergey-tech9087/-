import React, { useState, useRef, useEffect } from 'react';

import Field from '../Field/Field';
import Controllers from '../Panel/Controllers/Controllers';
import './App.css';

function App() {
  /* State Hooks */
  const [difficulty, setDifficulty] = useState('beginner');
  const [status, setStatus] = useState('not_started');

  //const st = useRef();

  // useEffect(() => {
  //   setStatus("started");
  // }, [status])

  console.log('Статус текущий:', status);

  /* End of State Hooks */

  const changeDifficulty = (new_difficulty) => {
    setStatus('not_started');
    //st.current = "not_started";
    setDifficulty(new_difficulty);
  };

  const startGame = () => {
    setStatus('started');
    //st.current = "started";
  };

  const loseGame = () => {
    setStatus('lost');
    //st.current = "lost";
  };

  const winGame = () => {
    setStatus('won');
    //st.current = "won";
  };

  const restartGame = () => {
    setStatus('not_started');
    //st.current = "not_started";
  };

  return (
    <main className="app">
      <Field
        difficulty={difficulty}
        status={status}
        //status={st.current}
        onStart={startGame}
        onWin={winGame}
        onLose={loseGame}
        onRestart={restartGame}
      />
      <Controllers
        onChangeDifficulty={changeDifficulty}
        onRestart={restartGame}
      />
    </main>
  );
}
export default App;
