import React, { useState, useRef, useEffect } from 'react';

import useStateRef from 'react-usestateref';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

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

// Инициализация Сбер ассистента
const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === 'production') {
    //if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

// Установка параметров игры для уровня сложности
const calculateFieldData = (difficulty) => {
  switch (difficulty) {
    case 'amateur':
      return {
        x: 15,
        y: 15,
        minesCount: 40,
      };
    case 'profi':
      return {
        x: 20,
        y: 20,
        minesCount: 70,
      };
    default:
      return {
        x: 8,
        y: 8,
        minesCount: 10,
      };
  }
};

// Создание матрицы игрового поля с нулевыми значениями
const generateEmptyFieldMatrix = (fieldData) => {
  let tempFieldMatrix = [];
  for (let i = 0; i < fieldData.y; i++) {
    tempFieldMatrix.push([]);
    for (let j = 0; j < fieldData.x; j++) {
      tempFieldMatrix[i].push(0);
    }
  }
  return tempFieldMatrix;
};

// Сброс координат поля
const emptyfirstOpened = () => {
  return {
    x: 'err',
    y: 'err',
  };
};

function App() {
  const LETTERS = 'АБВГДЕЖЗИКЛМНОПРСТУФ'.split('');

  // Список состояний Сбер ассистента
  const state = { notes: [] };

  // Состояние Сбер ассистента
  const assistantRef = useRef();

  // Цветовая палитра ассистента (темная или светлая)
  const [themeColorsDark, setThemeColorsDark] = useState(true);

  // Персонажи Сбер ассистента (sber, eva, joy)
  const [assistantCharacter, setAssistantCharacter] = useState('sber');

  // Форма обращения персонажа
  const [assistantAppealOfficial, setassistantAppealOfficial] = useState(true);

  // Уровни сложности игры
  const [difficulty, setDifficulty, difficultyRef] = useStateRef('beginner');

  // Статусы игры
  const [status, setStatus, statusRef] = useStateRef('not_started');

  // Параметры игры (размер поля и количество мин)
  const [fieldData, setFieldData, fieldDataRef] = useStateRef(
    calculateFieldData(difficultyRef.current)
  );

  // Матрица исходного игрового поля
  const [fieldMatrix, setFieldMatrix, fieldMatrixRef] = useStateRef(
    generateEmptyFieldMatrix(fieldDataRef.current)
  );

  // Матрица игрового поля с открытыми полями и установленными флагами
  const [openedCellsMatrix, setOpenedCellsMatrix, openedCellsMatrixRef] =
    useStateRef(generateEmptyFieldMatrix(fieldDataRef.current));

  // Координаты первого открытого поля (исключается попадание на мину)
  const [firstOpened, setFirstOpened, firstOpenedRef] = useStateRef(
    emptyfirstOpened()
  );

  // Осталось установить флагов
  const [flagsCount, setFlagsCount, flagsCountRef] = useStateRef(
    fieldDataRef.current.minesCount
  );

  // Осталось неоткрытых полей
  const fieldNoOpenRef = useRef(
    fieldDataRef.current.x * fieldDataRef.current.y
  );

  // Состояние вывода правил игры
  const [helpActive, setHelpActive] = useState(false);

  // Таймер отсчета времени (секундомер)
  const [timeGame, setTimeGame] = useState(0);

  // Инициализация Сбер ассистента и обработка событий ассистента
  useEffect(() => {
    assistantRef.current = initializeAssistant(() => getStateForAssistant());
    assistantRef.current.on('start', (event) => {
      console.log(`assistantRef.on(start) - event:`, event);
    });

    assistantRef.current.on(
      'data',
      (event) => {
        console.log('assistantRef.on(data) - event:', event);
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

  // Установка исходных данных для начала новой игры (при смене уровня, новой игре или завершении игры)
  useEffect(() => {
    if (statusRef.current === 'new') {
      const tempFieldData = calculateFieldData(difficultyRef.current);
      setFieldData(tempFieldData);
      setFieldMatrix(generateEmptyFieldMatrix(tempFieldData));
      setOpenedCellsMatrix(generateEmptyFieldMatrix(tempFieldData));
      setFirstOpened(emptyfirstOpened());
      setFlagsCount(tempFieldData.minesCount);
      fieldNoOpenRef.current = tempFieldData.x * tempFieldData.y;
      setTimeGame(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, status]);

  // Обработка при открытии первого поля (не попадаем на мину)
  useEffect(() => {
    if (statusRef.current === 'started') {
      openCellWithObj(firstOpenedRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstOpened]);

  // Обработка таймера отсчета времени игры
  useEffect(() => {
    if (status !== 'started') return;

    const intervalId = setInterval(() => {
      setTimeGame(timeGame + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, timeGame]);

  // Логирование статуса игры
  //useEffect(() => {
  //console.log('status:', statusRef.current);
  //// eslint-disable-next-line react-hooks/exhaustive-deps
  //}, [status]);

  // Логирование матрицы исходного игрового поля
  // useEffect(() => {
  //   if (status === 'started') {
  //     console.log('fieldMatrix:', fieldMatrixRef.current);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [fieldMatrix]);

  // Получение статуса ассистента
  const getStateForAssistant = () => {
    const tempState = {
      itemselector: {
        items: state.notes.map(({ id, title }, index) => ({
          number: index + 1,
          id,
          title,
        })),
      },
    };
    return tempState;
  };

  // Обработка по событиям Сбер ассистента
  const dispatchAssistantAction = async (action) => {
    console.log('dispatchAssistantAction:', action);
    if (action) {
      switch (action.type) {
        // Установка цветовой палитры
        case 'theme_colors':
          // TODO: Учесть е/ё ?,  ...
          if (action.note === 'тёмная') {
            setThemeColorsDark(true);
          } else if (action.note === 'светлая') {
            setThemeColorsDark(false);
          }
          break;

        // Смена уровней сложности
        case 'change_difficulty':
          switch (action.note) {
            case 'новичок':
              changeDifficulty('beginner');
              break;

            case 'любитель':
              changeDifficulty('amateur');
              break;

            case 'профи':
              changeDifficulty('profi');
              break;

            default:
              break;
          }
          break;

        // Новая игра
        case 'new_game':
          setStatusRestartGame();
          break;

        // Открытие поля
        case 'open_field':
          openCellWithStr(action.note);
          break;

        // Установка и снятие флага
        case 'toggle_flag':
          toggleFlag(action.note);
          break;

        // Установка паузы
        case 'set_pause':
          setStatusPauseGame();
          break;

        // Возобновление игры после паузы
        case 'continue_game':
          setStatusStartGame();
          break;

        // Вызов помощи
        case 'call_help':
          setHelpActive(true);
          break;

        // Закрытие помощи
        case 'close_help':
          setHelpActive(false);
          break;

        default:
          throw new Error();
      }
    }
  };

  // Изменение уровня игры
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setStatusRestartGame();
  };

  // Установка статуса при начале игры
  const setStatusStartGame = () => {
    setStatus('started');
  };

  // Установка статуса при запуске новой игры
  const setStatusRestartGame = () => {
    if (statusRef.current !== 'new') {
      setStatus('new');
    }
  };

  // Установка статуса при паузе
  const setStatusPauseGame = () => {
    if (statusRef.current === 'started') {
      setStatus('pause');
    }
  };

  // Вывод информационных сообщений
  const messageNotification = (title, message, type = 'info') => {
    store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });
  };

  // Открыть поле и связанные поля, около которых нет мин
  const openCellWithObj = ({ y, x } = emptyfirstOpened()) => {
    if (y in openedCellsMatrixRef.current) {
      if (x in openedCellsMatrixRef.current[y]) {
        if (openedCellsMatrixRef.current[y][x] === 0) {
          let lostFlag = false;
          const tempOpenedCellsMatrix = openedCellsMatrixRef.current;
          tempOpenedCellsMatrix[y][x] = 1;
          setOpenedCellsMatrix([...tempOpenedCellsMatrix]);
          --fieldNoOpenRef.current;
          if (fieldMatrixRef.current[y][x] === -1) {
            setStatus('lost');
            lostFlag = true;
          } else if (fieldMatrixRef.current[y][x] === 0) {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i !== 0 || j !== 0) {
                  openCellWithObj({ y: y + i, x: x + j });
                }
              }
            }
          }
          if (!lostFlag) {
            let exploredCellsAmount = 0;
            for (let row of openedCellsMatrixRef.current) {
              exploredCellsAmount += row.filter((cell) => cell === 1).length;
            }
            if (
              exploredCellsAmount ===
              fieldDataRef.current.y * fieldDataRef.current.x -
                fieldDataRef.current.minesCount
            ) {
              setStatus('won');
            }
          }
        }
      }
    }
  };

  // Получение координат объекта (идентификаторов поля)
  const strToCoordinateObj = (y, x) => {
    x = LETTERS.indexOf(x.toUpperCase());
    y = Number(y);
    if (x >= 0 && Number.isNaN(y) === false) {
      return {
        y: y - 1,
        x: x,
      };
    } else {
      messageNotification('Игровое поле', 'Ошибка получения координат строки!');
      return emptyfirstOpened();
    }
  };

  // Открыть поле по заданным именованным координатам
  const openCellWithStr = (coordStr) => {
    const xRaw = coordStr.charAt(0).toUpperCase();
    const yRaw = coordStr.substr(1);
    const cellDiv = document.querySelector(
      `.field__cell[data-y="${yRaw}"][data-x="${xRaw}"]`
    );
    let pos = null;
    if (cellDiv != null) {
      pos = strToCoordinateObj(yRaw, xRaw);
    }
    if (cellDiv != null && pos != null && pos.x !== 'err' && pos.y !== 'err') {
      if (statusRef.current === 'started') {
        if (openedCellsMatrixRef.current[pos.y][pos.x] === 0) {
          openCellWithObj(pos);
        } else if (openedCellsMatrixRef.current[pos.y][pos.x] === 1) {
          messageNotification(
            'Открытие клетки поля',
            `Клетка ${coordStr.toUpperCase()} уже открыта!`
          );
        } else if (openedCellsMatrixRef.current[pos.y][pos.x] === -1) {
          messageNotification(
            'Открытие клетки поля',
            `На клетке ${coordStr.toUpperCase()} уже установлен флаг!`
          );
        }
      } else if (
        statusRef.current === 'not_started' ||
        statusRef.current === 'new'
      ) {
        newGame(pos);
      }
    } else {
      messageNotification(
        'Открытие клетки поля',
        'Клетка с введёнными координатами не найдена!'
      );
    }
  };

  // Установить флаг мины
  const toggleFlag = (coordStr) => {
    const xRaw = coordStr.charAt(0).toUpperCase();
    const yRaw = coordStr.substr(1);
    const cellDiv = document.querySelector(
      `.field__cell[data-y="${yRaw}"][data-x="${xRaw}"]`
    );
    let pos = null;
    if (cellDiv != null) {
      pos = strToCoordinateObj(yRaw, xRaw);
    }
    if (cellDiv != null && pos != null && pos.x !== 'err' && pos.y !== 'err') {
      if (pos.y in openedCellsMatrixRef.current) {
        if (pos.x in openedCellsMatrixRef.current[pos.y]) {
          if (statusRef.current === 'started') {
            if (openedCellsMatrixRef.current[pos.y][pos.x] !== 1) {
              const tempOpenedCellsMatrix = openedCellsMatrixRef.current;
              tempOpenedCellsMatrix[pos.y][pos.x] =
                tempOpenedCellsMatrix[pos.y][pos.x] === -1 ? 0 : -1;
              setFlagsCount(
                flagsCountRef.current +
                  (tempOpenedCellsMatrix[pos.y][pos.x] === -1 ? -1 : 1)
              );
              setOpenedCellsMatrix([...tempOpenedCellsMatrix]);
              fieldNoOpenRef.current +=
                tempOpenedCellsMatrix[pos.y][pos.x] === -1 ? -1 : 1;
            } else if (openedCellsMatrixRef.current[pos.y][pos.x] === 1) {
              messageNotification(
                'Установка/снятие флага',
                `Клетка ${coordStr.toUpperCase()} уже открыта!`
              );
            }
          }
        }
      }
    } else {
      messageNotification(
        'Установка/снятие флага',
        'Клетка с введёнными координатами не найдена!'
      );
    }
  };

  // Сгененировать координаты новой мины
  const randomMine = (fieldData, opened) => {
    while (true) {
      let mine = {
        y: Math.floor(Math.random() * fieldData.y),
        x: Math.floor(Math.random() * fieldData.x),
      };
      if (mine.y !== opened.y || mine.x !== opened.x) {
        return mine;
      }
    }
  };

  // Сгененировать список координат мин для игрового поля
  const generateMines = (fieldData, opened) => {
    const minesArray = [];
    for (let i = 0; i < fieldData.minesCount; i++) {
      while (true) {
        const mine = randomMine(fieldData, opened);
        const index = minesArray.findIndex(
          (el) => el.x === mine.x && el.y === mine.y
        );
        if (index === -1) {
          minesArray.push(mine);
          break;
        }
      }
    }
    return minesArray;
  };

  // Установка одной мины на игровое поле и количества рядом расположенных мин
  const placeMine = (tempFieldMatrix, y, x) => {
    tempFieldMatrix[y][x] = -1;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          y + i in tempFieldMatrix &&
          x + j in tempFieldMatrix[y + i] &&
          tempFieldMatrix[y + i][x + j] !== -1
        ) {
          tempFieldMatrix[y + i][x + j] += 1;
        }
      }
    }
    return tempFieldMatrix;
  };

  // Установка всех мин на игровое поле
  const generateFieldMatrix = (field, mines) => {
    //console.log('mines:', mines);
    let tempFieldMatrix = generateEmptyFieldMatrix(field);

    mines.forEach((mine) => {
      tempFieldMatrix = placeMine(tempFieldMatrix, mine.y, mine.x);
    });

    return tempFieldMatrix;
  };

  // Обновление поля и установка начальных статусов
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
    <main className="main-container">
      <DocumentStyle
        themeColorsDark={themeColorsDark}
        assistantCharacter={assistantCharacter}
      />

      <Controllers
        difficulty={difficulty}
        onChangeDifficulty={changeDifficulty}
        onSetStatusRestartGame={setStatusRestartGame}
        onSetStatusPauseGame={setStatusPauseGame}
        onSetHelpActive={setHelpActive}
      />

      <Statistics
        fieldNoOpenRef={fieldNoOpenRef.current}
        fieldCount={fieldData.x * fieldData.y}
        flagsCount={flagsCount}
        minesCount={fieldData.minesCount}
        timeGame={timeGame}
      />

      <Field
        difficulty={difficulty}
        status={status}
        fieldData={fieldData}
        fieldMatrix={fieldMatrix}
        openedCellsMatrix={openedCellsMatrix}
        LETTERS={LETTERS}
        onSetStatusRestartGame={setStatusRestartGame}
        onSetStatusStartGame={setStatusStartGame}
        onOpenCellWithStr={openCellWithStr}
        onToggleFlag={toggleFlag}
        onMessageNotification={messageNotification}
      />

      <Help
        active={helpActive}
        assistantAppealOfficial={assistantAppealOfficial}
        onSetHelpActive={setHelpActive}
      />
    </main>
  );
}
export default App;
