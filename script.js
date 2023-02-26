const gameBoardDiv = document.querySelector(".gameboard");
const winnerText = document.querySelector(".winner");

const displayController = (() => {
  const boardElements = (boardArray) => {
    gameBoardDiv.innerHTML = "";
    for (let rowIdx = 0; rowIdx < boardArray.length; rowIdx++) {
      for (let cellIdx = 0; cellIdx < boardArray[rowIdx].length; cellIdx++) {
        let marker = getMarker(boardArray, rowIdx, cellIdx);
        const cell = document.createElement("div");
        cell.setAttribute("data-row", rowIdx);
        cell.setAttribute("data-cell", cellIdx);
        cell.textContent = marker;
        cell.classList.add("cell");
        gameBoardDiv.appendChild(cell);
      }
    }
    setCellListeners();
  };
  const setCellListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(function (cell) {
      let rowIdx = cell.dataset.row;
      let cellIdx = cell.dataset.cell;
      cell.addEventListener("click", function () {
        gameboard.takeTurn(rowIdx, cellIdx);
      });
    });
  };
  function getMarker(boardArray, rowIdx, cellIdx) {
    if (boardArray[rowIdx][cellIdx] == -1) {
      return "O";
    } else if (boardArray[rowIdx][cellIdx] == 1) {
      return "X";
    } else {
      return "";
    }
  }

  return { boardElements };
})();

const gameboard = (() => {
  let boardArray = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  let currentTurn = "Player1";

  const fillCell = (row, cell, value) => {
    boardArray[row][cell] = value;
    displayController.boardElements(boardArray);
    detectGameOver();
  };

  const isValidTurn = (row, cell, player) => {
    if (boardArray[row][cell] == 0 && player == currentTurn) {
      return true;
    }
    return false;
  };

  const takeTurn = (rowIdx, cellIdx) => {
    let playerValue = currentTurn == "Player1" ? 1 : -1;
    fillCell(rowIdx, cellIdx, playerValue);
    toggleTurn();
  };

  const toggleTurn = () => {
    if (currentTurn == "Player1") {
      currentTurn = "Player2";
    } else {
      currentTurn = "Player1";
    }
  };

  const resetBoard = () => {
    boardArray = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    displayController.boardElements(boardArray);
  };

  const detectGameOver = () => {
    //Detect vertical 3-in-a-row
    let sumDiagonalLeft = 0;
    let sumDiagonalRight = 0;
    for (let rowIdx = 0; rowIdx < boardArray.length; rowIdx++) {
      sumDiagonalLeft += boardArray[rowIdx][rowIdx];
      sumDiagonalRight += boardArray[rowIdx][2 - rowIdx];
      if (sumDiagonalLeft == -3 || sumDiagonalLeft == 3) {
        endGame(sumDiagonalLeft);
      } else if (sumDiagonalRight == -3 || sumDiagonalRight == 3) {
        endGame(sumDiagonalRight);
      }
      //Detect horizontal 3-in-a-row
      let sumHorizontal = 0;
      let sumVeritical = 0;
      for (let cellIdx = 0; cellIdx < boardArray[rowIdx].length; cellIdx++) {
        sumHorizontal += boardArray[rowIdx][cellIdx];
        sumVeritical += boardArray[cellIdx][rowIdx];
        if (sumHorizontal == -3 || sumHorizontal == 3) {
          endGame(sumHorizontal);
        } else if (sumVeritical == -3 || sumVeritical == 3) {
          endGame(sumVeritical);
        }
      }
    }
  };

  const endGame = (winnerValue) => {
    winnerName = winnerValue == 3 ? "Player 1" : "Player 2";
    console.log("🚀 ~ file: script.js:88 ~ endGame ~ winnerName:", winnerName);
    resetBoard();
  };

  return { fillCell, resetBoard, takeTurn, isValidTurn };
})();

const playerFactory = (name, score) => {
  return { name, score };
};
gameboard.resetBoard();
