import React from "react";
import "./App.css";
function Square(props) {
  let textInput = React.createRef();
  let tempClassName = "square";
  if (props.isAnswer) tempClassName += " red";
  if (props.isSelected) tempClassName += " focus";
  if (!props.isValid) tempClassName += " invalid";
  const onClick = () => {
    textInput.current.focus();
    props.onClick();
  };
  return (
    <button
      type="button"
      className={tempClassName}
      ref={textInput}
      onClick={onClick}
    >
      {props.value}
    </button>
  );
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSquare: [-1, -1],
      previousNumber: [-1, -1, -1] // row,col,number
    };
  }
  onClick(y, k) {
    const [previousRow, previousCol] = this.state.selectedSquare;
    if (previousRow === y && previousCol === k) {
      const lastValue = this.props.info.questionGrid[y][k];
      const newNum = lastValue !== 9 ? lastValue + 1 : 0;
      this.setState({ previousNumber: [y, k, newNum] });
      this.props.onKeyPress(y, k, newNum);
    }
    this.setState({ selectedSquare: [y, k] });
  }

  //return 0 if valid
  //       1 if row invalid
  //       2 if col invalid
  //       3 if grid invalid
  userInputIsValid(row, col, number) {
    const questionGrid = this.props.info.questionGrid;
    //check for row
    const orginalRow = questionGrid[row];
    if (orginalRow.filter(x => x === number).length > 1) return 1;
    //check for col
    const orginalCol = questionGrid.map(x => x[col]);
    if (orginalCol.filter(x => x === number).length > 1) return 2;
    //check for grid
    //extension function to return rows / cols (index-wise)to check
    const filterNonSubGrid = number => {
      const dimLength = Math.sqrt(this.props.info.questionGrid.length);
      const startIndex = Math.floor(number / dimLength) * dimLength;
      return new Array(dimLength).fill(0).map((x, i) => startIndex + i);
    };
    const rowsToTake = filterNonSubGrid(row);
    const colsToTake = filterNonSubGrid(col);
    const orginalGrid = questionGrid
      //rows to cover
      .filter((_, i) => rowsToTake.includes(i))
      // cols to cover
      .flatMap(x => x.filter((_, i) => colsToTake.includes(i)));
    if (orginalGrid.filter(x => x === number).length > 1) return 3;
    return 0;
  }
  handleKeyUp(e) {
    const [selectedRow, selectedCol] = this.state.selectedSquare;
    const length = this.props.info.questionGrid.length;
    if (selectedRow === -1 || selectedCol === -1) return;
    // handle Backspace
    if (e.keyCode === 8) {
      this.props.onKeyPress(selectedRow, selectedCol, -1);
    }
    const numList = new Array(length).fill(0).map((x, i) => (i + 1).toString());
    if (!numList.includes(e.key)) return;
    const num = parseInt(e.key);
    this.setState({ previousNumber: [selectedRow, selectedCol, num] });
    this.props.onKeyPress(selectedRow, selectedCol, num);
  }
  renderGrid() {
    const questionGrid = this.props.info.questionGrid;
    const answerGrid = this.props.info.answerGrid;
    const [previousRow, previousCol, previousNum] = this.state.previousNumber;

    let validNumber = 0;
    if (previousRow === previousCol && previousRow === -1) {
      //pass
    } else if (questionGrid[previousRow][previousCol] !== previousNum) {
      //pass
    } else {
      validNumber = this.userInputIsValid(
        previousRow,
        previousCol,
        previousNum
      );
    }
    const isValid = (row, col) => {
      switch (validNumber) {
        case 0:
          return true;
        case 1: //row Invalid
          return !(row === previousRow);
        case 2: //col Invalid
          return !(col === previousCol);
        case 3: //grid Invalid
          const dimLength = Math.sqrt(this.props.info.questionGrid.length);
          const startingRowIndex =
            Math.floor(previousRow / dimLength) * dimLength;
          const startingColIndex =
            Math.floor(previousCol / dimLength) * dimLength;
          return !(
            row >= startingRowIndex &&
            row < startingRowIndex + dimLength &&
            col >= startingColIndex &&
            col < startingColIndex + dimLength
          );
        default:
          return true;
      }
    };
    const isSelected = (row, col) => {
      const [selectedRow, selectedCol] = this.state.selectedSquare;
      return row === selectedRow && col === selectedCol;
    };
    const formSquare = (x, y) => {
      const temp = x.map((j, k) => (
        <Square
          key={"Row" + y + " Col" + k}
          onClick={() => this.onClick(y, k)}
          isValid={isValid(y, k)}
          isAnswer={questionGrid[y][k] === 0 ? true : false}
          isSelected={isSelected(y, k)}
          value={j === 0 ? null : j}
        />
      ));
      return (
        <div className="board-row" key={"row" + y}>
          {temp}
        </div>
      );
    };
    const visual = answerGrid.map(formSquare);
    return visual;
  }
  render() {
    return (
      <div className="board" onKeyUp={e => this.handleKeyUp(e)}>
        {this.renderGrid()}
      </div>
    );
  }
}

