window.onload = function () {

	var game;

	var TicTacToeGame = function(playerToStart){
		this.grid = ["", "", "", "", "", "", "", "", ""];
		this.currentPlayer = playerToStart;
		this.computer = "x";
		this.player = "o";
		this.gameWon = false;
		this.winningCombination = "";
	}

	function switchPlayers() {
		if (game.currentPlayer === "x") {
			game.currentPlayer = "o";
		}
		else if (game.currentPlayer === "o") {
			game.currentPlayer = "x";
		}
	}

	// start the game
	function gameStart(playerToStart){
		console.log("makes it within here");

		// convert the green winning rows back to black;
		$(".square").css("background-color", "#000");

		// create a new game;
		game = new TicTacToeGame(playerToStart);

		// Computer starting of the game (It is assumed that "x" is computer currently)
		if (game.currentPlayer === "x") {
			// Have to refactor to possibly make game.grid a method of the function.
			// var computerMove = optimalMove(game.grid);
			
			// game.grid[computerMove] = "x";
			// switchPlayers();
			
			// game.updateGameGrid();

			computersTurn()
		}

	}

	// Given a grid, tic tac toe game will update.
	TicTacToeGame.prototype.updateGameGrid = function() {
		this.grid.forEach(function(gridPosition, index) {
			// Select the position
			var positionClassName = ".position" + index;
			var gridPosition = $(positionClassName);

			// Delete all the current childern
			gridPosition.empty();

			// Update the position
			if (this.grid[index] !== "") {
				gridPosition.append("<div class = " + this.grid[index] + "></div>");
			}

		}, this);
	};

	var registerEvents = (function() {
		// registerGridSelectionEvent();
		registerStartGameEvent();
	})();

	function registerGridSelectionEvent() {
		// var gridPositions = document.getElementsByClassName("square");
		var gridPositions = $(".square");
		var gridPositionsLen = gridPositions.length;

		gridPositions.on("click", function(){
			// Find the index of the position that was clicked.
			var positionStringValue = event.target.className.split(" ")[0];
			var positionIndex = parseInt(positionStringValue.replace("position", ""));

			// Only if the grid position is unoccupied do I enter this block.
			if (game.grid[positionIndex] === "") {
				// Keep the grid up to date.
				game.grid[positionIndex] = game.currentPlayer;

				$(event.target).append("<div class = '" + game.currentPlayer + "'></div>");
			
				switchPlayers();
				
				computersTurn();
			}

		})
		
		// for (var i = 0; i < gridPositionsLen; i++) {
		// 	gridPositions[i].addEventListener("click", function(){
		// 		// Find the index of the position that was clicked.
		// 		var positionStringValue = event.target.className.split(" ")[0];
		// 		var positionIndex = parseInt(positionStringValue.replace("position", ""));

		// 		// Only if the grid position is unoccupied do I enter this block.
		// 		if (game.grid[positionIndex] === "") {
		// 			// Keep the grid up to date.
		// 			game.grid[positionIndex] = game.currentPlayer;

		// 			$(event.target).append("<div class = '" + game.currentPlayer + "'></div>");
				
		// 			switchPlayers();
					
		// 			computersTurn();
		// 		}
		// 	});
		// }
	}

	function unregisterGridSelectionEvent() {
		$(".square").off();
	}

	function signalWin() {		
		// ex. winning combination "012"
		var winningCombinationArray = game.winningCombination.split("").map(function(gridSquareId) {
			return (".position" + gridSquareId); 
		});
		var selectors = winningCombinationArray.join(", ");
		
		$(selectors).css("background-color", "#FFC107");

		// unregister all the clicks in the board
		unregisterGridSelectionEvent();
	}

	function computersTurn() {
		var computerMove = optimalMove(game.grid);
			
		game.grid[computerMove] = "x";
		switchPlayers();
		
		game.updateGameGrid();
		
		if (game.gameWon) {
			signalWin();
		}
	}

	function registerStartGameEvent() {
		var gameStartButton = $("#startGameButton");
		
		// // This is written using the native javascript library as appossed to jquery below.
		// gameStartButton.addEventListener("click", function(){
		// 	gameStart("x");
		// });

		gameStartButton.click(function(){
			registerGridSelectionEvent();
			gameStart("x");
		});
	}

	// function makePlayersMove (event) {
	// 	// event.target.appendChild("<div class = 'x'></div>");
	// 	$(event.target).append("<div class = 'x'></div>");
	// 	// console.log("event test: ", event);
	// }

	// var grid = ["", "", "", "", "", "", "", "", ""];
	var grid = ["x", "", "x", "x", "o", "", "", "", ""];
	var currentPlayer = "x";

	var winConditions = ["012", "345", "678", "036", "147", "258", "048", "246"];

	function gameHandler (currentPlayer, gridPositionSelected) {
		// update player move on board.
		grid[gridPositionSelected] = currentPlayer;
		// check win codition
		if(checkForWin()){
			alert("x gon give it to u")
		}
		else {
			// currentPlayer = switchPlayer(currentPlayer);
			switchPlayer(currentPlayer);
		}
	}

	// function switchPlayer (currentPlayer) {
	// 	return currentPlayer === "x" ? "o" : "x";
	// }

	function switchPlayer (currentPlayer) {
		currentPlayer === "x" ? "o" : "x";
	}

	function checkForWin (currentGrid, player) {
		// Create current player position array
		var currentPlayerPositions = "";
		var winCombination;

		currentGrid.forEach(function(gridEntry, index){
			if (gridEntry === player) {
				currentPlayerPositions += index;
			}
		});

		winConditions.some(function(winEntry){
			if(currentPlayerPositions.includes(winEntry[0]) && currentPlayerPositions.includes(winEntry[1]) && currentPlayerPositions.includes(winEntry[2])) {
				winCombination = winEntry;
				return true;
			}
			return false;
		});

		return winCombination;
	}

	function printOutGrid(currentGrid){
		var gridOutput = "";
		grid.forEach(function(gridEntry, index){
			if (index%3 === 0) {
				gridOutput += "\n" + gridEntry;	
			}
			else {
				gridOutput += gridEntry;
			}
		});
		return gridOutput;
	}

	function findNumberOfPopulatedSpace(currentGrid){
		var currentCount = 0;
		currentGrid.forEach(function(gridEntry){
			if (gridEntry !== "") {
				currentCount++;
			}
		});
		return currentCount;
	}

	function optimalFirstMoveOfGame(){
		// This represents the center and corner spaces on board.
		var optimalFirstMove = [0, 2, 4, 6, 8];

		// For testing purpose gonna hard code to 0;
		return optimalFirstMove[Math.floor(Math.random() * 5)];
	}

	// Get all the current positions of the player in an array. 
	function findAllCurrentPositions(currentGrid, player) {
		var currentPositions = [];
		currentGrid.forEach(function(gridEntry, index){
			if (gridEntry === player) {
				currentPositions.push(index);
			}
		});
		return currentPositions;
	}

	// Returns the index that will win the game for a particular player.
	function attemptToWin(winCombinations, playerAttemptingToWin, blockingPlayerPositions) {
		var currentPlayerPositions = "";
		var gridIndexToWinGame;

		// Remove all the winning combinations with the opponents position
		winCombinations = winCombinations.filter(function(arrayEntry) {
			var includeWinCombination = true;
			blockingPlayerPositions.forEach(function(position){
				if (arrayEntry.includes(position + "")) {
					includeWinCombination = false;
				}
			});
			return includeWinCombination;
		});

		playerAttemptingToWin.forEach(function(currentPosition) {
			currentPlayerPositions += currentPosition;
		});

		// Can possible refactor this to be a regex expression.
		// Find the win combination

		// The possible win index combination as string.
		var currentMatchWinCombinationIndexes;
		var winningIndex;

		winCombinations.some(function(winEntry, index){
			currentMatchWinCombinationIndexes = [];
			for(var i = 0; i < 3; i++){
				if(currentPlayerPositions.includes(winEntry[i])){
					currentMatchWinCombinationIndexes.push(winEntry[i]);
				}
			}

			if (currentMatchWinCombinationIndexes.length === 2) {
				// makes a copy of the win entry combination.
				winningIndex = winEntry;
				currentMatchWinCombinationIndexes.forEach(function(combinationEntry){
					winningIndex = winningIndex.replace(combinationEntry, "");
				})
				game.winningCombination = winEntry;
				return true;
			}
		});

		if (typeof winningIndex !== "undefined") {
			return parseInt(winningIndex, 10);
		}
		else {
			return -1;
		}
	}

	function playerMoveNumber(playerPositions) {
		return 1 + playerPositions.length;
	}

	// On edge piece.
	function onEdgePiece(positions) {
		var edgePositions = [1, 3, 5, 7];
		var edgePosition = -1;

		positions.forEach(function(position){
			if (edgePositions.includes(position)) {
				edgePosition = position;
			}
		});

		return edgePosition;
	}

	// position of corner piece to place on after the oppenent has placed on an edge piece.
	function secondCornerMoveForOppEdgeMove(currentOpponentEdge) {
		var optimalCornerMoves;

		switch(currentOpponentEdge) {
			case 1:
				optimalCornerMoves = [6, 8];
				return optimalCornerMoves[Math.floor(Math.random() * 2)];
			case 3:
				optimalCornerMoves = [2, 8];
				return optimalCornerMoves[Math.floor(Math.random() * 2)];
			case 5:
				optimalCornerMoves = [0, 6];
				return optimalCornerMoves[Math.floor(Math.random() * 2)];
			case 7:
				optimalCornerMoves = [0, 2];
				return optimalCornerMoves[Math.floor(Math.random() * 2)];
		}
	}

	// position of corner piece to place on after the oppenent has placed on an corner piece.
	function secondCornerMoveForOppCornerMove(opponentPositions) {
		switch(opponentPositions[0]) {
			case 0:
				return 8;
			
			case 2:
				return 6;
			
			case 6:
				return 2;
				
			case 8:
				return 0;
		}	
	}

	// second move with the first move being made in the center of the board.
	function secondMoveCenterPieceAlgorithm(playerPositions, opponentPositions, openPositions) {
		var currentOpponentEdge = onEdgePiece(opponentPositions);
		// Determine if the opponent made an edge or corner move.
		if (currentOpponentEdge > -1) {
			return secondCornerMoveForOppEdgeMove(currentOpponentEdge);
		}
		else {
			return secondCornerMoveForOppCornerMove(opponentPositions);
		}
	}

	// position of corner piece to place on after the opponent has placed on an center piece.
	function secondCornerMoveForOppCenterMove(playerPositions) {
		switch(playerPositions[0]) {
			case 0:
				return 8;

			case 2:
				return 6;

			case 6:
				return 2;

			case 8:
				return 0;
		}
	}

	// position of corner piece to place on after the opponent has placed on not a center piece.
	function secondCornerMoveForOppNotCenterMove(playerPositions, opponentPositions, openPositions) {
		switch(playerPositions[0]) {
			case 0:
				if (opponentPositions[0] === 1 || opponentPositions[0] === 2) {
					return 6;
				}
				return 2;
			case 2:
				if (opponentPositions[0] === 0 || opponentPositions[0] === 1) {
					return 8;
				}
				return 0;
			case 6:
				if (opponentPositions[0] === 7 || opponentPositions[0] === 8) {
					return 0;
				}
				return 8;
			case 8:
				if (opponentPositions[0] === 6 || opponentPositions[0] === 7) {
					return 2;
				}
				return 6;
		}
	}

	// second move with the first move being made in the corner of the board.
	function secondMoveCornerPieceAlgorithm(playerPositions, opponentPositions, openPositions) {
		// determine if the opponent has made a move in the center of the board.
		if (opponentPositions.indexOf(4) > -1) {
			return secondCornerMoveForOppCenterMove(playerPositions);
		}
		else {
			return secondCornerMoveForOppNotCenterMove(playerPositions, opponentPositions, openPositions);	
		}
	}

	function secondOptimalMoveOnBoardFirst(currentGrid, playerPositions, opponentPositions, openPositions, player, opponent) {
		// Player has a position in the center of the board.
		if (playerPositions.indexOf(4) > -1) {
			return secondMoveCenterPieceAlgorithm(playerPositions, opponentPositions, openPositions);
		}
		else {
			// Player has position in one of the corners of the board.
			return secondMoveCornerPieceAlgorithm(playerPositions, opponentPositions, openPositions);
		}
	}

	// Found this at https://gist.github.com/axelpale/3118596, have to debug through to make sure it is good.
	function k_combinations(set, k) {
		var i, j, combs, head, tailcombs;
		
		if (k > set.length || k <= 0) {
			return [];
		}
		
		if (k == set.length) {
			return [set];
		}
		
		if (k == 1) {
			combs = [];
			for (i = 0; i < set.length; i++) {
				combs.push([set[i]]);
			}
			return combs;
		}
		
		// Assert {1 < k < set.length}
		
		combs = [];
		for (i = 0; i < set.length - k + 1; i++) {
			head = set.slice(i, i+1);
			tailcombs = k_combinations(set.slice(i + 1), k - 1);
			for (j = 0; j < tailcombs.length; j++) {
				combs.push(head.concat(tailcombs[j]));
			}
		}
		return combs;
	}

	function findDoubleTrapMove(winPair, playerPositions, openPositions) {
		var doubleTrapMove = -1;
		var grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		var movesSet1 = winPair[0].split("");
		var movesSet2 = winPair[1].split("");

		movesSet1.forEach(function(move){
			if(!playerPositions.includes(move)){
				grid[move] += 1;
			}
		});

		movesSet2.forEach(function(move){
			if(!playerPositions.includes(move)){
				grid[move] += 1;
			}
		});

		grid.some(function(entry, index){
			if (entry > 1 && openPositions.includes(index)) {
				doubleTrapMove = index;
				return true;
			}
		});

		return doubleTrapMove;
	};

	// Try to set the trap in which you have two ways of winning.
	function setDoubleWinTrap(winConditions, playerPositions, opponentPositions, openPositions) {
		var possibleWinConditions;
		// Have to remove all the winConditions with out the player position
		possibleWinConditions = winConditions.filter(function(condition){
			var toKeep = false;
			playerPositions.forEach(function(position){
				if(condition.includes(position)) {
					toKeep = true;
				}
			});
			return toKeep;
		});

		// Have to remove all the winConditions with the opponent player position
		possibleWinConditions = possibleWinConditions.filter(function(condition){
			var toKeep = true;
			opponentPositions.forEach(function(position){
				if(condition.includes(position)) {
					toKeep = false;
				}
			});
			return toKeep;
		});

		// Find all possible combinations of a two win pairs
		var possibleTwoWinPairs = k_combinations(possibleWinConditions, 2);

		// Have to find the overlapping move that will result in two win situation
		var doubleTrapMove = -1;

		possibleTwoWinPairs.some(function(winPair){
			doubleTrapMove = findDoubleTrapMove(winPair, playerPositions, openPositions);
			if (doubleTrapMove > -1) {
				return true
			}
		});

		return doubleTrapMove;
	}

	function thirdOptimalMoveOnBoardFirst(currentGrid, playerPositions, opponentPositions, openPositions, player, opponent) {
		var bestMove = setDoubleWinTrap(winConditions, playerPositions, opponentPositions, openPositions);
		// Try to set up the unwinnable trap.
		if (bestMove > -1) {
			return bestMove;
		}
	}

	function bestPossibleMoveOnBoard(currentGrid, player, opponent, madeFirstMove){
		// Find all your current positions on the grid.
		var playerPositions = findAllCurrentPositions(currentGrid, player);

		// Find all current positions of opponent on grid.
		var opponentPositions = findAllCurrentPositions(currentGrid, opponent);

		var bestMove;

		// Go for the win
		bestMove = attemptToWin(winConditions, playerPositions, opponentPositions);
		if (bestMove >= 0) {
			game.gameWon = true;
			return bestMove
		}
		
		// Have to block opponent from winning.
		bestMove = attemptToWin(winConditions, opponentPositions, playerPositions);
		if (bestMove >= 0) {
			return bestMove
		}

		// Find all the open postitions on the field.
		var openPositions = findAllCurrentPositions(currentGrid, "");

		// Different set of algorightms depending on whether you made the first move or not.
		if (madeFirstMove) {
			// Move number on the board:
			switch(playerMoveNumber(playerPositions)) {
				// second move on board 
				case 2:
					bestMove = secondOptimalMoveOnBoardFirst(currentGrid, playerPositions, opponentPositions, openPositions, player, opponent);
					break;

				// third move on board 
				case 3:
					bestMove = thirdOptimalMoveOnBoardFirst(currentGrid, playerPositions, opponentPositions, openPositions, player, opponent);				
					break;

				default:
					bestMove = openPositions[Math.floor(Math.random() * openPositions.length)]
				// // fourth move on board 
				// case 4:
				// 	break;

				// // fifth move on board 
				// case 5:
				// 	break;
			}
		}
		else {

		}

		return bestMove;
	}

	function optimalMove(currentGrid){
		var numberOfOccupiedSpaces = findNumberOfPopulatedSpace(currentGrid);
		var firstMove = false;

		// First move on board.
		if (numberOfOccupiedSpaces === 0) {
			firstMove = true;
			return optimalFirstMoveOfGame();
		}
		else {
			// Not the first move on board.
			// return bestPossibleMoveOnBoard(currentGrid, game.player, game.computer, firstMove);

			// Harded the computer to have made the first move. Have to expand to alternate who goes first.
			return bestPossibleMoveOnBoard(currentGrid, game.computer, game.player, true);
			// return bestPossibleMoveOnBoard(currentGrid, game.player, game.computer, true);
		}
	}



};