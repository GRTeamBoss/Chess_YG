document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        new StartGame("white").activate();
        new EventListener(new Chess()).activate();
    }
}
class Chess {
    constructor() {
        this.current = null;
        this.figure = null;
        this.queue = null;
        this.queueNegative = null;
        this.check = false;
        this.checkMate = false;
        this.allowedMove = [];
        this.history = [];
        this.colors = new HandlerUtil().parseColors();
        this.lines = {
            1 : [1, 2, 3, 4, 5, 6, 7, 8],
            2 : [9, 10, 11, 12, 13, 14, 15, 16],
            3 : [17, 18, 19, 20, 21, 22, 23, 24],
            4 : [25, 26, 27, 28, 29, 30, 31, 32],
            5 : [33, 34, 35, 36, 37, 38, 39, 40],
            6 : [41, 42, 43, 44, 45, 46, 47, 48],
            7 : [49, 50, 51, 52, 53, 54, 55, 56],
            8 : [57, 58, 59, 60, 61, 62, 63, 64]
        };
        this.position = {
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
            17: null, 18: null, 19: null, 20: null, 21: null, 22: null, 23: null, 24: null,
            25: null, 26: null, 27: null, 28: null, 29: null, 30: null, 31: null, 32: null,
            33: null, 34: null, 35: null, 36: null, 37: null, 38: null, 39: null, 40: null,
            41: null, 42: null, 43: null, 44: null, 45: null, 46: null, 47: null, 48: null,
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
            side : "bottom",
            color : this.colors.user,
            kill : 0
        };
        this.bot = {
            side : "top",
            color : this.colors.bot,
            kill : 0
        };
        this.classes = {
            cell : 'cell',
            possibleMove : 'possible-move',
            wrongMove : 'wrong-move',
            hold : 'hold',
            arrowUp : 'arrow-up',
            arrowDown : 'arrow-down',
            arrowLeft : 'arrow-left',
            arrowRight : 'arrow-right',
            arrowKill : 'arrow-kill',
            crosshairMove : 'crosshair-move',
            crosshairKill : 'crosshair-kill',
            killMove : 'kill-move'
        };
        this.figures = {
            pawn : 'pawn',
            rook : 'rook',
            bishop : 'bishop',
            knight : 'knight',
            king : 'king',
            queen : 'queen'
        }
    }

    moveFigure(figure, from, to)
    {
        let className = figure.className.split(' ')[0];
        let color = className.split("-")[1];
        let fromInteger = from.split('-')[1];
        let toInteger = to.split('-')[1];
        let historyResult = "[move] " + from + " -> " + to;
        this.history.push(historyResult);
        this.pushHistory(historyResult);
        this.queue = new HandlerUtil().whoQueue();
        if (this.queue === color && this.checkMove(to))
        {
            let cellFrom = document.getElementById(from);
            let cellTo = document.getElementById(to);
            cellFrom.classList.remove(className);
            cellFrom.classList.remove(this.classes.hold);
            cellFrom.classList.add(this.classes.cell);
            if (this.position[toInteger] !== null)
            {
                this.eatFigure(from, to);
                cellTo.classList.remove(this.position[toInteger]);
            }
            cellTo.classList.add(className);
            this.position[toInteger] = this.position[fromInteger];
            this.position[fromInteger] = null;
            new HandlerUtil().toggleQueue();
            new HandlerUtil().clearDecals();
        } else
        {
            this.setPositionClass(to, this.classes.wrongMove);
            new HandlerUtil().clearDecals();
        }
    }

    pushHistory(content) {
        let historyBlock = document.getElementById('history');
        let newElement = document.createElement('p');
        let newContent = document.createTextNode(content);
        newElement.appendChild(newContent);
        historyBlock.appendChild(newElement);
    }

    checkMove(pos)
    {
        let possibleCell = document.getElementById(pos).className.match(this.classes.possibleMove);
        let killCell = document.getElementById(pos).className.match(this.classes.killMove);
        return possibleCell !== null || killCell != null;
    }

    setPositionClass(pos, className)
    {
        let cell = document.getElementById(pos);
        cell.classList.remove(this.classes.cell);
        cell.classList.add(className);
        setTimeout(() =>
        {
            this.deletePositionClass(pos, className);
        }, 1000);
    }

    deletePositionClass(pos, className)
    {
        let cell = document.getElementById(pos);
        cell.classList.remove(className);
        cell.classList.add(this.classes.cell);
    }

