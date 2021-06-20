// import {
//   createSmartappDebugger,
//   createAssistant,
// } from "@sberdevices/assistant-client";

import React, { useState, state, useRef, useEffect } from "react";

import Field from "../field/field";
import Options from "../options/options";

// const initializeAssistant = (getState) => {
//   if (process.env.NODE_ENV === "development") {
//     return createSmartappDebugger({
//       token:
//         "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWJhNjNmNGE2YzNjN2ViZWNjNmVmODE4N2FkZjJhOGVkYjJkMGRmNTVjMDdhYzViYzEwMjg3MGUxY2VmNjVlNjU3MWVmOTczZDVkNGIyMyIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDI1OTUyNywiaWF0IjoxNjI0MTczMTE3LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNzcyNzM4ZTAtZTFiMC00MzkzLWI0NzUtOTA3NGMwZjBmOTU4Iiwic2lkIjoiYmEzZmRhNzktMjc4Mi00NTZmLWJlNjQtZWViNDAyN2Y1N2MzIn0.SeAa7G6WsIjleBh7eEpj0ixqUVDgYdadBrVppQ4yBAH43LPYY5RVC2LtLXBwRk9WASEnWLLE4ms3oQYhTMFEV5KWqEH7ULvChecK5xEUvlrcUY8q9Wjed6g31TAMZCSLXR3yI_JADMWCGZuCfE-AIFbJyteoLM1mYqtBS3S86CSwq0sUIoZsBYiOgR_VOckycGHPk-qlfb9SXmAXeSWAxz2vnv1p20dgJTpyg6WJTPtSarZh28N2C2AHMQ4MGHAyjgcp-6062DRBphY0CdOOjkRSTR36ziVHuNlEIev90WmYkBBS-N2A1gWIBirzWm1xvl67Q6GIgvIRCI6RUQkFAuMCfGGXsFlu9cYQ34Ebwm-9h9ZMNBfVN18YAoo7MfqWpgKj1t_Mn40Y4Sqxj2nownv_7nkuuEZdlfPfPqlaNZ_YOWWVZJFZniKYYDuYW_Hl_CFUDLqqPPC4v8PBlLwBGWpFGb8IgVS5wcD4u_wLjQJI3cCDhjJrKdyq88facw3zmbqFU6CYtmEC_MVyOfjB6NH3Q87NLHgUhOVUWTT76UFXjqjE-Sx11q_Q1w2bXY29zpei41jaUx9TY1HeDaAMr44kGjDBFe87eMPVrnBYsyLCGSY1lr9FfusUTDY-gL_UqU26OOvhduiUGUeYIpv5LcYSiZknvJwBWI05af_BEBE" ??
//         "",
//       initPhrase: `Запусти Сапёр`,
//       getState,
//     });
//   }
//   return createAssistant({ getState });
// }

// const getStateForAssistant = () => {
  
//   console.log("getStateForAssistant: this.state:", state);
//   const state_ = {
//     itemselector: {
//       items: state.notes.map(({ id, title }, index) => ({
//         number: index + 1,
//         id,
//         title,
//       })),
//     },
//   };
//   console.log("getStateForAssistant: state:", state);
//   return state;
// };

const App = () => {
  //var assistant = useRef()

  // useEffect(() => {
  //   assistant.current = initializeAssistant(() => getStateForAssistant());
  //   assistant.current.on("start", (event) => {
  //     console.log(`assistant.on(start)`, event);
  //   });
  
  //   assistant.current.on(
  //     "data",
  //     (event) => {
  //       const { action } = event;
  //       dispatchAssistantAction(action);
  //     },[]);
  // }, []);

  // const dispatchAssistantAction = async (action, coord_str) => {
  //   console.log("dispatchAssistantAction", action);
  //   if (action) {
  //     switch (action.type) {
  //       case 'new_game':
  //         return restartGame();
        
  //       //  case 'open_field':
  //       //   return Field.openCellWithStr(action.note)

  //       // case 'notice_field':
  //       //   //return console.log(action.note)
  //       //   return Field.toggleFlagWithStr(action.note)

  //       //  case 'change_level':
  //       //   //return console.log(action.note)
  //       //   return Field.calculateFieldData(action.note)

  //       default:
  //         throw new Error();
  //     }
  //   }
  // };

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
