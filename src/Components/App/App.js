import React, { useState, useRef, useEffect } from 'react';

import useStateRef from 'react-usestateref';

import {
  createSmartappDebugger,
  createAssistant,
} from '@sberdevices/assistant-client';

import Field from '../Field/Field';
import Controllers from '../Panel/Controllers/Controllers';
import './App.css';

const initializeAssistant = (getState) => {
  //if (process.env.NODE_ENV === 'production') {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

const calculateFieldData = (difficulty) => {
  switch (difficulty) {
    case 'amateur':
      return {
        x: 15,
        y: 15,
        mines_count: 40,
      };
    case 'profi':
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

function App() {
  const LETTERS = 'АБВГДЕЖЗИКЛМНОПРСТУФ'.split('');
  const state = { notes: [] };

  const [difficulty, setDifficulty, difficultyRef] = useStateRef('beginner');
  const [status, setStatus, statusRef] = useStateRef('not_started');

  const [fieldData, setFieldData, fieldDataRef] = useStateRef(
    calculateFieldData(difficultyRef.current)
  );
  const [fieldMatrix, setFieldMatrix, fieldMatrixRef] = useStateRef(
    generateEmptyFieldMatrix(fieldDataRef.current)
  );
  const [openedCellsMatrix, setOpenedCellsMatrix, openedCellsMatrixRef] =
    useStateRef(generateEmptyFieldMatrix(fieldDataRef.current));
  const [flagsCount, setFlagsCount, flagsCountRef] = useStateRef(
    fieldDataRef.current.mines_count
  );
  const [firstOpened, setFirstOpened, firstOpenedRef] = useStateRef({
    x: 'err',
    y: 'err',
  });

  const assistant = useRef();

  useEffect(() => {
    assistant.current = initializeAssistant(() => getStateForAssistant());
    assistant.current.on('start', (event) => {
      console.log(`assistant.on(start)`, event);
    });

    assistant.current.on(
      'data',
      (event) => {
        const { action } = event;
        dispatchAssistantAction(action);
      },
      []
    );
  }, []);

  useEffect(() => {
    if (statusRef.current === 'not_started') {
      const temp_field_data = calculateFieldData(difficultyRef.current);
      setFieldData(temp_field_data);
      setFieldMatrix(generateEmptyFieldMatrix(temp_field_data));
      setOpenedCellsMatrix(generateEmptyFieldMatrix(temp_field_data));
    }
  }, [difficulty, status]);

  useEffect(() => {
    openCellWithObj(firstOpenedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstOpened]);

  useEffect(() => {
    setFlagsCount(fieldDataRef.current.mines_count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldData]);

  const getStateForAssistant = () => {
    //console.log("getStateForAssistant: this.state:", state);
    const state_ = {
      itemselector: {
        items: state.notes.map(({ id, title }, index) => ({
          number: index + 1,
          id,
          title,
        })),
      },
    };
    //console.log("getStateForAssistant: state:", state);
    return state_;
  };

  const dispatchAssistantAction = async (action) => {
    console.log('dispatchAssistantAction', action);
    if (action) {
      console.log('Статус сбер', status);
      switch (action.type) {
        case 'new_game':
          restartGame();
          break;

        case 'open_field':
          openCellWithStr(action.note);
          break;

        case 'set_flag':
          toggleFlagWithStr(action.note);
          break;

        default:
          throw new Error();
      }
    }
  };

  const changeDifficulty = (new_difficulty) => {
    setStatus('not_started');
    setDifficulty(new_difficulty);
  };

  // TODO: Убрать лишний вызов ???
  const startGame = () => {
    setStatus('started');
  };

  const loseGame = () => {
    setStatus('lost');
  };

  const winGame = () => {
    setStatus('won');
  };

  const restartGame = () => {
    setStatus('not_started');
  };

  const openCellWithObj = ({ y, x } = { y: 'err', x: 'err' }) => {
    if (y in openedCellsMatrixRef.current) {
      if (x in openedCellsMatrixRef.current[y]) {
        if (openedCellsMatrixRef.current[y][x] === 0) {
          let lost_flag = false;
          const temp_opened_cells_matrix = openedCellsMatrixRef.current;
          temp_opened_cells_matrix[y][x] = 1;
          setOpenedCellsMatrix([...temp_opened_cells_matrix]);
          if (fieldMatrixRef.current[y][x] === -1) {
            loseGame();
            lost_flag = true;
          } else if (fieldMatrixRef.current[y][x] === 0) {
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
            for (let row of openedCellsMatrixRef.current) {
              explored_cells_amount += row.filter((cell) => cell === 1).length;
            }
            if (
              explored_cells_amount ===
              fieldDataRef.current.y * fieldDataRef.current.x -
                fieldDataRef.current.mines_count
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
      alert('Ошибка парсинга координатной строки');
      return {
        y: 'err',
        x: 'err',
      };
    }
  };

  const openCellWithStr = (coord_str) => {
    const x_raw = coord_str.charAt(0).toUpperCase();
    const y_raw = coord_str.substr(1);
    const cell_div = document.querySelector(
      `.field__cell[data-y="${y_raw}"][data-x="${x_raw}"]`
    );
    const pos = strToCoordinateObj(y_raw, x_raw);
    if (cell_div != null && pos != null) {
      if (statusRef.current === 'started') {
        openCellWithObj(pos);
      } else if (statusRef.current === 'not_started') {
        newGame(pos);
      }
    } else alert('Клетка с введёнными координатами не найдена');
  };

  const toggleFlag = (e, y = 'Err', x = 'Err') => {
    e.preventDefault();
    if (y in openedCellsMatrixRef.current) {
      if (x in openedCellsMatrixRef.current[y]) {
        if (
          openedCellsMatrixRef.current[y][x] !== 1 &&
          statusRef.current === 'started'
        ) {
          const temp_opened_cells_matrix = openedCellsMatrixRef.current;
          temp_opened_cells_matrix[y][x] =
            temp_opened_cells_matrix[y][x] === -1 ? 0 : -1;
          setFlagsCount(
            flagsCountRef.current +
              (temp_opened_cells_matrix[y][x] === -1 ? -1 : 1)
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
    if (statusRef.current === 'not_started') {
      setFieldMatrix(
        generateFieldMatrix(
          fieldDataRef.current,
          generateMines(fieldDataRef.current, opened)
        )
      );
      startGame();
      setFirstOpened(opened);
    }
  };

  return (
    <main className="app">
      <Field
        LETTERS={LETTERS}
        difficulty={difficulty}
        status={status}
        fieldData={fieldData}
        fieldMatrix={fieldMatrix}
        flagsCount={flagsCount}
        openedCellsMatrix={openedCellsMatrix}
        onRestart={restartGame}
        onOpenCellWithStr={openCellWithStr}
        onToggleFlag={toggleFlag}
        onNewGame={newGame}
      />
      <Controllers
        onChangeDifficulty={changeDifficulty}
        onRestart={restartGame}
      />
    </main>
  );
}
export default App;
