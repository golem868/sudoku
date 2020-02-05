import React from "react";
import "./App.css";
function Square(props) {
  let tempClassName = "square";
  if (props.isAnswer) tempClassName += " red";
  if (props.isSelected) tempClassName += " focus";
  return (
    <button className={tempClassName} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSquare: [-1, -1]
    };
  }
  onClick(y, k) {
    this.setState({ selectedSquare: [y, k] });
  }
  handleKeyUp(e) {
    const [selectedRow, selectedCol] = this.state.selectedSquare;
    if (selectedRow === -1 || selectedCol === -1) return;
    // handle Backspace
    if (e.keyCode === 8) {
      this.props.onKeyPress(-1, selectedRow, selectedCol);
    }
    const numList = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => x.toString());
    if (!numList.includes(e.key)) return;
    const num = parseInt(e.key);

    this.props.onKeyPress(num, selectedRow, selectedCol);
  }
  renderGrid() {
    const questionGrid = this.props.info.questionGrid;
    const answerGrid = this.props.info.answerGrid;
    const isSelected = (row, col) => {
      const [selectedRow, selectedCol] = this.state.selectedSquare;
      return row === selectedRow && col === selectedCol;
    };
    const formSquare = (x, y) => {
      const temp = x.map((j, k) => (
        <Square
          key={"Row" + y + " Col" + k}
          onClick={() => this.onClick(y, k)}
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
    const answer = dlx.findOne(exactCoverProb).flatMap(x => x);
    if (answer.length === 0) {
      this.setState({
        Valid: false
      });
      return;
    }
    let puz = this.state.puzzle;

    answer.forEach(element => {
      const [i, j, k] = element.data.split(",").map(x => parseInt(x));
      puz.answerGrid[i][j] = k + 1;
    });
    this.setState({
      puzzle: puz,
      Valid: true
    });
  }
  handleValueChange(number, row, col) {
    const puz = this.state.puzzle;
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
