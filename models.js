function Coordinate(x,y){
	this.x = x;
	this.y = y;
}

function Word(word){
	this.data = word;//word is an array of character
}

Word.prototype.getDisplayString = function(formatFn){
	return this.data.map(formatFn).join("");
}

Word.prototype.getScore = function(){
	let len = this.data.length;

	switch(len) {
		case 0:
	    case 1:
	    case 2:
	    	return 0;
	    case 3:
	    case 4:
	        return 1;
	    case 5:
	    	return 2;
	    case 6:
	    	return 3;
	    case 7:
	    	return 5;
	    case 8:
	    	return 11;	    		    		    	
	    default:
	        return 11;
	}
}

function Game(){
	this.board = boardFactory().create();	//an array of string, used to display the board's face
	this.moves = [];	//a stack of Coordinate object, used to store current word
	this.records = [];	//an array of Word.
}

Game.prototype.getTotalScore = function(){
	let total = 0;
	for(let record of this.records){
		total += record.getScore();
	}
	return total;
}

Game.prototype.getLastMove = function(){
	if(this.moves.length != 0){
		return this.moves[this.moves.length-1];
	}
}

Game.prototype.getBoardChar = function(coordinate){
	return this.board[coordinate.x][coordinate.y];
}

Game.prototype.getBoardChar = function(coordinate){
	return this.board[coordinate.x][coordinate.y];
}

Game.prototype.getCurrentWord = function(){
	let currentWord = null;
	if(this.moves.length !=0){
		let data = this.moves.map((move) => {
			return this.getBoardChar(move);
		});
		currentWord = new Word(data);
	}
	return currentWord;
}

Game.prototype.submit = function(){
	let currentWord = this.getCurrentWord();
	if (currentWord == null) return null;

	let isDuplicate = false;
	for(let record of this.records){
		if(currentWord.data.join("") == record.data.join("")){
			isDuplicate = true;
			break;
		}
	}
	if(isDuplicate){
		currentWord = null;
	}else{
		this.records.push(currentWord);
		this.moves = [];
	}	
	return currentWord;
}

Game.prototype._getAdjacents = function(coordinate){
	let results = [];
	let boardDimention = this.board.length-1;

	//N
	if(coordinate.x != 0){
		results.push(new Coordinate(coordinate.x-1,coordinate.y));
	}	
	//S
	if(coordinate.x != boardDimention){
		results.push(new Coordinate(coordinate.x+1,coordinate.y));
	}		
	//E
	if(coordinate.y != 0){
		results.push(new Coordinate(coordinate.x,coordinate.y-1));
	}	
	//W
	if(coordinate.y != boardDimention){
		results.push(new Coordinate(coordinate.x,coordinate.y+1));
	}	

	//NW
	if(coordinate.x != 0 && coordinate.y != 0){
		results.push(new Coordinate(coordinate.x-1,coordinate.y-1));
	}	
	//NE
	if(coordinate.x != 0 && coordinate.y != boardDimention){
		results.push(new Coordinate(coordinate.x-1,coordinate.y+1));
	}	
	//SW
	if(coordinate.x != boardDimention && coordinate.y != 0){
		results.push(new Coordinate(coordinate.x+1,coordinate.y-1));
	}	
	//SE
	if(coordinate.x != boardDimention && coordinate.y != boardDimention){
		results.push(new Coordinate(coordinate.x+1,coordinate.y+1));
	}	

	return results;
}

Game.prototype.isCoordinateInMoves = function(coordinate,moves){
	for(let move of moves){
		if(
			(coordinate.x == move.x)  
			&&
			(coordinate.y == move.y)
		){
			return true;
		}			
	}
	return false;
}

Game.prototype._getLegalMoves = function(){
	let lastMove = this.getLastMove();
	let adjacents = this._getAdjacents(lastMove);
	let legalMoves = adjacents.filter((adjacent) =>{
		return !this.isCoordinateInMoves(adjacent,this.moves);
	})
	return legalMoves;
}

Game.prototype._isLegalMove = function(coordinate){
	let legalMoves = this._getLegalMoves();
	return this.isCoordinateInMoves(coordinate,legalMoves);
}

Game.prototype.click = function(coordinate){
	let lastMove = this.getLastMove();
	if(this.getLastMove() === undefined){
		this.moves.push(coordinate);
		return true;
	}
	else if(lastMove.x == coordinate.x && lastMove.y == coordinate.y){
		this.moves.pop();
		return true;
	}
	else if(this._isLegalMove(coordinate)){
		this.moves.push(coordinate);
		return true;
	}
	else{
		return false;
	}
}

function boardFactory(){
	let publicAPI = {};	
	let DIE_SIDE = 6;
	let DICE =
	[
		//copyed from instruction
		"aaafrs",
		"aaeeee",
		"aafirs",
		"adennn",
		"aeeeem",
		"aeegmu",
		"aegmnn",
		"afirsy",
		"bjkqxz",
		"ccenst",
		"ceiilt",
		"ceilpt",
		"ceipst",
		"ddhnot",
		"dhhlor",
		"dhlnor",
		"dhlnor",
		"eiiitt",
		"emottt",
		"ensssu",
		"fiprsy",
		"gorrvw",
		"iprrry",
		"nootuw",
		"ooottu",
	];
	
	function randomIntFromInterval(min,max)
	{
		//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	function shuffleArray(array) {
		//code copy from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}	

	function assertDimension(dimension){
		if(dimension % 1 !== 0){
			raise("Error: dimension must be perfect square")
		}			
	}

	function shuffleDice(dice){
		shuffleArray(dice)
	}

	function getDimension(dice){
		return Math.sqrt(dice.length);
	}

	function shuffleDie(dice){
		let faces = dice.map(function(die){
			let randomIndex = randomIntFromInterval(0,DIE_SIDE-1);
			return die[randomIndex];
		})
		return faces;
	}

	function formBoard(faces,dimension){
		let board = [];
		for(let i = 0; i < dimension; i++){
			let row = "";
			for(let j = 0; j< dimension; j++){
				row += faces[i*(dimension-1) + j];
			}
			board.push(row);
		}
		return board;
	}

	publicAPI.create = function(){
		let dimension = getDimension(DICE);
		assertDimension(dimension);
		shuffleDice(DICE);
		let faces = shuffleDie(DICE);
		let board = formBoard(faces,dimension);
		return board;
	}

	return publicAPI;
}