    possibleMove(figure)
    {
        this.queue = new HandlerUtil().whoQueue();
        this.queueNegative = this.queue === "white" ? "black" : "white";
        let id = figure.attributes.id.value;
        let pos = id.split('-')[1];
        this.figure = this.position[pos].split("-")[0];
        this.current = pos;
        switch (this.figure) {
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

    analyzePawnMove(pos) {
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let posInt = parseInt(pos);
        let indexOfLine = this.lines[line].indexOf(posInt);
        if (lineInt === 7 && this.queue === this.user.color)
        {
            let firstPosition = this.lines[(lineInt-1).toString()][indexOfLine].toString();
            let secondPosition = this.lines[(lineInt-2).toString()][indexOfLine].toString();
            let leftPosition = this.lines[(lineInt-1).toString()][indexOfLine-1].toString();
            let rightPosition = this.lines[(lineInt-1).toString()][indexOfLine+1].toString();
            let positionsMove = [firstPosition, secondPosition];
            let positionsKill = [leftPosition, rightPosition];
            if (this.position[firstPosition] === null)
            {
                for (let item of positionsMove)
                {
                    if (this.checkCellToPossibleMove(item))
                    {
                        this.setCellToPossibleMove(item);
                    }
                }
            }
            for (let item of positionsKill)
            {
                if (this.checkCellToEat(item))
                {
                    this.setCellToEat(item);
                }
            }
        } else if (lineInt === 2 && this.queue === this.bot.color)
        {
            let firstPosition = this.lines[(lineInt+1).toString()][indexOfLine].toString();
            let secondPosition = this.lines[(lineInt+2).toString()][indexOfLine].toString();
            let leftPosition = this.lines[(lineInt+1).toString()][indexOfLine-1].toString();
            let rightPosition = this.lines[(lineInt+1).toString()][indexOfLine+1].toString();
            let positionsMove = [firstPosition, secondPosition];
            let positionsKill = [leftPosition, rightPosition];
            if (this.position[firstPosition] === null)
            {
                for (let item of positionsMove)
                {
                    if (this.checkCellToPossibleMove(item))
                    {
                        this.setCellToPossibleMove(item);
                    }
                }
            }
            for (let item of positionsKill)
            {
                if (this.checkCellToEat(item))
                {
                    this.setCellToEat(item);
                }
            }
        } else if (pos < 49 && pos > 8 && this.queue === this.user.color)
        {
            let nextPosition = this.lines[(lineInt-1).toString()][indexOfLine].toString();
            let leftPosition = this.lines[(lineInt-1).toString()][indexOfLine-1].toString();
            let rightPosition = this.lines[(lineInt-1).toString()][indexOfLine+1].toString();
            let positionsKill = [leftPosition, rightPosition];
            if (this.position[nextPosition] === null)
            {
                this.setCellToPossibleMove(nextPosition);
            }
            for (let item of positionsKill)
            {
                if (item !== null && this.checkCellToEat(item))
                {
                    this.setCellToEat(item);
                }
            }
        } else if (pos > 16 && pos < 57 && this.queue === this.bot.color)
        {
            let nextPosition = this.lines[(lineInt+1).toString()][indexOfLine].toString();
            let leftPosition = this.lines[(lineInt+1).toString()][indexOfLine-1].toString();
            let rightPosition = this.lines[(lineInt+1).toString()][indexOfLine+1].toString();
            let positionsKill = [leftPosition, rightPosition];
            if (this.position[nextPosition] === null)
            {
                this.setCellToPossibleMove(nextPosition);
            }
            for (let item of positionsKill)
            {
                if (item !== null && this.checkCellToEat(item))
                {
                    this.setCellToEat(item);
                }
            }
        }
    }

    analyzeRookMove(pos) {
        let line = this.getLine(pos);
        let lineArr = this.lines[line];
        let breakpoint = lineArr.indexOf(parseInt(pos));
        let leftMove = lineArr.slice(0, breakpoint).reverse();
        let rightMove = lineArr.slice(breakpoint+1);
        for (let i = 8; parseInt(pos)+i < 65; i+=8)
        {
            let nextPosition = (parseInt(pos)+i).toString();
            if (this.checkCellToPossibleMove(nextPosition))
            {
                if (this.checkCellToEat(nextPosition))
                {
                    this.setCellToEat(nextPosition);
                    break;
                } else
                {
                    this.setCellToPossibleMove(nextPosition);
                }
            } else
            {
                break;
            }
        }
        for (let i = 8; parseInt(pos)-i > 0; i += 8)
        {
            let nextPosition = (parseInt(pos)-i).toString();
            if (this.checkCellToPossibleMove(nextPosition))
            {
                if (this.checkCellToEat(nextPosition))
                {
                    this.setCellToEat(nextPosition);
                    break;
                } else
                {
                    this.setCellToPossibleMove(nextPosition);
                }
            } else
            {
                break;
            }
        }
        if (leftMove.length > 0)
        {
            for (let item of leftMove)
            {
                let nextPosition = item.toString();
                if (this.checkCellToPossibleMove(nextPosition))
                {
                    if (this.checkCellToEat(nextPosition))
                    {
                        this.setCellToEat(nextPosition);
                        break;
                    } else
                    {
                        this.setCellToPossibleMove(nextPosition);
                    }
                } else
                {
                    break;
                }
            }
        }
        if (rightMove.length > 0)
        {
            for (let item of rightMove)
            {
                let nextPosition = item.toString();
                if (this.checkCellToPossibleMove(nextPosition))
                {
                    if (this.checkCellToEat(nextPosition))
                    {
                        this.setCellToEat(nextPosition);
                        break;
                    } else {
                        this.setCellToPossibleMove(nextPosition);
                    }
                } else
                {
                    break;
                }
            }
        }
    }

    analyzeKnightMove(pos) {
        let posInt = parseInt(pos), movePos = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]], moveArr = [];
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        for (let i = 0; i < 8; i++)
        {
            let nextLine = lineInt+movePos[i][0];
            let nextPos = indexOfLine+movePos[i][1];
            if (nextLine > 0 && nextLine < 9 && nextPos > -1 && nextPos < 8)
            {
                let nextPosition = this.lines[nextLine.toString()][nextPos];
                moveArr.push(nextPosition.toString());
            } else
            {
                moveArr.push(0);
            }
        }
        for (let item of moveArr)
        {
            if (parseInt(item) > 0 && this.checkCellToPossibleMove(item))
            {
                if (this.checkCellToEat(item))
                {
                    this.setCellToEat(item);
                } else
                {
                    this.setCellToPossibleMove(item);
                }
            }
        }
    }

