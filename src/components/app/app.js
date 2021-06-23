import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import React, { useState, useRef, useEffect } from "react";

import Field from "../field/field";
import Options from "../options/options";

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWJhNjNmNGE2YzNjN2ViZWNjNmVmODE4N2FkZjJhOGVkYjJkMGRmNTVjMDdhYzViYzEwMjg3MGUxY2VmNjVlNjU3MWVmOTczZDVkNGIyMyIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDUyNzAxOCwiaWF0IjoxNjI0NDQwNjA4LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNTZkMjJhODctYjE5Yy00ZTYzLTgyN2ItMWYxYTg3ZWY0MWI0Iiwic2lkIjoiODlkYTllYzctOWVjNy00N2RjLThiMTYtOTM3ZDY5YTBiNGIyIn0.kStn0jp45KN66ux-k7SKRQz4fj6LQqTUdhFLQnVuW_j-6fU9dQULDK9P1M46teFe14GSLnM8VSenyzPM7shhvhhk73fU9KdVR9LpR1ja4vwSu8yaNTr_Hk0gHWeVvKCJTMonczMtyv8UuRxEzrMRV1KklnaPEAIv-d94IONgb86HhWHoUy0s-k6vbceCaPLmsPotw-m1V7jOt7kNuqOWFkS7sxOLr25nOAJHiQoeoqItVYtE9SyHhVVLXWI-29PAD-APfj41B1Hx8MUH5abNxYAyaUvscuN85nbiHfu4-zSYes0Fo0h0skzgVaEezuLMHErIskjEZVEMf21jmnuBRRqcw1sUS2GQsno96G0HwVGyehLyElkrtxGcK9GBhY05q6vhq2A7-GyRGJazqwLFoR1uPqoy73wcmsz3Wk0GsTIDLrlXouNOv_klmEJ_P93qXGOPJWKXKYmu7_cvccn1Zq4k-CX1oRjuhurCQiWoVKpSVcrBdFmcIbZhDegwlPyEmiRACtPrPhKAY8jDOlV05gVIO30rgc6nsBdDmJMJ8yaJEMdlA0tUF4FOmCLlzCrKqizZuq3QaNOqR3WrrEyvIKP_yOR7JRrd_AYvTFZWvm1yWDyClW3OcEYRna6H_23OehpIpW94edem1AWL1QSfT8t091fe4uyLADyl2eLS15w" ??
        "",
      initPhrase: `Запусти Сапёр`,
      getState,
    });
  }
  return createAssistant({ getState });
}

const App = () => {
  var assistant = useRef()
  var state = {
    notes: [],
  };

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
    return state_;
  };

  useEffect(() => {
    assistant.current = initializeAssistant(() => getStateForAssistant());
    assistant.current.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });
  
    assistant.current.on("data", (event) => {
      const { action } = event;
      dispatchAssistantAction(action);
    },[]);
  }, []);

  const dispatchAssistantAction = async (action) => {
    console.log("dispatchAssistantAction", action);
    if (action) {
      switch (action.type) {
        case 'new_game':
          return restartGame();

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
