"use strict";

let successSound = new Audio("audios/success.mp3");
successSound.volume = 0.5; // 50%

let failSound = new Audio("audios/fail.mp3");
failSound.volume = 0.5; // 50%

// effect duration
let duration = 1000;

let startBtn = document.querySelector(".control-btns form .footer.start-btn");

let controlBtns = document.querySelector(".control-btns");

let inputPlayer1 = document.querySelector(
	".control-btns form .body .input-player1",
);
let inputPlayer2 = document.querySelector(
	".control-btns form .body .input-player2",
);

let currentTurnSpan = document.querySelector(".current-turn");

let namePlayer1 = document.querySelector(".info-container .name-player1");
let namePlayer2 = document.querySelector(".info-container .name-player2");

startBtn.addEventListener("click", () => {
	startBtn.classList.add("clicking");

	currentTurnSpan.textContent = `${inputPlayer1.value || "Player 1"}'s Turn`;
	currentTurnSpan.style.color = "#2196f3";

	namePlayer1.innerHTML = `${inputPlayer1.value || "Player 1"} matched: `;

	namePlayer2.innerHTML = `${inputPlayer2.value || "Player 2"} matched: `;

	controlBtns.remove();
});

// if 1: the blue turn, if 2: the red turn
let currentTurn = 1;

function changeTurn() {
	// this func will be used in checkMatchedBlocks

	let blocksFaces = Array.from(
		document.querySelectorAll(".blocks-container .block:not(.has-match) .face"),
	);

	currentTurn = currentTurn === 1 ? 2 : 1;

	currentTurnSpan.textContent =
		currentTurn === 1
			? `${inputPlayer1.value || "Player 1"}'s Turn`
			: `${inputPlayer2.value || "Player 2"}'s Turn`;

	let color = currentTurn === 1 ? "#2196f3" : "#ff2c07";

	currentTurnSpan.style.color = color;

	blocksFaces.forEach((face) => {
		face.style.border = `5px solid ${color}`;
	});
}

let blocksContainer = document.querySelector(".blocks-container");

let blocks = Array.from(blocksContainer.children);

let orderRange = blocks.map((el, ind) => ind);

function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		let random = Math.floor(Math.random() * (i + 1));

		[arr[i], arr[random]] = [arr[random], arr[i]];
	}

	return arr;
}

shuffle(orderRange);

blocks.forEach((block, index) => {
	block.style.order = orderRange[index];

	block.addEventListener("click", () => {
		if (!block.classList.contains("has-match")) {
			flipBlock(block);
		}
	});
});

function flipBlock(selectedBlock) {
	//this func is used when user click on any block
	selectedBlock.classList.add("is-flipped");

	let allFlippedBlocks = blocks.filter((block) =>
		block.classList.contains("is-flipped"),
	);

	if (allFlippedBlocks.length === 2) {
		stopClicking();
		checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
	}
}

function stopClicking() {
	//this func is used in flipBlock
	blocksContainer.classList.add("no-clicking");

	setTimeout(() => {
		blocksContainer.classList.remove("no-clicking");
	}, duration);
}

let winsPlayer1 = document.querySelector(".info-container .wins-player1");
let winsPlayer2 = document.querySelector(".info-container .wins-player2");

function checkMatchedBlocks(firstBlock, secBlock) {
	//this func is used in flipBlock
	if (firstBlock.dataset.img === secBlock.dataset.img) {
		successSound.currentTime = 0;
		successSound.play();

		firstBlock.classList.remove("is-flipped");
		secBlock.classList.remove("is-flipped");

		firstBlock.classList.add("has-match");
		secBlock.classList.add("has-match");

		if (currentTurn === 1) {
			winsPlayer1.innerHTML = parseInt(winsPlayer1.innerHTML) + 1;
		} else {
			winsPlayer2.innerHTML = parseInt(winsPlayer2.innerHTML) + 1;
		}

		let hasMatchBlocks = blocks.filter((el) =>
			el.classList.contains("has-match"),
		);

		if (hasMatchBlocks.length === blocks.length) {
			checkTheWinner();
		}
	} else {
		failSound.currentTime = 0;
		failSound.play();

		setTimeout(() => {
			firstBlock.classList.remove("is-flipped");
			secBlock.classList.remove("is-flipped");
			changeTurn();
		}, duration);
	}
}

let endGameWindow = document.querySelector(".end-game");
let winnerNameSpan = document.querySelector(".end-game .winner-name");
let playAgainBtn = document.querySelector(".end-game .play-again-btn");

function checkTheWinner() {
	//this func is used in checkMatchedBlocks
	endGameWindow.style.display = "flex";

	let scorePlayer1 = parseInt(winsPlayer1.innerHTML);
	let scorePlayer2 = parseInt(winsPlayer2.innerHTML);

	if (scorePlayer1 > scorePlayer2) {
		winnerNameSpan.innerHTML = `${inputPlayer1.value || "Player 1"} is the winner`;
		winnerNameSpan.style.color = "#2196f3";
	} else if (scorePlayer2 > scorePlayer1) {
		winnerNameSpan.innerHTML = `${inputPlayer2.value || "Player 2"} is the winner`;
		winnerNameSpan.style.color = "#ff2c07";
	} else {
		winnerNameSpan.innerHTML = `Draw`;
	}
}

playAgainBtn.addEventListener("click", () => {
	location.reload();
});