    analyzeBishopMove(pos) {
        let posInt = parseInt(pos);
        let movePos = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        let moveArr = [[], [], [], []];
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        for (let i = 0; i < 4; i++)
        {
            moveArr[i] = this.getMoveArr(movePos, lineInt, indexOfLine, i);
        }
        for (let arr of moveArr)
        {
            for (let item of arr)
            {
                if (item > 0 && this.checkCellToPossibleMove(item.toString()))
                {
                    if (this.checkCellToEat(item.toString()))
                    {
                        this.setCellToEat(item.toString());
                        break;
                    } else
                    {
                        this.setCellToPossibleMove(item.toString());
                    }
                } else {
                    break;
                }
            }
        }
    }

    analyzeQueenMove(pos) {
        let posInt = parseInt(pos);
        let movePos = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
        let moveArr = [[], [], [], [], [], [], [], []];
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        for (let i = 0; i < 8; i++)
        {
            moveArr[i] = this.getMoveArr(movePos, lineInt, indexOfLine, i);
        }
        for (let arr of moveArr)
        {
            for (let item of arr)
            {
                if (item > 0 && this.checkCellToPossibleMove(item.toString()))
                {
                    if (this.checkCellToEat(item.toString()))
                    {
                        this.setCellToEat(item.toString());
                        break;
                    } else
                    {
                        this.setCellToPossibleMove(item.toString());
                    }
                }
            }
        }
    }

    analyzeKingMove(pos) {
        let posInt = parseInt(pos);
        let movePos = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
        let moveArr = [];
        let line = this.getLine(pos);
        let lineInt = parseInt(line);
        let indexOfLine = this.lines[line].indexOf(posInt);
        for (let i = 0; i < 8; i++)
        {
            let nextLine = lineInt + movePos[i][0];
            let nextPos = indexOfLine + movePos[i][1];
            if (nextLine > 0 && nextLine < 9 && nextPos > -1 && nextPos < 9)
            {
                moveArr.push(this.lines[nextLine.toString()][nextPos]);
            } else {
                moveArr.push(0);
            }
        }
        for (let item of moveArr)
        {
            if (item > 0 && this.checkCellToPossibleMove(item.toString()))
            {
                if (this.checkCellToEat(item.toString()))
                {
                    this.setCellToEat(item.toString());
                } else
                {
                    this.setCellToPossibleMove(item.toString());
                }
            }
        }
    }

