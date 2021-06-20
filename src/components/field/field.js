import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import React, { useState, useEffect, state, useRef } from "react";

import "./field.css";
import flag from "../../assets/flag.svg";

import FieldCell from "../field__cell/field__cell";
import Inputs from "../inputs/inputs";

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWJhNjNmNGE2YzNjN2ViZWNjNmVmODE4N2FkZjJhOGVkYjJkMGRmNTVjMDdhYzViYzEwMjg3MGUxY2VmNjVlNjU3MWVmOTczZDVkNGIyMyIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDI1OTUyNywiaWF0IjoxNjI0MTczMTE3LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNzcyNzM4ZTAtZTFiMC00MzkzLWI0NzUtOTA3NGMwZjBmOTU4Iiwic2lkIjoiYmEzZmRhNzktMjc4Mi00NTZmLWJlNjQtZWViNDAyN2Y1N2MzIn0.SeAa7G6WsIjleBh7eEpj0ixqUVDgYdadBrVppQ4yBAH43LPYY5RVC2LtLXBwRk9WASEnWLLE4ms3oQYhTMFEV5KWqEH7ULvChecK5xEUvlrcUY8q9Wjed6g31TAMZCSLXR3yI_JADMWCGZuCfE-AIFbJyteoLM1mYqtBS3S86CSwq0sUIoZsBYiOgR_VOckycGHPk-qlfb9SXmAXeSWAxz2vnv1p20dgJTpyg6WJTPtSarZh28N2C2AHMQ4MGHAyjgcp-6062DRBphY0CdOOjkRSTR36ziVHuNlEIev90WmYkBBS-N2A1gWIBirzWm1xvl67Q6GIgvIRCI6RUQkFAuMCfGGXsFlu9cYQ34Ebwm-9h9ZMNBfVN18YAoo7MfqWpgKj1t_Mn40Y4Sqxj2nownv_7nkuuEZdlfPfPqlaNZ_YOWWVZJFZniKYYDuYW_Hl_CFUDLqqPPC4v8PBlLwBGWpFGb8IgVS5wcD4u_wLjQJI3cCDhjJrKdyq88facw3zmbqFU6CYtmEC_MVyOfjB6NH3Q87NLHgUhOVUWTT76UFXjqjE-Sx11q_Q1w2bXY29zpei41jaUx9TY1HeDaAMr44kGjDBFe87eMPVrnBYsyLCGSY1lr9FfusUTDY-gL_UqU26OOvhduiUGUeYIpv5LcYSiZknvJwBWI05af_BEBE" ??
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

