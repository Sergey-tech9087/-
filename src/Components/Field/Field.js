import {
  createSmartappDebugger,
  createAssistant,
} from '@sberdevices/assistant-client';

import React, { useState, useEffect, useRef } from 'react';

import './Field.css';
import flag from '../../Assets/Flag.svg';

import FieldCell from '../FieldCell/FieldCell';

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === 'production') {
    //if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWJhNjNmNGE2YzNjN2ViZWNjNmVmODE4N2FkZjJhOGVkYjJkMGRmNTVjMDdhYzViYzEwMjg3MGUxY2VmNjVlNjU3MWVmOTczZDVkNGIyMyIsImF1ZCI6IlZQUyIsImV4cCI6MTYyOTE3Njc2MSwiaWF0IjoxNjI5MDkwMzUxLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiOGJiYWI1MDEtZmE2Yy00OWVmLWE5OTQtZDI4OTBmY2U0MzU4Iiwic2lkIjoiM2QzMTAyMzAtNjY2OC00NjMzLTkzYjMtMjFhNDY4MGExOGYwIn0.jw6ReEuOit5TCVEoT61yjPo0ezmAtP1RM1-pp0Pa45Ly_qpagTC9g4l7a98PoybF4y99VQxgKcCVNfeOkOFpvA6vzv-B9jUKhne1JGtNj70OO4X8fIoDUHieD1kV8bSeqcVQcv6Ngv6le4Fldf4PFzPzrcQwLfGIZxl6eGkuCwEVF9PgcoC3cPJLGdcL7iI25zM5qcxnSp4cNB1ew_YRP_OyjLM57I3rjJ0VlsuQE9XH1h773Khtl2arislVmioijiIxiQcUV5S3Edmov0FZiovvubLfjNCk4ZEffN2OC-wORyv0nmULJgq-Et5Qqv6333BOe6zA1elXFtS8uMhFNfadE4-juEN8t9pPz6Po1D0e60RQcJth-Mm14tLB6-q7eSBq6ZrlZbBoPLijBlApVFKR2lMf5agqQLdUMvmdtlMhGiupq9RyNzQmdtRKxBgPeykpcW8VpjkMTU-H_y3yil7D4mFIj1Y_HaatdqVAdS4InsVAQPR4oh1rK2DW9bpx9d4olv1CCVkgcpsYMRvPPhZsEZPUOcSSxMoZr1FjLa84h45mNa_1HnU0pq3bqmdQHzMnLpKKhlf_GyRcRLg6mSCsuJ8yopUUdBSZmL_L7jF_MV0sRQUJSq7-zBLNX0AF5iEdQ4xOL5TyOZaVXh7VNGirIeEj4bkKQjT3E7iupCw' ??
        '',
      initPhrase: `Запусти Профессиональный сапёр`,
      getState,
    });
  }
  return createAssistant({ getState });
};

const Field = ({
  difficulty,
  status,
  onStart: startGame,
  onLose: loseGame,
  onWin: winGame,
  onRestart: restartGame,
}) => {
  const LETTERS = 'АБВГДЕЖЗИКЛМНОПРСТУФ'.split('');
  useEffect(() => console.log(fieldMatrix));

  // independent functions

  const assistant = useRef();
  const state = {
    notes: [],
  };

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

  // indepndent finctions

  const [fieldData, setFieldData] = useState(calculateFieldData(difficulty));

  useEffect(() => {
    if (status === 'not_started') {
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

  // useEffect(() => {}, [fieldData]);

  //field data dependent

  const openCellWithObj = ({ y, x } = { y: 'err', x: 'err' }) => {
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
    console.log('Статус текущий 2:', status);
    const cell_div = document.querySelector(
      `.field__cell[data-y="${y_raw}"][data-x="${x_raw}"]`
    );
    const pos = strToCoordinateObj(y_raw, x_raw);
    if (cell_div != null && pos != null) {
      if (status === 'started') {
        console.log('Статус текущий 2_1:', status);
        openCellWithObj(pos);
      } else if (status === 'not_started') {
        console.log('Статус текущий 2_2:', status);
        newGame(pos);
      }
    } else alert('Клетка с введёнными координатами не найдена');
  };

  const toggleFlag = (e, y = 'Err', x = 'Err') => {
    e.preventDefault();
    if (y in openedCellsMatrix) {
      if (x in openedCellsMatrix[y]) {
        if (openedCellsMatrix[y][x] !== 1 && status === 'started') {
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
    if (status === 'not_started') {
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
      field_divs.push(
        <div className="field__letters" key={LETTERS[i]}>
          {LETTERS[i]}
        </div>
      );
    }
    for (let i = 1; i <= field_size.y; i++) {
      field_divs.push(
        <div className="field__numbers" key={i}>
          {i}
        </div>
      );
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

  const [firstOpened, setFirstOpened] = useState({ x: 'err', y: 'err' });

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
      <div className={'field field_' + difficulty}>
        {status === 'won' || status === 'lost' ? (
          <div
            className={
              'field__poster' +
              (status === 'won' ? ' field__poster_win' : ' field__poster_lose')
            }
            onClick={restartGame}
          >
            <span className="field__poster-text">
              {status === 'won' ? 'Победа!' : 'Проиграл!'}
            </span>
          </div>
        ) : null}
        {generateFieldDivs(fieldData)}
      </div>
    </main>
  );
};

export default Field;
