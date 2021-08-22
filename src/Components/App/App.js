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
  const [
    assistantAppealOfficial,
    setAssistantAppealOfficial,
    assistantAppealOfficialRef,
  ] = useStateRef(true);

  // Пол персонажа
  const [assistantGender, setAssistantGender, assistantGenderRef] =
    useStateRef('male');

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
  const [helpActive, setHelpActive, helpActiveRef] = useStateRef('close');

  // Таймер отсчета времени (секундомер)
  const [timeGame, setTimeGame] = useState(0);

  // Инициализация Сбер ассистента и обработка событий ассистента
  useEffect(() => {
    assistantRef.current = initializeAssistant(() => getStateForAssistant());
    assistantRef.current.on('start', (event) => {
      console.log(`assistantRef.on(start) - event:`, event);
      assistantRef.current.sendData({
        action: {
          action_id: 'saStartGame',
          parameters: {
            message: `${startMessage()}`,
          },
        },
      });
    });

    assistantRef.current.on(
      'data',
      (event) => {
        console.log('assistantRef.on(data) - event:', event);
        switch (event.type) {
          case 'character':
            setAssistantCharacter(event.character.id);
            if (event.character.id === 'sber') {
              setAssistantAppealOfficial(true);
              setAssistantGender('male');
            } else if (event.character.id === 'eva') {
              setAssistantAppealOfficial(true);
              setAssistantGender('female');
            } else if (event.character.id === 'joy') {
              setAssistantAppealOfficial(false);
              setAssistantGender('female');
            }
            break;

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
  useEffect(() => {
    console.log('status:', statusRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Логирование матрицы исходного игрового поля
  // ! Отключить перед модерацией
  useEffect(() => {
    if (status === 'started') {
      console.log('fieldMatrix:', fieldMatrixRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldMatrix]);

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

            case 'профессионал':
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
          openCellWithStr(action.note1 + action.note2);
          break;

        // Установка и снятие флага
        case 'toggle_flag':
          toggleFlag(action.note1 + action.note2);
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
          setHelpActive('open_sa');
          assistantRef.current.sendData({
            action: {
              action_id: 'saHelp',
              parameters: {
                text: `${helpText()}`,
              },
            },
          });
          break;

        // Закрытие помощи
        case 'close_help':
          if (helpActiveRef.current) {
            setHelpActive('close');
          }
          break;

        // Отправка статуса для помощи в ассистента
        case 'load_status_for_help':
          assistantRef.current.sendData({
            action: {
              action_id: 'saStatusForHelp',
              parameters: {
                status: `${statusRef.current}`,
                helpActive: `${helpActiveRef.current}`,
              },
            },
          });
          break;

        // Отправка статуса для паузы в ассистента
        case 'load_status_for_pause':
          assistantRef.current.sendData({
            action: {
              action_id: 'saStatusForPause',
              parameters: {
                status: `${statusRef.current}`,
              },
            },
          });
          break;

        // Отправка активности помощи в ассистента
        case 'load_active_help':
          assistantRef.current.sendData({
            action: {
              action_id: 'saActiveHelp',
              parameters: {
                helpActive: `${helpActiveRef.current}`,
              },
            },
          });
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
    assistantRef.current.sendData({ action: { action_id: 'saStarted' } });
  };

  // Установка статуса при запуске новой игры
  const setStatusRestartGame = () => {
    if (statusRef.current !== 'new') {
      setStatus('new');
      assistantRef.current.sendData({ action: { action_id: 'saNew' } });
    }
  };

  // Установка статуса при паузе
  const setStatusPauseGame = () => {
    if (statusRef.current === 'started') {
      setStatus('pause');
    }
  };

  // Установка статуса проигрыша
  const setStatusLoseGame = () => {
    setStatus('lost');
    assistantRef.current.sendData({
      action: {
        action_id: 'saLost',
        parameters: {
          text: `${fieldNoOpenRef.current}`,
        },
      },
    });
  };

  // Установка статуса выигрыша
  const setStatusWinGame = () => {
    setStatus('won');
    assistantRef.current.sendData({
      action: {
        action_id: 'saWon',
        parameters: {
          text: `${toHHMMSS(timeGame, true)}`,
        },
      },
    });
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
  const openCellWithObj = ({ y, x, autoOpen = false } = emptyfirstOpened()) => {
    if (y in openedCellsMatrixRef.current) {
      if (x in openedCellsMatrixRef.current[y]) {
        if (
          openedCellsMatrixRef.current[y][x] === 0 ||
          (autoOpen && openedCellsMatrixRef.current[y][x] === -1)
        ) {
          let lostFlag = false;
          const tempOpenedCellsMatrix = openedCellsMatrixRef.current;
          tempOpenedCellsMatrix[y][x] = 1;
          setOpenedCellsMatrix([...tempOpenedCellsMatrix]);
          --fieldNoOpenRef.current;
          if (fieldMatrixRef.current[y][x] === -1) {
            setStatusLoseGame();
            lostFlag = true;
          } else if (fieldMatrixRef.current[y][x] === 0) {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i !== 0 || j !== 0) {
                  openCellWithObj({ y: y + i, x: x + j, autoOpen: true });
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
              setStatusWinGame();
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
      // messageNotification(
      //   'Игровое поле',
      //   'Ошибка получения координат строки!',
      //   'warning'
      // );
      assistantRef.current.sendData({
        action: {
          action_id: 'saFieldMessage',
          parameters: {
            text: `Ошибка получения координат строки!`,
          },
        },
      });

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
          // messageNotification(
          //   'Открытие клетки поля',
          //   `Клетка ${coordStr.toUpperCase()} уже открыта!`
          // );
          assistantRef.current.sendData({
            action: {
              action_id: 'saFieldMessage',
              parameters: {
                text: `Клетка ${coordStr.toUpperCase()} уже открыта!`,
              },
            },
          });
        } else if (openedCellsMatrixRef.current[pos.y][pos.x] === -1) {
          // messageNotification(
          //   'Открытие клетки поля',
          //   `На клетке ${coordStr.toUpperCase()} уже установлен флаг!`
          // );
          assistantRef.current.sendData({
            action: {
              action_id: 'saFieldMessage',
              parameters: {
                text: `На клетке ${coordStr.toUpperCase()} уже установлен флаг!`,
              },
            },
          });
        }
      } else if (
        statusRef.current === 'not_started' ||
        statusRef.current === 'new'
      ) {
        newGame(pos);
      }
    } else {
      // messageNotification(
      //   'Открытие клетки поля',
      //   'Клетка с введёнными координатами не найдена!',
      //   'warning'
      // );
      assistantRef.current.sendData({
        action: {
          action_id: 'saFieldMessage',
          parameters: {
            text: `Клетка с введёнными координатами не найдена!`,
          },
        },
      });
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
              // messageNotification(
              //   'Установка/снятие флага',
              //   `Клетка ${coordStr.toUpperCase()} уже открыта!`
              // );
              assistantRef.current.sendData({
                action: {
                  action_id: 'saFieldMessage',
                  parameters: {
                    text: `Клетка ${coordStr.toUpperCase()} уже открыта!`,
                  },
                },
              });
            }
          }
        }
      }
    } else {
      // messageNotification(
      //   'Установка/снятие флага',
      //   'Клетка с введёнными координатами не найдена!',
      //   'warning'
      // );
      assistantRef.current.sendData({
        action: {
          action_id: 'saFieldMessage',
          parameters: {
            text: `Клетка с введёнными координатами не найдена!`,
          },
        },
      });
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

  // Перевод времени
  const toHHMMSS = (secs, isHour = false) => {
    let secNum = parseInt(secs, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor(secNum / 60) % 60;
    let seconds = secNum % 60;

    let tempTime;

    if (isHour) {
      tempTime = [hours, minutes, seconds]
        .map((v) => (v < 10 ? '0' + v : v))
        .join(':');
    } else {
      tempTime = [hours, minutes, seconds]
        .map((v) => (v < 10 ? '0' + v : v))
        .filter((v, i) => v !== '00' || i > 0)
        .join(':');
    }

    return tempTime;
  };

  // Словарь официальных и неофициальных слов
  const wordAppeal = () => {
    let dictAppeal = null;

    if (assistantAppealOfficialRef.current) {
      dictAppeal = {
        word01: 'Вы',
        word02: 'Вам',
        word03: 'Вам',
        word04: 'скажите',
        word05: 'можете',
        word06: 'назовите',
      };
    } else {
      dictAppeal = {
        word01: 'ты',
        word02: 'тебе',
        word03: 'Тебе',
        word04: 'скажи',
        word05: 'можешь',
        word06: 'назови',
      };
    }

    return dictAppeal;
  };

  // Словарь слов зависыщий от пола ассистента
  const wordGender = () => {
    let dictGender = null;

    if (assistantGenderRef.current === 'male') {
      dictGender = {
        word01: 'прочитал',
      };
    } else if (assistantGenderRef.current === 'female') {
      dictGender = {
        word01: 'прочитала',
      };
    }

    return dictGender;
  };

  // Сообщение привествие
  const startMessage = () => {
    let dictAppeal = wordAppeal();
    let dictGender = wordGender();
    let tempText = '';

    tempText = `Добро пожаловать в занимательную игру Профессиональный сапёр! ${dictAppeal.word03} предстоит разминировать игровое поле. Чтобы я ${dictGender.word01} правила, ${dictAppeal.word04} «правила».`;
    return tempText;
  };

  // Словарь формы обращения персонажа
  const helpText = () => {
    let dictAppeal = wordAppeal();
    let tempText = '';

    tempText = `Цель игры Профессиональный сапёр – открыть все пустые ячейки, не попадая при этом ни на одну мину. 
    Чтобы открыть ячейку ${dictAppeal.word02} необходимо сказать «открыть» и назвать координаты ячейки, например, А1.
    Для того чтобы отметить клетку с предполагаемой миной ${dictAppeal.word04} «флаг» и ${dictAppeal.word06} координаты ячейки, например, Б2.
    Чтобы приостановить игру ${dictAppeal.word01} ${dictAppeal.word05} сказать «пауза», а для возобновления игры «продолжить». 
    Начать новую игру ${dictAppeal.word05} по команде «снова» или «заново». Уровень игры меняется командой «сложность» с указанием
    одного из вариантов «новичок», «любитель» или «профессионал». 
    Переключение цветовой темы происходит по команде «тема» и слову «светлая» или «тёмная».`;
    return tempText;
  };

  return (
    <main className="main-container">
      <DocumentStyle
        themeColorsDark={themeColorsDark}
        assistantCharacter={assistantCharacter}
      />

      <Controllers
        assistantRef={assistantRef}
        status={status}
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
        onToHHMMSS={toHHMMSS}
      />

      <Field
        assistantCharacter={assistantCharacter}
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
        helpActive={helpActive}
        themeColorsDark={themeColorsDark}
        assistantRef={assistantRef}
        assistantCharacter={assistantCharacter}
        onSetHelpActive={setHelpActive}
        onHelpText={helpText}
      />
    </main>
  );
}
export default App;