const Field = ({
  difficulty,
  status,
  onStart: startGame,
  onLose: loseGame,
  onWin: winGame,
  onRestart: restartGame,
}) => {
  const LETTERS = "АБВГДЕЖЗИКЛМНОПРСТУФ".split("");
  useEffect(() => console.log(fieldMatrix));

  // independent functions

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

  const dispatchAssistantAction = async (action, coord_str) => {
    console.log("dispatchAssistantAction", action);
    if (action) { 
      while(action.type){
        if(action.type === "open_field"){        
          if(status === "not_started"){
            console.log("0")
            const x_raw = action.note.charAt(0).toUpperCase();
            const y_raw = Number(action.note.substr(1));
            const pos = strToCoordinateObj(y_raw, x_raw); 
            newGame(pos);
            break; 
            }else if (status === "started"){
              console.log("1")
              return openCellWithStr(action.note)
            }
        }else if(action.type === "new_game"){
          return restartGame();
        }else if(action.type === "notice_field"){
          //return toggleFlagWithStr(action.note);
          //return toggleFlag(8, 8);
        }
      }
    }
  };

  const calculateFieldData = (difficulty) => {
    switch (difficulty) { 
      case "amateur":
        return {
          x: 15,
          y: 15,
          mines_count: 40,
        };
      case "profi":
        return {
          x: 20,
          y: 15,
          mines_count: 65,
        };
      default:
        return {
          x: 8,
          y: 8,
          mines_count: 10,
        };
    }
  };

  const generateEmptyFieldMatrix = (field_data) => {
    let temp_field_matrix = [];
    for (let i = 0; i < field_data.y; i++) {
      temp_field_matrix.push([]);
      for (let j = 0; j < field_data.x; j++) {
        temp_field_matrix[i].push(0);
      }
    }
    return temp_field_matrix;
  };

  // indepndent finctions

  const [fieldData, setFieldData] = useState(calculateFieldData(difficulty));

  useEffect(() => {
    if (status === "not_started") {
      const temp_field_data = calculateFieldData(difficulty);
      setFieldData(temp_field_data);
      setFieldMatrix(generateEmptyFieldMatrix(temp_field_data));
      setOpenedCellsMatrix(generateEmptyFieldMatrix(temp_field_data));
    }
  }, [difficulty, status]);

  const [flagsCount, setFlagsCount] = useState(fieldData.mines_count);

  useEffect(() => {
    setFlagsCount(fieldData.mines_count);
  }, [fieldData]);

  //calculate field data dependent

  const [fieldMatrix, setFieldMatrix] = useState(
    generateEmptyFieldMatrix(fieldData)
  );

  const [openedCellsMatrix, setOpenedCellsMatrix] = useState(
    generateEmptyFieldMatrix(fieldData)
  );

  useEffect(() => {}, [fieldData]);

  //field data dependent

  const openCellWithObj = ({ y, x } = { y: "err", x: "err" }) => {
    if (y in openedCellsMatrix) {
      if (x in openedCellsMatrix[y]) {
        if (openedCellsMatrix[y][x] === 0) {
          let lost_flag = false;
          const temp_opened_cells_matrix = openedCellsMatrix;
          temp_opened_cells_matrix[y][x] = 1;
          setOpenedCellsMatrix([...temp_opened_cells_matrix]);
          if (fieldMatrix[y][x] === -1) {
            loseGame();
            lost_flag = true;
          } else if (fieldMatrix[y][x] === 0) {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i !== 0 || j !== 0) {
                  openCellWithObj({ y: y + i, x: x + j });
                }
              }
            }
          }
          if (!lost_flag) {
            let explored_cells_amount = 0;
            for (let row of openedCellsMatrix) {
              explored_cells_amount += row.filter((cell) => cell === 1).length;
            }
            if (
              explored_cells_amount ===
              fieldData.y * fieldData.x - fieldData.mines_count
            ) {
              winGame();
            }
          }
        }
      }
    }
  };

  const strToCoordinateObj = (y, x) => {
    x = LETTERS.indexOf(x.toUpperCase());
    y = Number(y);
    if (x >= 0 && Number.isNaN(y) === false) {
      return {
        y: y - 1,
        x: x,
      };
    } else {
      alert("Ошибка парсинга координатной строки");
    }
  };

  const openCellWithStr = (coord_str) => {
    if (status === "started") {
      const x_raw = coord_str.charAt(0).toUpperCase();
      const y_raw = coord_str.substr(1);
      const cell_div = document.querySelector(
        `.field__cell[data-y="${y_raw}"][data-x="${x_raw}"]`
      );
      const pos = strToCoordinateObj(y_raw, x_raw);
      if (cell_div != null && pos != null) {
        openCellWithObj(pos);
      } else alert("Клетка с введёнными координатами не найдена");
    } else if (status === "not_started") {
      const x_raw = coord_str.charAt(0).toUpperCase();
      const y_raw = coord_str.substr(1);
      const pos = strToCoordinateObj(y_raw, x_raw);
      newGame(pos);
    }
  };

  const toggleFlag = (e, y = "Err", x = "Err") => {
    e.preventDefault();
    if (y in openedCellsMatrix) {
      if (x in openedCellsMatrix[y]) {
        if (openedCellsMatrix[y][x] !== 1 && status === "started") {
          const temp_opened_cells_matrix = openedCellsMatrix;
          temp_opened_cells_matrix[y][x] =
            temp_opened_cells_matrix[y][x] === -1 ? 0 : -1;
          setFlagsCount(
            flagsCount + (temp_opened_cells_matrix[y][x] === -1 ? -1 : 1)
          );
          setOpenedCellsMatrix([...temp_opened_cells_matrix]);
        }
      }
    }
  };

  const toggleFlagWithStr = (e, str) => {
    const coord = strToCoordinateObj(str.substr(1), str.charAt(0));
    toggleFlag(e, coord.y, coord.x);
  };

  // field matrixes dependent;

  const randomMine = (field_data, opened) => {
    while (true) {
      let mine = {
        y: Math.floor(Math.random() * field_data.y),
        x: Math.floor(Math.random() * field_data.x),
      };
      if (mine.y !== opened.y || mine.x !== opened.x) {
        return mine;
      }
    }
  };

  const generateMines = (field_data, opened) => {
    const mines_array = [];
    for (let i = 0; i < field_data.mines_count; i++) {
      while (true) {
        const mine = randomMine(field_data, opened);
        const index = mines_array.findIndex(
          (el) => el.x === mine.x && el.y === mine.y
        );
        if (index === -1 && (mine.y !== opened.y || mine.x !== opened.x)) {
          mines_array.push(mine);
          break;
        }
      }
    }
    return mines_array;
  };

  const placeMine = (t_field_matrix, y, x) => {
    t_field_matrix[y][x] = -1;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          y + i in t_field_matrix &&
          x + j in t_field_matrix[y + i] &&
          t_field_matrix[y + i][x + j] !== -1
        ) {
          t_field_matrix[y + i][x + j] += 1;
        }
      }
    }
    return t_field_matrix;
  };

  const generateFieldMatrix = (field, mines) => {
    let temp_field_matrix = [];
    for (let i = 0; i < field.y; i++) {
      temp_field_matrix.push([]);
      for (let j = 0; j < field.x; j++) {
        temp_field_matrix[i].push(0);
      }
    }

    mines.forEach((mine) => {
      temp_field_matrix = placeMine(temp_field_matrix, mine.y, mine.x);
    });

    return temp_field_matrix;
  };

  const newGame = (opened) => {
    setTimeout(() => {
      console.log(status)
    }, 500)
    if (status === "not_started") {
      setFieldMatrix(
        generateFieldMatrix(fieldData, generateMines(fieldData, opened))
      );
      startGame();
      setFirstOpened(opened);
    }
  };

  // generators of mines and fields to put their data in the components

  const generateFieldDivs = (field_size) => {
    const field_divs = [];
    field_divs.push(<div key="-А0"></div>);
    for (let i = 0; i < field_size.x; i++) {
      field_divs.push(<div key={LETTERS[i]}>{LETTERS[i]}</div>);
    }
    for (let i = 1; i <= field_size.y; i++) {
      field_divs.push(<div key={i}>{i}</div>);
      for (let j = 0; j < field_size.x; j++) {
        field_divs.push(
          <FieldCell
            key={LETTERS[j] + i}
            key_str={LETTERS[j] + i}
            is_pressed={openedCellsMatrix[i - 1][j] === 1}
            is_flagged={openedCellsMatrix[i - 1][j] === -1}
            onPress={openCellWithStr}
            onRightClick={toggleFlag}
            onNewGame={newGame}
            value={fieldMatrix[i - 1][j]}
            y={i - 1}
            x={j}
          />
        );
      }
    }
    return field_divs;
  };

  //functions to generate cell divs

  //finally generate them

  //Main generation

  //new game and open cell

  /* Initial State and State Setters */

  const [firstOpened, setFirstOpened] = useState({ x: "err", y: "err" });

  useEffect(() => {
    openCellWithObj(firstOpened);
  }, [firstOpened]);

  /* End of Initial State and State Setters */

  /* Functions with Setters */

  /* End of Functions with Setters */

  /* Generation Functions */

  /* End of Generation Functions */

  /* Gameplay */
  /* End of Gameplay */

  return (
    <main className="main">
      <div className="field__flags-count">
        <img src={flag} alt="Иконка флажка" />
        {flagsCount}
      </div>
      <div className={"field field_" + difficulty}>
        {status === "won" || status === "lost" ? (
          <div
            className={
              "field__poster" +
              (status === "won" ? " field__poster_win" : " field__poster_lose")
            }
            onClick={restartGame}
          >
            <span className="field__poster-text">
              {status === "won" ? "Победа!" : "Попробуйте ещё раз!"}
            </span>
          </div>
        ) : null}
        {generateFieldDivs(fieldData)}
      </div>
      <Inputs toggleFlag={toggleFlagWithStr} openCell={openCellWithStr} />
    </main>
  );
};

export default Field;