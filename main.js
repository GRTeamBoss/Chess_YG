document.onreadystatechange = () => {
    localStorage.setItem("startColor", "white");
    if (document.readyState === "complete") {
        const startColor = localStorage.getItem("startColor");
        new StartGame(startColor).activate();
        new EventListener().activate();
        localStorage.removeItem("startColor");
    }
};

class EventListener {
    constructor() {
        this.game = new Chess();
        this.queue = null;
    }

    activate() {
        document
            .querySelectorAll("." + this.game.classes.cell)
            .forEach((item) => {
                item.addEventListener("click", () => {
                    this.queue = localStorage.getItem("moveColor");
                    if (
                        item.className.match(this.game.classes.cell) !== null &&
                        item.className.match(this.queue) !== null
                    ) {
                        new HandlerUtil().clearDecals();
                        item.classList.remove(this.game.classes.cell);
                        item.classList.add(this.game.classes.hold);
                        this.game.setPossibleMove(item);
                    } else if (
                        item.className.match(this.game.classes.possibleMove) !==
                        null
                    ) {
                        let figure = document.querySelector(
                            "." + this.game.classes.hold
                        );
                        this.game.moveFigure(
                            figure,
                            figure.attributes.id.value,
                            item.attributes.id.value
                        );
                    } else if (
                        item.className.match(this.game.classes.killMove) !==
                        null
                    ) {
                        let figure = document.querySelector(
                            "." + this.game.classes.hold
                        );
                        this.game.moveFigure(
                            figure,
                            figure.attributes.id.value,
                            item.attributes.id.value
                        );
                    }
                });
            });
    }
}

class StartGame {
    constructor(userColor) {
        this.user = {
            name: "user",
            color: userColor,
            side: "bottom",
        };
        this.bot = {
            name: "bot",
            color: userColor === "white" ? "black" : "white",
            side: "top",
        };
    }

    activate() {
        localStorage.setItem("userColor", this.user.color);
        localStorage.setItem("botColor", this.bot.color);
        localStorage.setItem("moveColor", this.user.color);
        localStorage.setItem("currentMove", this.user.name);
        this.fillSide(this.user.side, this.user.color);
        this.fillSide(this.bot.side, this.bot.color);
    }

    fillSide(side, color) {
        const sideColor = {
            black: {
                pawn: "pawn-black",
                rook: "rook-black",
                knights: "knight-black",
                bishop: "bishop-black",
                queen: "queen-black",
                king: "king-black",
            },
            white: {
                pawn: "pawn-white",
                rook: "rook-white",
                knights: "knight-white",
                bishop: "bishop-white",
                queen: "queen-white",
                king: "king-white",
            },
        };

        /* TOP */
        // rook
        let h1 = document.getElementById("cell-1");
        let a1 = document.getElementById("cell-8");
        // knights
        let g1 = document.getElementById("cell-2");
        let b1 = document.getElementById("cell-7");
        // bishop
        let f1 = document.getElementById("cell-3");
        let c1 = document.getElementById("cell-6");
        // queen
        let e1 = document.getElementById("cell-4");
        // king
        let d1 = document.getElementById("cell-5");
        /* END TOP */

        /* BOTTOM */
        // rook
        let h8 = document.getElementById("cell-57");
        let a8 = document.getElementById("cell-64");
        // knights
        let g8 = document.getElementById("cell-58");
        let b8 = document.getElementById("cell-63");
        // bishop
        let f8 = document.getElementById("cell-59");
        let c8 = document.getElementById("cell-62");
        // queen
        let e8 = document.getElementById("cell-60");
        // king
        let d8 = document.getElementById("cell-61");
        /* END BOTTOM*/

        const top = {
            name: "top",
            rook: [h1, a1],
            knights: [g1, b1],
            bishop: [f1, c1],
            queen: e1,
            king: d1,
        };

        const bottom = {
            name: "bottom",
            rook: [h8, a8],
            knights: [g8, b8],
            bishop: [f8, c8],
            queen: e8,
            king: d8,
        };

        switch (side) {
            case top.name:
                for (let item of top.rook) {
                    item.classList.add(sideColor[color].rook);
                }
                for (let item of top.knights) {
                    item.classList.add(sideColor[color].knights);
                }
                for (let item of top.bishop) {
                    item.classList.add(sideColor[color].bishop);
                }
                top.queen.classList.add(sideColor[color].queen);
                top.king.classList.add(sideColor[color].king);
                for (let i = 9; i < 17; i++) {
                    document
                        .getElementById("cell-" + i.toString())
                        .classList.add(sideColor[color].pawn);
                }
                break;
            case bottom.name:
                for (let item of bottom.rook) {
                    item.classList.add(sideColor[color].rook);
                }
                for (let item of bottom.knights) {
                    item.classList.add(sideColor[color].knights);
                }
                for (let item of bottom.bishop) {
                    item.classList.add(sideColor[color].bishop);
                }
                bottom.queen.classList.add(sideColor[color].queen);
                bottom.king.classList.add(sideColor[color].king);
                for (let i = 49; i < 57; i++) {
                    document
                        .getElementById("cell-" + i.toString())
                        .classList.add(sideColor[color].pawn);
                }
                break;
            default:
                break;
        }
    }
}

