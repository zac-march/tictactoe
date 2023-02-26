const gameBoardDiv = document.querySelector(".gameboard");
const infoText = document.querySelector(".info");
const resetBtn = document.querySelector(".reset");

const displayController = (() => {
  const boardElements = (boardArray) => {
    gameBoardDiv.innerHTML = "";
    for (let rowIdx = 0; rowIdx < boardArray.length; rowIdx++) {
      for (let cellIdx = 0; cellIdx < boardArray[rowIdx].length; cellIdx++) {
        let marker = getMarker(boardArray, rowIdx, cellIdx);

        const cell = document.createElement("div");
        cell.setAttribute("data-row", rowIdx);
        cell.setAttribute("data-cell", cellIdx);
        cell.classList.add("cell");

        const cellContent = document.createElement("p");
        cellContent.classList.add("cell-content");
        cellContent.textContent = marker;

        cell.appendChild(cellContent);
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

  const getMarker = (boardArray, rowIdx, cellIdx) => {
    if (boardArray[rowIdx][cellIdx] == -1) {
      return "O";
    } else if (boardArray[rowIdx][cellIdx] == 1) {
      return "X";
    } else {
      return "";
    }
  };

  const currentPlayerTurn = (player) => {
    infoText.textContent = player + "'s turn";
  };

  const endGame = (gameOverValue) => {
    if (gameOverValue == 0) {
      infoText.textContent = "Tie!";
    } else {
      winnerName = gameOverValue == 3 ? "Player 1" : "Player 2";
      infoText.textContent = winnerName + " wins!";
    }
  };

  return { boardElements, currentPlayerTurn, endGame };
})();

const gameboard = (() => {
  let boardArray = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  let currentTurn;
  let isGameOver;

  const fillCell = (row, cell, value) => {
    boardArray[row][cell] = value;
    displayController.boardElements(boardArray);
    detectGameOver();
  };

  const isValidTurn = (row, cell) => {
    if (boardArray[row][cell] == 0 && !isGameOver) {
      return true;
    }
    return false;
  };

  const takeTurn = (rowIdx, cellIdx) => {
    if (!isValidTurn(rowIdx, cellIdx)) return;
    let playerValue = currentTurn == "Player 1" ? 1 : -1;
    fillCell(rowIdx, cellIdx, playerValue);
    if (!isGameOver) {
      toggleTurn();
    }
  };

  const toggleTurn = () => {
    if (currentTurn == "Player 1") {
      currentTurn = "Player 2";
    } else {
      currentTurn = "Player 1";
    }
    displayController.currentPlayerTurn(currentTurn);
  };

  const resetBoard = () => {
    boardArray = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    isGameOver = false;
    currentTurn = "Player 1";
    displayController.boardElements(boardArray);
    displayController.currentPlayerTurn(currentTurn);
  };

  const detectGameOver = () => {
    let gameOverValue = findGameOverValue();
    if (gameOverValue != undefined) {
      isGameOver = true;
      displayController.endGame(gameOverValue);
    }
  };

  const findGameOverValue = () => {
    //Detect vertical 3-in-a-row
    let sumDiagonalLeft = 0;
    let sumDiagonalRight = 0;
    let filledCellsValue = 0;
    for (let rowIdx = 0; rowIdx < boardArray.length; rowIdx++) {
      sumDiagonalLeft += boardArray[rowIdx][rowIdx];
      sumDiagonalRight += boardArray[rowIdx][2 - rowIdx];
      if (sumDiagonalLeft == -3 || sumDiagonalLeft == 3) {
        return sumDiagonalLeft;
      } else if (sumDiagonalRight == -3 || sumDiagonalRight == 3) {
        return sumDiagonalRight;
      }
      //Detect horizontal 3-in-a-row
      let sumHorizontal = 0;
      let sumVeritical = 0;
      for (let cellIdx = 0; cellIdx < boardArray[rowIdx].length; cellIdx++) {
        sumHorizontal += boardArray[rowIdx][cellIdx];
        sumVeritical += boardArray[cellIdx][rowIdx];
        filledCellsValue += Math.abs(boardArray[rowIdx][cellIdx]);
        if (sumHorizontal == -3 || sumHorizontal == 3) {
          return sumHorizontal;
        } else if (sumVeritical == -3 || sumVeritical == 3) {
          return sumVeritical;
        }
        if (filledCellsValue == 9) {
          return 0;
        }
      }
    }
  };

  return { resetBoard, takeTurn, isGameOver };
})();

resetBtn.addEventListener("click", function () {
  gameboard.resetBoard();
});

gameboard.resetBoard();