    getMoveArr(movePos, lineInt, indexOfLine, i)
    {
        let moveArr = []
        for (let j = 1; j < 8; j++)
        {
            let nextLine = lineInt + (movePos[i][0] * j);
            let nextPos = indexOfLine + (movePos[i][1] * j);
            if (nextLine > 0 && nextLine < 9 && nextPos > -1 && nextPos < 8)
            {
                let nextMove = this.lines[nextLine.toString()][nextPos];
                moveArr.push(nextMove);
                if (this.position[nextMove.toString()] !== null)
                {
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
        if (condition)
        {
            line = parseInt(posInt / 8) + 1;
        } else
        {
            line = parseInt(posInt / 8);
        }
        return line.toString();
    }

    setCellToPossibleMove(pos)
    {
        let cell = document.getElementById(this.classes.cell+'-'+pos);
        cell.classList.remove(this.classes.cell);
        cell.classList.add(this.classes.possibleMove);
    }

    checkCellToPossibleMove(pos)
    {
        let cell = document.getElementById('cell-'+pos).className;
        if (cell === null)
        {
            return false;
        } else
        {
            return cell.match(this.classes.cell) !== null && cell.match(this.queue) === null;
        }
    }

    checkCellToEat(pos)
    {
        let cell = document.getElementById('cell-'+pos).className;
        if (cell === null)
        {
            return false;
        } else
        {
            return cell.match(this.classes.cell) !== null && cell.match(this.queueNegative) !== null;
        }
    }

    setCellToEat(pos) {
        let cell = document.getElementById(this.classes.cell+'-'+pos);
        cell.classList.remove(this.classes.cell);
        cell.classList.add(this.classes.killMove);
    }

    eatFigure(murder, meal) {
        let mealId = meal.split("-")[1];
        let historyResult = "[eat] " + murder + " -> " + meal;
        this.history.push(historyResult);
        this.pushHistory(historyResult);
        let count = null;
        if (this.queue === this.user.color)
        {
            count = this.user.kill;
            this.user.kill += 1;
        } else
        {
            count = this.bot.kill;
            this.bot.kill += 1;
        }
        let cell = document.getElementById(this.queue+"-eat-"+(count+1).toString());
        cell.classList.add(this.position[mealId]);
    }

    possibleChangeFigure(figure) {}

    isCheck() {
        if (this.queue === this.user.color) {
            let king = document.getElementsByClassName('king-'+this.user.color);
            if (king.className.match("kill-move") !== null) {
                this.setPositionClass(king.item(0).attributes.id.value, 'check-move');
            }
        }
    }

    isCheckMate() {}
}

class EventListener
{
    constructor(chess)
    {
        this.game = chess;
        this.queue = null;
    }

    activate()
    {
        document.querySelectorAll('.cell').forEach(item =>
        {
            item.addEventListener('click', () =>
            {
                this.queue = new HandlerUtil().whoQueue();
                if (
                    item.className.match(this.game.classes.cell) !== null &&
                    item.className.match(this.queue) !== null
                )
                {
                    new HandlerUtil().clearDecals();
                    item.classList.remove(this.game.classes.cell);
                    item.classList.add(this.game.classes.hold);
                    this.game.possibleMove(item);
                } else if (item.className.match(this.game.classes.possibleMove) !== null)
                {
                    let figure = document.querySelector("."+this.game.classes.hold);
                    this.game.moveFigure(figure, figure.attributes.id.value, item.attributes.id.value);
                } else if (item.className.match(this.game.classes.killMove) !== null) {
                    let figure = document.querySelector("."+this.game.classes.hold);
                    this.game.moveFigure(figure, figure.attributes.id.value, item.attributes.id.value);
                }
            });
        });
    }
}

class StartGame
{
    constructor(userColor)
    {
        this.user = {
            color : userColor,
            side : "bottom"
        };
        this.bot = {
            color : userColor === "white" ? "black" : "white",
            side : "top"
        };
    }

    activate()
    {
        let h1 = document.getElementById('data');
        h1.setAttribute('aria-user', this.user.color);
        h1.setAttribute('aria-bot', this.bot.color);
        this.fillSide(this.user.side, this.user.color);
        this.fillSide(this.bot.side, this.bot.color);
    }

    fillSide(side, color)
    {
        const sideColor = {
            "black": {
                pawn: "pawn-black",
                rook: "rook-black",
                knights: "knight-black",
                bishop: "bishop-black",
                queen: "queen-black",
                king: "king-black"
            },
            "white": {
                pawn: "pawn-white",
                rook: "rook-white",
                knights: "knight-white",
                bishop: "bishop-white",
                queen: "queen-white",
                king: "king-white"
            }
        }

        /* TOP */
        // rook
        let h1 = document.getElementById('cell-1');
        let a1 = document.getElementById('cell-8');
        // knights
        let g1 = document.getElementById('cell-2');
        let b1 = document.getElementById('cell-7');
        // bishop
        let f1 = document.getElementById('cell-3');
        let c1 = document.getElementById('cell-6');
        // queen
        let e1 = document.getElementById('cell-4');
        // king
        let d1 = document.getElementById('cell-5');
        /* END TOP */

        const top = {
            rook: [h1, a1],
            knights: [g1, b1],
            bishop: [f1, c1],
            queen: e1,
            king: d1
        }

        /* BOTTOM */
        // rook
        let h8 = document.getElementById('cell-57');
        let a8 = document.getElementById('cell-64');
        // knights
        let g8 = document.getElementById('cell-58');
        let b8 = document.getElementById('cell-63');
        // bishop
        let f8 = document.getElementById('cell-59');
        let c8 = document.getElementById('cell-62');
        // queen
        let e8 = document.getElementById('cell-60');
        // king
        let d8 = document.getElementById('cell-61');
        /* END BOTTOM*/

        const bottom = {
            rook: [h8, a8],
            knights: [g8, b8],
            bishop: [f8, c8],
            queen: e8,
            king: d8
        }

        switch (side)
        {
            case "top":
                for (let item of top.rook)
                {
                    item.classList.add(sideColor[color].rook);
                }
                for (let item of top.knights)
                {
                    item.classList.add(sideColor[color].knights);
                }
                for (let item of top.bishop)
                {
                    item.classList.add(sideColor[color].bishop);
                }
                top.queen.classList.add(sideColor[color].queen);
                top.king.classList.add(sideColor[color].king);
                for (let i = 9; i < 17; i++)
                {
                    document.getElementById('cell-' + i.toString()).classList.add(sideColor[color].pawn);
                }
                break;
            case "bottom":
                for (let item of bottom.rook)
                {
                    item.classList.add(sideColor[color].rook);
                }
                for (let item of bottom.knights)
                {
                    item.classList.add(sideColor[color].knights);
                }
                for (let item of bottom.bishop)
                {
                    item.classList.add(sideColor[color].bishop);
                }
                bottom.queen.classList.add(sideColor[color].queen);
                bottom.king.classList.add(sideColor[color].king);
                for (let i = 49; i < 57; i++)
                {
                    document.getElementById('cell-' + i.toString()).classList.add(sideColor[color].pawn);
                }
                break;
            default:
                break;
        }
    }
}

class HandlerUtil
{
    constructor()
    {
    }

    whoQueue()
    {
        return document.getElementById('data').attributes.getNamedItem('aria-move').value;
    }

    toggleQueue()
    {
        let color = document.getElementById('data').attributes.getNamedItem('aria-move').value;
        switch (color)
        {
            case "white":
                document.getElementById('data').attributes.getNamedItem('aria-move').value = 'black';
                break;
            case "black":
                document.getElementById('data').attributes.getNamedItem('aria-move').value = 'white';
                break;
            default:
                break;
        }
    }

    parseColors()
    {
        let userColor = document.getElementById('data').attributes.getNamedItem('aria-user').value;
        let botColor = document.getElementById('data').attributes.getNamedItem('aria-bot').value;
        return {
            user: userColor,
            bot: botColor
        };
    }

    clearDecals()
    {
        document.querySelectorAll('.hold').forEach(item =>
        {
            item.classList.remove('hold');
            item.classList.add('cell');
        });
        document.querySelectorAll('.possible-move').forEach(item =>
        {
            item.classList.remove('possible-move');
            item.classList.add('cell');
        });
        document.querySelectorAll('.kill-move').forEach(item =>
        {
            item.classList.remove('kill-move');
            item.classList.add('cell');
        });
    }
}