class Chess {
    constructor() {
        this.position = undefined;
        this.figure = undefined;
        this.queue = undefined;
        this.check = false;
        this.checkMate = false;
        this.colors = {
            user: localStorage.getItem("userColor"),
            bot: localStorage.getItem("botColor")
        }
        this.lines = {
            1: [1, 2, 3, 4, 5, 6, 7, 8],
            2: [9, 10, 11, 12, 13, 14, 15, 16],
            3: [17, 18, 19, 20, 21, 22, 23, 24],
            4: [25, 26, 27, 28, 29, 30, 31, 32],
            5: [33, 34, 35, 36, 37, 38, 39, 40],
            6: [41, 42, 43, 44, 45, 46, 47, 48],
            7: [49, 50, 51, 52, 53, 54, 55, 56],
            8: [57, 58, 59, 60, 61, 62, 63, 64],
        };
        this.positions = {
            1: "rook-" + this.colors.bot,
            2: "knight-" + this.colors.bot,
            3: "bishop-" + this.colors.bot,
            4: "queen-" + this.colors.bot,
            5: "king-" + this.colors.bot,
            6: "bishop-" + this.colors.bot,
            7: "knight-" + this.colors.bot,
            8: "rook-" + this.colors.bot,
            9: "pawn-" + this.colors.bot,
            10: "pawn-" + this.colors.bot,
            11: "pawn-" + this.colors.bot,
            12: "pawn-" + this.colors.bot,
            13: "pawn-" + this.colors.bot,
            14: "pawn-" + this.colors.bot,
            15: "pawn-" + this.colors.bot,
            16: "pawn-" + this.colors.bot,
            17: null,
            18: null,
            19: null,
            20: null,
            21: null,
            22: null,
            23: null,
            24: null,
            25: null,
            26: null,
            27: null,
            28: null,
            29: null,
            30: null,
            31: null,
            32: null,
            33: null,
            34: null,
            35: null,
            36: null,
            37: null,
            38: null,
            39: null,
            40: null,
            41: null,
            42: null,
            43: null,
            44: null,
            45: null,
            46: null,
            47: null,
            48: null,
            49: "pawn-" + this.colors.user,
            50: "pawn-" + this.colors.user,
            51: "pawn-" + this.colors.user,
            52: "pawn-" + this.colors.user,
            53: "pawn-" + this.colors.user,
            54: "pawn-" + this.colors.user,
            55: "pawn-" + this.colors.user,
            56: "pawn-" + this.colors.user,
            57: "rook-" + this.colors.user,
            58: "knight-" + this.colors.user,
            59: "bishop-" + this.colors.user,
            60: "queen-" + this.colors.user,
            61: "king-" + this.colors.user,
            62: "bishop-" + this.colors.user,
            63: "knight-" + this.colors.user,
            64: "rook-" + this.colors.user,
        };
        this.user = {
            name: "user",
            color: localStorage.getItem("userColor"),
            side: "bottom",
            kill: 0,
        };
        this.bot = {
            name: "bot",
            color: localStorage.getItem("botColor"),
            side: "top",
            kill: 0,
        };
        this.classes = {
            cell: "cell",
            hold: "hold",
            possibleMove: "possible-move",
            wrongMove: "wrong-move",
            killMove: "kill-move",
            chekMove: "check-move",
            checkMateMove: "checkmate-move",
        };
        this.figures = {
            pawn: "pawn",
            rook: "rook",
            bishop: "bishop",
            knight: "knight",
            king: "king",
            queen: "queen",
        };
    }

