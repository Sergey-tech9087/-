import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import React, { useState, useEffect, useRef } from "react";

import "./field.css";
import flag from "../../assets/flag.svg";

import FieldCell from "../field__cell/field__cell";
import Inputs from "../inputs/inputs";

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === /*"development"*/"production") {
    return createSmartappDebugger({
      token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWJhNjNmNGE2YzNjN2ViZWNjNmVmODE4N2FkZjJhOGVkYjJkMGRmNTVjMDdhYzViYzEwMjg3MGUxY2VmNjVlNjU3MWVmOTczZDVkNGIyMyIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDYxMzQ1NSwiaWF0IjoxNjI0NTI3MDQ1LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiZDcyYWQzMTItYTA5YS00NWI2LTk5MDEtZGViOTRjYjcxODRiIiwic2lkIjoiYTkzYTlkOWUtYWI2YS00YjFiLTliODctOGJhODM1NjYxMGFhIn0.r28WB927JNpiMmI9mHkEKDAGZzziVpvxt7qDM4ICZlbUYwZroXvltyOQgi9GLZLdNotnqMlStgepCBoQKV0GRgUO5-P9ZRHruwVdqanGGl7tpLAkzf503c0140gP1X7myxpw72lFr5hQwNYrtsJVUHjPxjZn6FUJMMhE-TyszgeFFEw5AMWeYFqLJudXICp8Eazx9AxKOaIobq7ZQgET12uG3nckufdVsu1YAWcCP5OfTQ4ExzYenxnEtShfm7X47TOwwWKWlnwntoXfmUIGEA1h34_y3irWEPeTp0w9CBeWpMqapa4R2bR8Y1NJe3QOodRXTQBH6Nkec1_OtKMjP6dz8YNevtjvghrd4G2ecvIfJlkMKXYaKXuISUQLPOTu0urX6kJSmzQqoQgkI5sklsTrmf07UWbn7Vx03V5CEtuShIis_qHbqpwZ_bCK80_me3IMl1Kt9-JNbE13MS135GAXIT86jtHdEigxvYQp19_W9oUihbX9gzlGwlG_6PyJXiHR2HnctAqwsmKXeGq2mHtqGLzm7c9hf2u1soWTeNab-gewcW8L5sCAekH7Sx-3SFlBhS8PwyIOc467BCn1Kq2nuFfyUose49U-kaRcMAEW-_YiDrdpgBFK2ss6E0wy3yaICup8G18jn3AEOnMzopAWzqXG4nGV4Y8pRonM1Ds" ??
        "",
      initPhrase: `Запусти Профессиональный сапёр`,
      getState,
    });
  }
  return createAssistant({ getState });
}

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
          console.log(status)
          restartGame();
          break;

        case 'open_field':
          console.log(action.note)

          // let str = action.note
          // let substr1 = 'один'
          // let substr2 = 'два'
          // let substr3 = 'три'
          // let substr4 = 'четыре'
          // let substr5 = 'пять'
          // let substr6 = 'шесть'
          // let substr7 = 'семь'
          // let substr8 = 'восемь'
          // let substr9 = 'девять'
          // let substr10 = 'десять'
          // let substr11 = 'одиннадцать'
          // let substr12 = 'двенадцать'
          // let substr13 = 'тринадцать'
          // let substr14 = 'четырнадцать'
          // let substr15 = 'пятнадцать'

          // console.log(str.indexOf(substr1))

          // if(status === "not_started"){
          //   console.log("0")
          //   const x_raw = action.note.charAt(0).toUpperCase();
          //   const y_raw = Number(action.note.substr(1));
          //   const pos = strToCoordinateObj(y_raw, x_raw); 
          //   newGame(pos);

          // }else if (status === "started"){
          //   console.log("1")
          //   openCellWithStr(action.note)
          // }
          // console.log(status)


          break;
        case 'set_flag':
          toggleFlagWithStr(action.note)
          break;

        default:
          throw new Error();
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
          x: 20,
          y: 15,
          mines_count: 65,
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

  const toggleFlag = (/*e,*/ y = "Err", x = "Err") => {
    //e.preventDefault();
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

  const toggleFlagWithStr = (/*e,*/ str) => {
    const coord = strToCoordinateObj(str.substr(1), str.charAt(0));
    toggleFlag(/*e,*/ coord.y, coord.x);
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