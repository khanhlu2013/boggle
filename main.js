function WebUiFactory(UI_IDS,game){
	let publicAPI = {};

	let UI = {
		BUTTON_GRID : null,
		RECORDS :document.getElementById(UI_IDS.RECORDS),
		BOARD : document.getElementById(UI_IDS.BOARD),
		CURRENT_WORD : document.getElementById(UI_IDS.CURRENT_WORD),
		SUBMIT_BUTTON : document.getElementById(UI_IDS.SUBMIT_BUTTON),
		TOTAL_SCORE : document.getElementById(UI_IDS.TOTAL_SCORE)
	}

	function boardCharFormat(character){
		if(character === 'q'){
			return 'Qu';
		}else{
			return character.toUpperCase();
		}
	}	

	function bindSubmitClick(){
		UI.SUBMIT_BUTTON.addEventListener('click',function(){
			let currentWord = game.submit();
			if(currentWord != null){
				paintMoves();
				paintCurrentWord();		
				updateRecords(currentWord);
			}
		});
	}

	function bindButtonGridClick(){
		for(let row = 0;row<UI.BUTTON_GRID.length;row++){
			for(let col = 0; col<UI.BUTTON_GRID[row].length;col++){
				let coordinate = new Coordinate(row,col);
				let btn = UI.BUTTON_GRID[row][col];
				btn.addEventListener('click',function(){
					if(game.click(coordinate)){
						paintMoves();
						paintCurrentWord();
					}
				})		
			}
		}
	}

	function updateRecords(currentWord){
		let row = document.createElement('tr');
 		let word = document.createElement('td');
		let score = document.createElement('td');
		row.appendChild(word);
		row.appendChild(score);

		word.innerHTML = currentWord.getDisplayString(function(character){
			return boardCharFormat(character).toLowerCase();
		});
		score.innerHTML = currentWord.getScore();

		UI.RECORDS.appendChild(row);
		UI.TOTAL_SCORE.innerHTML = game.getTotalScore();
	}

	function paintCurrentWord(){	
		let displayString = "";
		let currentWord = game.getCurrentWord();
		if(currentWord != null){
			displayString = currentWord.getDisplayString(function(character){
				return boardCharFormat(character).toUpperCase();
			});
		}
		UI.CURRENT_WORD.innerHTML = " " + displayString;
	}

	function paintMoves(){
		for(let row = 0;row<UI.BUTTON_GRID.length;row++){
			for(let col = 0; col<UI.BUTTON_GRID[row].length;col++){
				let coordinate = new Coordinate(row,col);
				let btn = UI.BUTTON_GRID[row][col];
				let isSelected = game.isCoordinateInMoves(coordinate,game.moves);
				btn.classList.toggle('selected',isSelected);
			}
		}
	}

	function createButtonGrid(){
		let buttonGrid = [];

		for(let row = 0;row<game.board.length;row++){
			let rowEl = document.createElement('div');
			let buttonRow = [];
			buttonGrid.push(buttonRow)

			UI.BOARD.appendChild(rowEl);	

			for(let col = 0; col<game.board[row].length;col++){
				let coordinate = new Coordinate(row,col);
				let btn = document.createElement('input');
				btn.type = 'button';
				btn.classList.add('boardButton');
				btn.value = boardCharFormat(game.getBoardChar(coordinate));
				rowEl.appendChild(btn);	
				buttonRow.push(btn);		
			}
		}	
		UI.BUTTON_GRID = buttonGrid;
	}	

	publicAPI.init = function(){
		createButtonGrid();
		bindButtonGridClick();
		bindSubmitClick();
	}
	return publicAPI;
}

$(document).ready(function(){
	let game = new Game();
	let UI_IDS = {
		RECORDS : 'records',
		BOARD : 'board',
		CURRENT_WORD : 'currentWord',
		SUBMIT_BUTTON : 'submitWord',
		TOTAL_SCORE : 'totalScore'		
	};
	WebUiFactory(UI_IDS,game).init();
});