    moveFigure(figure, from, to) {
        let cellTo = undefined;
        this.queue = new HandlerUtil().whoQueue();
        let figureId = figure.attributes.id.value.split("-")[1];
        let fromId = from.split("-")[1];
        let toId = to.split("-")[1];
        let figureClassName = this.positions[figureId];
        let figureName = figureClassName.split("-")[0];
        let figureColor = figureClassName.split("-")[1];
        let cellFrom = document.getElementById(from);
        if (this.queue.color === figureColor && this.checkMove(to)) {
            cellTo = document.getElementById(to);
            cellFrom.classList.remove(figureClassName);
            cellFrom.classList.remove(this.classes.hold);
            cellFrom.classList.add(this.classes.cell);
            if (this.positions[toId] !== null) {
                this.eatFigure(from, to);
                cellTo.classList.remove(this.positions[toId]);
            }
            cellTo.classList.add(figureClassName);
            this.positions[toId] = this.positions[fromId];
            this.positions[fromId] = null;
            new HandlerUtil().toggleQueue();
            new HandlerUtil().clearDecals();
        } else {
            this.setCellClass(to, this.classes.wrongMove);
            new HandlerUtil().clearDecals();
        }
    }

    checkMove(pos) {
        let possibleCell = document
            .getElementById(pos)
            .className.match(this.classes.possibleMove);
        let killCell = document
            .getElementById(pos)
            .className.match(this.classes.killMove);
        return possibleCell !== null || killCell != null;
    }

    setPossibleMove(figure) {
        let tmp = undefined,
            pos = figure.attributes.id.value.split("-")[1];
        this.queue = new HandlerUtil().whoQueue();
        tmp = this.positions[pos].split("-")[0];
        console.log("Set Possible Move");
        console.log(pos, this.queue, tmp);
        switch (tmp) {
            case this.figures.pawn:
                this.analyzePawnMove(pos);
                break;
            case this.figures.rook:
                this.analyzeRookMove(pos);
                break;
            case this.figures.knight:
                this.analyzeKnightMove(pos);
                break;
            case this.figures.bishop:
                this.analyzeBishopMove(pos);
                break;
            case this.figures.queen:
                this.analyzeQueenMove(pos);
                break;
            case this.figures.king:
                this.analyzeKingMove(pos);
                break;
            default:
                break;
        }
    }

    eatFigure(murder, meal) {
        let mealId = meal.split("-")[1];
        let count = null;
        if (this.queue === this.user.color) {
            count = this.user.kill;
            this.user.kill += 1;
        } else {
            count = this.bot.kill;
            this.bot.kill += 1;
        }
        let cell = document.getElementById(
            this.queue + "-eat-" + (count + 1).toString()
        );
        cell.classList.add(this.position[mealId]);
    }

    analyzePawnMove(pos) {
        let firstPosition = null,
            secondPosition = null,
            nextPosition = null,
            positionsMove = null,
            k = null,
            n = null;
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let posInt = parseInt(pos);
        let indexOfLine = this.lines[line].indexOf(posInt);
        switch (this.queue.color) {
            case this.user.color:
                k = -1;
                n = -2;
                break;
            case this.bot.color:
                k = 1;
                n = 2;
                break;
            default:
                break;
        }
        firstPosition =
            this.lines[(lineInt + k).toString()][indexOfLine].toString();
        secondPosition =
            this.lines[(lineInt + n).toString()][indexOfLine].toString();
        nextPosition =
            this.lines[(lineInt + k).toString()][indexOfLine].toString();
        positionsMove = [firstPosition, secondPosition];
        if (lineInt === 7 && this.queue.color === this.user.color || lineInt === 2 && this.queue.color === this.bot.color) {
            if (this.positions[firstPosition] === null) {
                for (let item of positionsMove) {
                    if (this.checkCellToPossibleMove(item)) {
                        console.log("Set Cell To Possible Move");
                        this.setCellToPossibleMove(item);
                    }
                }
            }
        } else if (lineInt < 7 && lineInt > 1 && this.queue.color === this.user.color || lineInt > 2 && lineInt < 8 && this.queue.color === this.bot.color) {
            if (this.positions[nextPosition] === null) {
                this.setCellToPossibleMove(nextPosition);
            }
        }
    }