/*  7/2/2020: 
possible integration idea 
  1.Show user how many solutions available because ideally u want only one
  (dancing-links findAll function take too much resource with sparse matrix 12/2/2020 give up)
  2.Make it compatible with mobile version 
    a) users cant use keyboard to enter number with mobile
    b) change .css to match size (12/2/2020 done)
*/
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      puzzle: {
        questionGrid: new Array(9).fill(0).map(x => new Array(9).fill(0)),
        answerGrid: new Array(9).fill(0).map(x => new Array(9).fill(0))
      },
      Valid: true //Indicate if the sudoku is solvable
    };
  }
  reduceToExactCover() {
    const puzzle = this.state.puzzle;
    const length = this.props.length;

    const dimLength = Math.sqrt(length);
    const rangeArray = Array.from(Array(length).keys());
    let constraints = new Array(length * length * length);
    for (let i of rangeArray) {
      //Row change
      for (let j of rangeArray) {
        // Column change
        for (let k of rangeArray) {
          // Number change
          const uniqueCover = Array(length * length)
            .fill(0)
            .map((z, x) => (x === i * length + j ? 1 : 0));
          const rowCover = Array(length * length)
            .fill(0)
            .map((z, x) => (x === i * length + k ? 1 : 0));
          const colCover = Array(length * length)
            .fill(0)
            .map((z, x) => (x === j * length + k ? 1 : 0));
          const gridCover = Array(length * length)
            .fill(0)
            .map((z, x) => {
              const [dimI, dimJ] = [
                Math.floor(i / dimLength),
                Math.floor(j / dimLength)
              ];
              return x === dimI * length * dimLength + dimJ * length + k
                ? 1
                : 0;
            });
          //data: Row i,Col j, value k
          constraints[i * length * length + j * length + k] = {
            data: `${i},${j},${k}`,
            row: uniqueCover.concat(rowCover, colCover, gridCover)
          };
        }
      }
    }
    //filter out the initial values
    const initialInput = constraints.filter((z, x) =>
      puzzle.questionGrid[Math.floor(x / length / length)][
        Math.floor((x % (length * length)) / length)
      ] ===
      (x % length) + 1
        ? true
        : false
    );
    return constraints
      .filter((z, x) =>
        puzzle.questionGrid[Math.floor(x / length / length)][
          Math.floor((x % (length * length)) / length)
        ] === 0
          ? true
          : false
      )
      .concat(initialInput);
  }
  resolveClick() {
    const exactCoverProb = this.reduceToExactCover();
    //produce one sudoku Result visually
    const dlx = require("dancing-links");
    const answer = dlx.findOne(exactCoverProb); //.flatMap(x => x);
    if (answer.length === 0) {
      this.setState({
        Valid: false
      });
      return;
    }

    let puz = this.state.puzzle;

    answer[0].forEach(element => {
      const [i, j, k] = element.data.split(",").map(x => parseInt(x));
      puz.answerGrid[i][j] = k + 1;
    });
    this.setState({
      puzzle: puz,
      Valid: true
    });
  }

  handleValueChange(row, col, number) {
    const puz = this.state.puzzle;
    //-1 indicate user input backspace
    puz.questionGrid[row][col] = number === -1 ? 0 : number;
    puz.answerGrid[row][col] = number === -1 ? 0 : number;
    this.setState({
      puzzle: puz
    });
  }
  render() {
    const complete = this.state.Valid ? "" : "No Solutions!";
    const useDefaultSudoku = () => {
      this.setState({
        puzzle: {
          questionGrid: [
            [0, 0, 0, 6, 9, 8, 4, 5, 3],
            [9, 5, 0, 0, 1, 7, 8, 6, 2],
            [0, 0, 3, 0, 5, 0, 1, 9, 0],
            [1, 6, 7, 0, 0, 0, 0, 3, 8],
            [8, 2, 5, 7, 0, 0, 9, 1, 0],
            [3, 0, 9, 8, 2, 1, 5, 0, 0],
            [0, 7, 0, 5, 0, 0, 3, 0, 1],
            [5, 0, 1, 0, 0, 4, 6, 8, 0],
            [4, 9, 0, 0, 3, 0, 7, 0, 5]
          ],
          answerGrid: [
            [0, 0, 0, 6, 9, 8, 4, 5, 3],
            [9, 5, 0, 0, 1, 7, 8, 6, 2],
            [0, 0, 3, 0, 5, 0, 1, 9, 0],
            [1, 6, 7, 0, 0, 0, 0, 3, 8],
            [8, 2, 5, 7, 0, 0, 9, 1, 0],
            [3, 0, 9, 8, 2, 1, 5, 0, 0],
            [0, 7, 0, 5, 0, 0, 3, 0, 1],
            [5, 0, 1, 0, 0, 4, 6, 8, 0],
            [4, 9, 0, 0, 3, 0, 7, 0, 5]
          ]
        }
      });
    };
    const clearSudoku = () => {
      this.setState({
        puzzle: {
          questionGrid: new Array(9).fill(0).map(x => new Array(9).fill(0)),
          answerGrid: new Array(9).fill(0).map(x => new Array(9).fill(0))
        }
      });
    };
    return (
      <div className="game">
        <Board
          info={this.state.puzzle}
          onKeyPress={(num, row, col) => this.handleValueChange(num, row, col)}
        />
        <div className="sideBar">
          <button className="defaultSudoku" onClick={useDefaultSudoku}>
            Try with default one!
          </button>
          <button className="clearSudoku" onClick={clearSudoku}>
            Clear the board!
          </button>
          <button className="click" onClick={() => this.resolveClick()}>
            Resolve It!
          </button>
          <span>{complete}</span>
        </div>
      </div>
    );
  }
}
export default Game;
