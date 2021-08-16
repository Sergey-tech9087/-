import React, { useState, useRef, useEffect } from 'react';

import useStateRef from 'react-usestateref';

import {
  createSmartappDebugger,
  createAssistant,
} from '@sberdevices/assistant-client';

import DocumentStyle from '../../GlobalStyle';
import Controllers from '../Panel/Controllers/Controllers';
import Statistics from '../Panel/Statistics/Statistics';
import Field from '../Field/Field';
import Help from '../Panel/Controllers/Help/Help';

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

const emptyfirstOpened = () => {
  return {
    x: 'err',
    y: 'err',
  };
};

function App() {
  const LETTERS = 'АБВГДЕЖЗИКЛМНОПРСТУФ'.split('');
  const state = { notes: [] };

  const assistant = useRef();
  const [themeColorsDark, setThemeColorsDark] = useState(true);
  const [assistantCharacter, setAssistantCharacter] = useState('sber');
  const [assistantAppealOfficial, setassistantAppealOfficial] = useState(true);

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
  const [firstOpened, setFirstOpened, firstOpenedRef] = useStateRef(
    emptyfirstOpened()
  );

  const [timeGame, setTimeGame] = useState(0);

  const [helpActive, setHelpActive] = useState(false);

  const fieldNoOpenRef = useRef(
    fieldDataRef.current.x * fieldDataRef.current.y
  );

  useEffect(() => {
    assistant.current = initializeAssistant(() => getStateForAssistant());
    assistant.current.on('start', (event) => {
      console.log(`assistant.on(start)`, event);
    });

    assistant.current.on(
      'data',
      (event) => {
        console.log('event.type', event.type);
        switch (event.type) {
          case 'character':
            setAssistantCharacter(event.character.id);
            if (event.character.id === 'sber' || event.character.id === 'eva') {
              setassistantAppealOfficial(true);
            } else if (event.character.id === 'joy') {
              setassistantAppealOfficial(false);
            }
            break;
          // TODO: Сделать закрытие приложения или не надо ???
          // case 'close_app':
          // break;
          // TODO: Убрать если не понадобиться ???
          default:
            break;
        }
        const { action } = event;
        dispatchAssistantAction(action);
      },
      []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (statusRef.current === 'new') {
      const temp_field_data = calculateFieldData(difficultyRef.current);
      setFieldData(temp_field_data);
      setFieldMatrix(generateEmptyFieldMatrix(temp_field_data));
      setOpenedCellsMatrix(generateEmptyFieldMatrix(temp_field_data));
      setFirstOpened(emptyfirstOpened());
      setFlagsCount(temp_field_data.mines_count);
      fieldNoOpenRef.current = temp_field_data.x * temp_field_data.y;
      setTimeGame(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, status]);

  useEffect(() => {
    if (statusRef.current === 'started') {
      openCellWithObj(firstOpenedRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstOpened]);

  useEffect(() => {
    if (status !== 'started') return;

    const intervalId = setInterval(() => {
      setTimeGame(timeGame + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, timeGame]);

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
      switch (action.type) {
        case 'theme_colors':
          if (action.note === 'тёмная') {
            setThemeColorsDark(true);
          } else if (action.note === 'светлая') {
            setThemeColorsDark(false);
          }
          break;

        case 'change_difficulty':
          let temp_difficulty = '';
          switch (action.note) {
            case 'новичок':
              temp_difficulty = 'beginner';
              break;
            case 'любитель':
              temp_difficulty = 'amateur';
              break;
            case 'профи':
              temp_difficulty = 'profi';
              break;
            default:
              break;
          }

          if (temp_difficulty !== '') {
            changeDifficulty(temp_difficulty);
          }
          break;

        case 'new_game':
          setStatusRestartGame();
          break;

        case 'open_field':
          openCellWithStr(action.note);
          break;

        case 'toggle_flag':
          toggleFlag(action.note);
          break;

        case 'set_pause':
          setStatusPauseGame();
          break;

        case 'continue_game':
          setStatusStartGame();
          break;

        case 'call_help':
          setHelpActive(true);
          break;

        case 'close_help':
          setHelpActive(false);
          break;

        default:
          throw new Error();
      }
    }
  };

  const changeDifficulty = (new_difficulty) => {
    setDifficulty(new_difficulty);
    setStatusRestartGame();
  };

  const setStatusStartGame = () => {
    setStatus('started');
  };

  const setStatusRestartGame = () => {
    if (statusRef.current !== 'new') {
      setStatus('new');
    }
  };

  const setStatusPauseGame = () => {
    if (statusRef.current === 'started') {
      setStatus('pause');
    }
  };

  const openCellWithObj = ({ y, x } = emptyfirstOpened()) => {
    if (y in openedCellsMatrixRef.current) {
      if (x in openedCellsMatrixRef.current[y]) {
        if (openedCellsMatrixRef.current[y][x] === 0) {
          let lost_flag = false;
          const temp_opened_cells_matrix = openedCellsMatrixRef.current;
          temp_opened_cells_matrix[y][x] = 1;
          setOpenedCellsMatrix([...temp_opened_cells_matrix]);
          --fieldNoOpenRef.current;
          if (fieldMatrixRef.current[y][x] === -1) {
            setStatus('lost');
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
              setStatus('won');
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
      return emptyfirstOpened();
    }
  };

  const openCellWithStr = (coord_str) => {
    const x_raw = coord_str.charAt(0).toUpperCase();
    const y_raw = coord_str.substr(1);
    const cell_div = document.querySelector(
      `.field__cell[data-y="${y_raw}"][data-x="${x_raw}"]`
    );
    let pos = null;
    if (cell_div != null) {
      pos = strToCoordinateObj(y_raw, x_raw);
    }
    if (cell_div != null && pos != null && pos.x !== 'err' && pos.y !== 'err') {
      if (statusRef.current === 'started') {
        openCellWithObj(pos);
      } else if (
        statusRef.current === 'not_started' ||
        statusRef.current === 'new'
      ) {
        newGame(pos);
      }
    } else alert('Клетка с введёнными координатами не найдена!');
  };

  const toggleFlag = (coord_str) => {
    const x_raw = coord_str.charAt(0).toUpperCase();
    const y_raw = coord_str.substr(1);
    const cell_div = document.querySelector(
      `.field__cell[data-y="${y_raw}"][data-x="${x_raw}"]`
    );
    let pos = null;
    if (cell_div != null) {
      pos = strToCoordinateObj(y_raw, x_raw);
    }
    if (cell_div != null && pos != null && pos.x !== 'err' && pos.y !== 'err') {
      if (pos.y in openedCellsMatrixRef.current) {
        if (pos.x in openedCellsMatrixRef.current[pos.y]) {
          if (
            openedCellsMatrixRef.current[pos.y][pos.x] !== 1 &&
            statusRef.current === 'started'
          ) {
            const temp_opened_cells_matrix = openedCellsMatrixRef.current;
            temp_opened_cells_matrix[pos.y][pos.x] =
              temp_opened_cells_matrix[pos.y][pos.x] === -1 ? 0 : -1;
            setFlagsCount(
              flagsCountRef.current +
                (temp_opened_cells_matrix[pos.y][pos.x] === -1 ? -1 : 1)
            );
            setOpenedCellsMatrix([...temp_opened_cells_matrix]);
            fieldNoOpenRef.current +=
              temp_opened_cells_matrix[pos.y][pos.x] === -1 ? -1 : 1;
          }
        }
      }
    } else alert('Клетка с введёнными координатами не найдена!');
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
    if (statusRef.current === 'not_started' || statusRef.current === 'new') {
      setStatusStartGame();
      setFirstOpened(opened);
      setFieldMatrix(
        generateFieldMatrix(
          fieldDataRef.current,
          generateMines(fieldDataRef.current, opened)
        )
      );
    }
  };

  return (
    <main className="app">
      <DocumentStyle
        themeColorsDark={themeColorsDark}
        assistantCharacter={assistantCharacter}
      />

      <Controllers
        difficulty={difficulty}
        onChangeDifficulty={changeDifficulty}
        onRestart={setStatusRestartGame}
        onPauseGame={setStatusPauseGame}
        onHelpActive={setHelpActive}
      />

      <Statistics
        status={status}
        fieldNoOpen={fieldNoOpenRef.current}
        fieldCount={fieldData.x * fieldData.y}
        flagsCount={flagsCount}
        minesCount={fieldData.mines_count}
        timeGame={timeGame}
      />

      <Field
        difficulty={difficulty}
        status={status}
        fieldData={fieldData}
        fieldMatrix={fieldMatrix}
        openedCellsMatrix={openedCellsMatrix}
        LETTERS={LETTERS}
        onRestartGame={setStatusRestartGame}
        onStartGame={setStatusStartGame}
        onOpenCellWithStr={openCellWithStr}
        onToggleFlag={toggleFlag}
      />

      <Help
        active={helpActive}
        setActive={setHelpActive}
        assistantAppealOfficial={assistantAppealOfficial}
      />
    </main>
  );
}
export default App;