    analyzeRookMove(pos) {
        const lines = [1,2,3,4,5,6,7,8];
        let posInt = parseInt(pos);
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        let lineArr = this.lines[line];
        let upMove = lines.slice(0, lineInt-1);
        let downMove = lines.slice(lineInt-1);
        let leftMove = lineArr.slice(0, breakpoint).reverse();
        let rightMove = lineArr.slice(breakpoint + 1);
        for (let item of upMove) {
            let nextPosition = this.lines[item.toString()][indexOfLine].toString();
            if (this.checkCellToPossibleMove(nextPosition)) {
                this.setCellToPossibleMove(nextPosition);
            } else {
                break;
            }
        }
        for (let item of downMove) {
            let nextPosition = this.lines[item.toString()][indexOfLine].toString();
            if (this.checkCellToPossibleMove(nextPosition)) {
                this.setCellToPossibleMove(nextPosition);
            } else {
                break;
            }
        }
        for (let item of leftMove) {
            if (this.checkCellToPossibleMove(item.toString())) {
                this.setCellToPossibleMove(item.toString());
            } else {
                break;
            }
        }
        for (let item of rightMove) {
            if (this.checkCellToPossibleMove(item.toString())) {
                this.setCellToPossibleMove(item.toString());
            } else {
                break;
            }
        }
    }

    analyzeKnightMove(pos) {
        let movePos = [
                [-2, -1],
                [-2, 1],
                [-1, -2],
                [-1, 2],
                [1, -2],
                [1, 2],
                [2, -1],
                [2, 1],
            ],
            moveArr = [];
        let posInt = parseInt(pos);
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        for (let i = 0; i < 8; i++) {
            let nextLine = lineInt + movePos[i][0];
            let nextPos = indexOfLine + movePos[i][1];
            if (nextLine > 0 && nextLine < 9 && nextPos > -1 && nextPos < 8) {
                let nextPosition = this.lines[nextLine.toString()][nextPos];
                moveArr.push(nextPosition.toString());
            } else {
                moveArr.push(0);
            }
        }
        for (let item of moveArr) {
            if (parseInt(item) > 0 && this.checkCellToPossibleMove(item)) {
                this.setCellToPossibleMove(item);
            }
        }
    }

