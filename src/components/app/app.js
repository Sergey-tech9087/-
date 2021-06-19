import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import React, { useState, state, useRef, useEffect } from "react";

import Field from "../field/field";
import {
  newGame
} from "../field/field";
import Options from "../options/options";

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWJhNjNmNGE2YzNjN2ViZWNjNmVmODE4N2FkZjJhOGVkYjJkMGRmNTVjMDdhYzViYzEwMjg3MGUxY2VmNjVlNjU3MWVmOTczZDVkNGIyMyIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDE4MDUyOCwiaWF0IjoxNjI0MDk0MTE4LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNzNkZWQwMmItMTE4ZC00MjkyLWJhY2QtMmE3OGI4ZjBlMmFjIiwic2lkIjoiZmI5NDU3NzktYzljNC00MGVlLWFiODQtZDM2MGYyNThjOTdiIn0.KRT2N7fXpJfb3WS2ltQxnZcnp5GVzJzX5sH-hqHn631h4f2PjSuKM_Bn7OkY90ZxoJWv26js1kEhlJ9ML7V8ypeEPdG2idUuuqDYU1rPyb8hzC4ZbMReCyYZqc4wheNs8EI1Da9gp3G2VdVPhwe_4dQ32JnDIrwqJmCZsXT00Kism34u1N_NmtmpPVyJ30_rSmYj_nEhs3h3DTwlZD-AXQ7MOJ0r33r3y0b-UOprdOnx3qPcOWTgtFMFnRXMakQwiZcBYjKZB2LMfthkItVWEXbVxELTrODj_zoLItJ4k2G1PyVtiZ0Oi60X6kj7DcxUDr20YD5P_O39KKzjgp5XVgBIIYTnsxyW44WrLw6KNBwAV10CRZAEARwJZfloa-HA6lzIuHXcQWqOGJFbZJ4mOo8HfQJ89PvMyC21QjKwJLbcS5Mn24Ot2Zea_7LDO72POtEScs_mLgIiFSTO6nZpLcq5QM6yggOjGnk18aJmv1kd5KKNVkf2i2TFpQP1SLZESelqiaf--ze4pPHK9_1c9kFydqwtjBUPWHR0NmDAB3WfeVpnhxFj2xjJ7_6QTxeFXSHkD9OmbUIh2WK_5TCKZX6VFSomGt3bRTfumSNTaA4DASF5RSndkhcfJYchiV6SsY4C7YdW8tDbs8fi0XeCU536Xzs1myWji2oseRx2soo" ??
        "",
      initPhrase: `Запусти Сапёр`,
      getState,
    });
  }
  return createAssistant({ getState });
}

const getStateForAssistant = () => {
  console.log("getStateForAssistant: this.state:", state);
  const state_ = {
    itemselector: {
      items: state.notes.map(({ id, title }, index) => ({
        number: index + 1,
        id,
        title,
      })),
    },
  };
  console.log("getStateForAssistant: state:", state);
  return state;
};

const App = () => {
  var assistant = useRef()

  useEffect(() => {
    assistant.current = initializeAssistant(() => getStateForAssistant());
    assistant.current.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });
  
    assistant.current.on(
      "data",
      (event) => {
        const { action } = event;
        dispatchAssistantAction(action);
      },[]);
  }, []);

  const dispatchAssistantAction = async (action) => {
    console.log("dispatchAssistantAction", action);
    if (action) {
      switch (action.type) {
        case 'openField':
          //return this.add_note(action);

        case 'noticeField':
          //return this.done_note(action);

        case 'new_game':
          return this.newGame();

        case 'changeLevel':
          //return this.delete_note(action);

        default:
          throw new Error();
      }
    }
  };

  /* State Hooks */

  const [difficulty, setDifficulty] = useState("beginner");

  const [status, setStatus] = useState("not_started");

  /* End of State Hooks */

  const changeDifficulty = (new_difficulty) => {
    setStatus("not_started");
    setDifficulty(new_difficulty);
  };

  const startGame = () => {
    setStatus("started");
    // callback();
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
