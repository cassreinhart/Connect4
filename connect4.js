/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
//board[y][x] = something
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  
  for (let i = 0; i < HEIGHT; i++) {
    if (!board[i]) board[i] = [];
    for (let j = 0; j < WIDTH; j++) {
      board[i][j] = null;
    }
  } return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  htmlBoard = document.getElementById("board");
  
  const top = document.createElement("tr"); //creates top row where pieces are 'placed'
  top.setAttribute("id", "column-top"); //creates an id "column-top" for the top row
  top.addEventListener("click", handleClick); //adds event listener for a click (piece placed)

  for (let x = 0; x < WIDTH; x++) { //loop over width variable to create cells for the top row
    const headCell = document.createElement("td"); //creates cells 
    headCell.setAttribute("id", x); //sets an id (by position) for each cell so we can identify where the pieces are placed
    top.append(headCell); //adds cell to top row
  }
  htmlBoard.append(top); //adds the finished top row to the board

  for (let y = 0; y < HEIGHT; y++) { //loop over the height variable to create rows for the game board
    const row = document.createElement("tr"); //creates a table row for each value in height
    
    for (let x = 0; x < WIDTH; x++) { //loop over width to create cells within the rows
      const cell = document.createElement("td"); //creates the cells
      cell.setAttribute("id", `${y}-${x}`); //creates a locator id so we can see where the pieces end up (id winner)
      row.append(cell); //adds each cell to the row
    }
    htmlBoard.append(row); //adds the finished row to the board
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) return y;
  } return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const pieceDiv = document.createElement("div"); //creates a div to represent a piece
  pieceDiv.classList.add('piece', `p${currPlayer}`, 'drop'); //adds the p1/p2 class to identify which player's piece it is

  //insert into correct table cell
  let cell = document.getElementById(`${y}-${x}`);
  cell.append(pieceDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = `${currPlayer}`; // TODO: add line to update in-memory board

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('TIE!!!')
  }

  // switch players
  // TODO: switch ternary operator currPlayer 1 <-> 2
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {currPlayer = 1};
  // currPlayer === 1 ? currPlayer === 2 : currPlayer === 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] == currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) { //loop thru columns to check each cell
    for (let x = 0; x < WIDTH; x++) { //loop thru cells in each row
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //checks for horizontal winner
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //checks for vertical winner
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //checks for diagonal winner ascending towards the right
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //checks for diagonal winner ascending towards the left

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { //if any of the combinations are true, return true
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