    analyzeBishopMove(pos) {
        let posInt = parseInt(pos);
        let movePos = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
        ];
        let moveArr = [[], [], [], []];
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        for (let i = 0; i < 4; i++) {
            moveArr[i] = this.getMoveArr(movePos, lineInt, indexOfLine, i);
        }
        for (let arr of moveArr) {
            for (let item of arr) {
                if (item > 0 && this.checkCellToPossibleMove(item.toString())) {
                    this.setCellToPossibleMove(item.toString());
                }
            }
        }
    }

    analyzeQueenMove(pos) {
        let posInt = parseInt(pos);
        let movePos = [
            [-1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, -1],
        ];
        let moveArr = [[], [], [], [], [], [], [], []];
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        for (let i = 0; i < 8; i++) {
            moveArr[i] = this.getMoveArr(movePos, lineInt, indexOfLine, i);
        }
        for (let arr of moveArr) {
            for (let item of arr) {
                if (item > 0 && this.checkCellToPossibleMove(item.toString())) {
                    this.setCellToPossibleMove(item.toString());
                }
            }
        }
    }

    analyzeKingMove(pos) {
        let posInt = parseInt(pos);
        let movePos = [
            [-1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, -1],
        ];
        let moveArr = [];
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        for (let i = 0; i < 8; i++) {
            let nextLine = lineInt + movePos[i][0];
            let nextPos = indexOfLine + movePos[i][1];
            if (nextLine > 0 && nextLine < 9 && nextPos > -1 && nextPos < 9) {
                moveArr.push(this.lines[nextLine.toString()][nextPos]);
            } else {
                moveArr.push(0);
            }
        }
        for (let item of moveArr) {
            if (item > 0 && this.checkCellToPossibleMove(item.toString())) {
                this.setCellToPossibleMove(item.toString());
            }
        }
    }

    analyzePawnEat(pos) {
        let movePos = null;
        switch (this.queue.color) {
            case this.user.color:
                movePos = [
                    [-1, -1],
                    [-1, 1],
                ];
            case this.bot.color:
                movePos = [
                    [1, -1],
                    [1, 1],
                ];
            default:
                break;
        }
        let className = "pawn-" + this.queue.color;
        const pawns = document.getElementsByClassName(className);
        for (let pawn of pawns) {
            let pawnPos = pawn.attributes.id.value.split("-")[1];
            let pawnLine = this.getLine(pawnPos);
            let pawnIndex = this.lines[pawnLine].indexOf(parseInt(pawnPos));
            for (let item of movePos) {
                posEat =
                    this.lines[(parseInt(pawnLine) + item[0]).toString()][
                        pawnIndex + item[1]
                    ].toString();
                if (this.checkCellToEat(posEat) && posEat === pos) {
                    this.setCellToEat(eatPos);
                }
            }
        }
    }

    analyzeRookEat(pos) {
        let movePos = [
            [-1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
        ];
        let className = "rook-" + this.queue.color;
        const rooks = document.getElementsByClassName(className);
        for (let rook of rooks) {
            let rookPos = rook.attributes.id.value.split("-")[1];
            let rookLine = this.getLine(rookPos);
            let rookIndex = this.lines[rookLine].indexOf(parseInt(rookPos));
            for (let i = 0; i < 4; i++) {
                for (let j = 1; j < 8; j++) {
                    let eatPos =
                        this.lines[
                            (parseInt(rookLine) + movePos[i][0] * j).toString()
                        ][rookIndex + movePos[i][1] * j].toString();
                    if (this.checkCellToEat(eatPos) && eatPos === pos) {
                        this.setCellToEat(eatPos);
                    }
                }
            }
        }
    }

    analyzeKnightEat(pos) {
        let movePos = [
            [-2, -1],
            [-2, 1],
            [-1, 2],
            [1, 2],
            [2, 1],
            [2, -1],
            [1, -2],
            [-1, -2],
        ];
        let className = "knight-" + this.queue.color;
        const knights = document.getElementsByClassName(className);
        for (let knight of knights) {
            let knightPos = knight.attributes.id.value.split("-")[1];
            let knightLine = this.getLine(knightPos);
            let knightIndex = this.lines[knightLine].indexOf(
                parseInt(knightPos)
            );
            for (let item of movePos) {
                let eatPos =
                    this.lines[(parseInt(knightLine) + item[0]).toString()][
                        knightIndex + item[1]
                    ].toString();
                if (this.checkCellToEat(eatPos) && eatPos === pos) {
                    this.setCellToEat(eatPos);
                }
            }
        }
    }

    analyzeBishopEat(pos) {
        let movePos = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];
        let className = "bishop-" + this.queue.color;
        const bishops = document.getElementsByClassName(className);
        for (let bishop of bishops) {
            let bishopPos = bishop.attributes.id.value.split("-")[1];
            let bishopLine = this.getLine(bishopPos);
            let bishopIndex = this.lines[bishopLine].indexOf(
                parseInt(bishopPos)
            );
            for (let i = 0; i < 4; i++) {
                for (let j = 1; j < 8; i++) {
                    let eatPos =
                        this.lines[
                            (
                                parseInt(bishopLine) +
                                movePos[i][0] * j
                            ).toString()
                        ][bishopIndex + movePos[i][1] * j].toString();
                    if (this.checkCellToEat(eatPos) && eatPos === pos) {
                        this.setCellToEat(eatPos);
                    }
                }
            }
        }
    }

    analyzeQueenEat(pos) {
        let movePos = [
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
            [-1, -1],
            [0, -1],
            [1, 1],
        ];
        let className = "queen-" + this.queue.color;
        const queens = document.getElementsByClassName(className);
        for (let queen of queens) {
            let queenPos = queen.attributes.id.value.split("-")[1];
            let queenLine = this.getLine(queenPos);
            let queenIndex = this.lines[queenLine].indexOf(parseInt(queenPos));
            for (let i = 0; i < 8; i++) {
                for (let j = 1; j < 8; i++) {
                    let eatPos =
                        this.lines[
                            (parseInt(queenLine) + movePos[i][0] * j).toString()
                        ][queenIndex + movePos[i][1] * j].toString();
                    if (this.checkCellToEat(eatPos) && eatPos === pos) {
                        this.setCellToEat(eatPos);
                    }
                }
            }
        }
    }

    analyzeKingEat(pos) {
        let movePos = [
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
            [-1, -1],
            [0, -1],
            [1, 1],
        ];
        let className = "king-" + this.queue.color;
        const king = document.getElementsByClassName(className)[0];
        let kingPos = king.attributes.id.value.split("-")[1];
        let kingLine = this.getLine(kingPos);
        let kingIndex = this.lines[kingLine].indexOf(parseInt(kingPos));
        for (let item of movePos) {
            eatPos =
                this.lines[(parseInt(kingLine) + item[0]).toString()][
                    kingIndex + item[1]
                ].toString();
            if (this.checkCellToEat(eatPos) && eatPos === pos) {
                this.setCellToEat(eatPos);
            }
        }
    }

    getMoveArr(movePos, lineInt, indexOfLine, i) {
        let moveArr = [];
        for (let j = 1; j < 8; j++) {
            let nextLine = lineInt + movePos[i][0] * j;
            let nextPos = indexOfLine + movePos[i][1] * j;
            if (nextLine > 0 && nextLine < 9 && nextPos > -1 && nextPos < 8) {
                let nextMove = this.lines[nextLine.toString()][nextPos];
                moveArr.push(nextMove);
                if (this.positions[nextMove.toString()] !== null) {
                    break;
                }
            } else {
                moveArr.push(0);
            }
        }
        return moveArr;
    }

    getLine(pos) {
        let posInt = parseInt(pos);
        let condition = posInt / 8 > parseInt(posInt / 8);
        let line = null;
        if (condition) {
            line = parseInt(posInt / 8) + 1;
        } else {
            line = parseInt(posInt / 8);
        }
        return line.toString();
    }

    possibleChangeFigure() {}

    isCheck() {}

    isCheckMate() {}

    setCellClass(pos, className) {
        let cell = document.getElementById(pos);
        cell.classList.remove(this.classes.cell);
        cell.classList.add(className);
        setTimeout(() => {
            this.deleteCellClass(pos, className);
        }, 1000);
    }

    deleteCellClass(pos, className) {
        let cell = document.getElementById(pos);
        cell.classList.remove(className);
        cell.classList.add(this.classes.cell);
    }

    checkCellToPossibleMove(pos) {
        let cell = document.getElementById("cell-" + pos).className;
        if (cell === null) {
            return false;
        } else {
            return (
                cell.match(this.classes.cell) !== null &&
                cell.match(this.queue.color) === null
            );
        }
    }

    checkCellToEat(pos) {
        let cell = document.getElementById("cell-" + pos).className;
        if (cell === null) {
            return false;
        } else {
            return (
                cell.match(this.classes.cell) !== null &&
                cell.match(this.queueNegative) !== null
            );
        }
    }

    setCellToPossibleMove(pos) {
        let cell = document.getElementById(this.classes.cell + "-" + pos);
        cell.classList.remove(this.classes.cell);
        cell.classList.add(this.classes.possibleMove);
    }

    setCellToEat(pos) {
        let cell = document.getElementById(this.classes.cell + "-" + pos);
        cell.classList.remove(this.classes.cell);
        cell.classList.add(this.classes.killMove);
    }

    pushHistory(content) {
        let historyBlock = document.getElementById("history");
        let newElement = document.createElement("p");
        let newContent = document.createTextNode(content);
        newElement.appendChild(newContent);
        historyBlock.appendChild(newElement);
    }
}


