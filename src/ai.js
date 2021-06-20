import {cellList, copyBoard, turnColor, turnValue, updateBoard} from "./gameState";
import {GREEN} from "./utilities";
import {settings} from "./uiComponents";

var simulBoard = [];

export function greenIsOn() {
    return settings.aiGreen !== 'None';
}

export function blueIsOn() {
    return settings.aiBlue !== 'None';
}

function resetSimulation() {

    for (var i = 0; i < cellList.length; i++) {
        var c = simulBoard[i];
        c.value = cellList[i].value;
    }
}

function boardScore(board) {
    var score = 0;
    for (var i = 0; i < board.length; i++) {
        score += board[i].value;
    }
    return score;
}

function difficultyToNum(diff, numChoices) {

    switch (diff) {
        case 'Easy':
            return Math.round(numChoices * 0.4);
        case 'Medium':
            return Math.round(numChoices * 0.1);
        case 'Hard':
            return 0;
        default:
            throw  'Error: difficulty not found';
    }
}

export function findBestCell() {


    if (simulBoard.length < 1) {
        // create a copy of the game board
        simulBoard = copyBoard(cellList);
    }

    let scoreList = [];

    for (var i = 0; i < cellList.length; i++) {

        var c = cellList[i];

        if (c.aboveThreshold()) {
            continue;
        }

        var score;

        resetSimulation();

        var ended = false;

        // update for many turns
        simulBoard[i].value = turnValue();
        for (var j = 0; j < 20 && !ended; j++) {
            ended = updateBoard(simulBoard);
        }

        if (turnColor === GREEN) score = boardScore(simulBoard);
        else score = -boardScore(simulBoard);

        scoreList.push({score: score, cell: c});

    }

    // sort by descending score
    scoreList.sort((a, b) => b.score - a.score);

    const result = turnColor === GREEN ? difficultyToNum(settings.aiGreen, scoreList.length) : difficultyToNum(settings.aiBlue, scoreList.length);
    return scoreList[result].cell;

}