class HandlerUtil {
    constructor() {
        this.chess = new Chess();
    }

    whoQueue() {
        return {
            who: localStorage.getItem("currentMove"),
            color: localStorage.getItem("moveColor")
        }
    }

    toggleQueue() {
        let queue = this.whoQueue();
        let userColor = localStorage.getItem("userColor");
        let botColor = localStorage.getItem("botColor");
        switch (queue.color) {
            case userColor:
                localStorage.setItem("currentMove", "bot");
                localStorage.setItem("moveColor", botColor);
                break;
            case botColor:
                localStorage.setItem("currentMove", "user");
                localStorage.setItem("moveColor", userColor);
                break;
            default:
                break;
        }
    }

    parseColors() {
        let userColor = localStorage.getItem("userColor");
        let botColor = localStorage.getItem("botColor");
        return {
            user: userColor,
            bot: botColor,
        };
    }

    clearDecals() {
        document
            .querySelectorAll("." + this.chess.classes.hold)
            .forEach((item) => {
                item.classList.remove(this.chess.classes.hold);
                item.classList.add(this.chess.classes.cell);
            });
        document
            .querySelectorAll("." + this.chess.classes.possibleMove)
            .forEach((item) => {
                item.classList.remove(this.chess.classes.possibleMove);
                item.classList.add(this.chess.classes.cell);
            });
        document
            .querySelectorAll("." + this.chess.classes.killMove)
            .forEach((item) => {
                item.classList.remove(this.chess.classes.killMove);
                item.classList.add(this.chess.classes.cell);
            });
    }
}
