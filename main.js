document.onreadystatechange = () => {
    localStorage.setItem("userColor", "white");
    localStorage.setItem("botColor", "black");
    localStorage.setItem("moveColor", "white");
    localStorage.setItem("currentMove", "user");
    if (document.readyState === "complete") {
        const userColor = localStorage.getItem("userColor"),
            botColor = localStorage.getItem("botColor");
        new StartGame(userColor, botColor).activate();
        new EventListener().activate();
    }
};

class EventListener {
    constructor() {
        this.classes = new HandlerUtil().classes;
        this.game = new Chess();
        this.queue = null;
    }

    activate() {
        document.querySelectorAll("." + this.classes.cell).forEach((item) => {
            item.addEventListener("click", () => {
                this.queue = new HandlerUtil().whoQueue();
                if (
                    item.className.match(this.classes.cell) !== null &&
                    item.className.match(this.queue.color) !== null
                ) {
                    new HandlerUtil().clearDecals();
                    item.classList.remove(this.classes.cell);
                    item.classList.add(this.classes.hold);
                    this.game.setPossibleMove(item);
                } else if (
                    item.className.match(this.classes.possibleMove) !== null
                ) {
                    let figure = document.querySelector(
                        "." + this.classes.hold
                    );
                    this.game.moveFigure(
                        figure,
                        figure.attributes.id.value,
                        item.attributes.id.value
                    );
                } else if (
                    item.className.match(this.classes.killMove) !== null
                ) {
                    let figure = document.querySelector(
                        "." + this.classes.hold
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
    constructor(userColor, botColor) {
        this.user = {
            name: "user",
            color: userColor,
            side: "bottom",
        };
        this.bot = {
            name: "bot",
            color: botColor,
            side: "top",
        };
    }

    activate() {
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
        // rooks
        let h8 = document.getElementById("h8");
        let a8 = document.getElementById("a8");
        // knights
        let g8 = document.getElementById("g8");
        let b8 = document.getElementById("b8");
        // bishops
        let f8 = document.getElementById("f8");
        let c8 = document.getElementById("c8");
        // queen
        let e8 = document.getElementById("e8");
        // king
        let d8 = document.getElementById("d8");
        // pawns
        let a7 = document.getElementById("a7");
        let b7 = document.getElementById("b7");
        let c7 = document.getElementById("c7");
        let d7 = document.getElementById("d7");
        let e7 = document.getElementById("e7");
        let f7 = document.getElementById("f7");
        let g7 = document.getElementById("g7");
        let h7 = document.getElementById("h7");
        /* END TOP*/

        /* BOTTOM */
        // rooks
        let h1 = document.getElementById("h1");
        let a1 = document.getElementById("a1");
        // knights5
        let g1 = document.getElementById("g1");
        let b1 = document.getElementById("b1");
        // bishops
        let f1 = document.getElementById("f1");
        let c1 = document.getElementById("c1");
        // queen
        let e1 = document.getElementById("e1");
        // king
        let d1 = document.getElementById("d1");
        // pawns
        let a2 = document.getElementById("a2");
        let b2 = document.getElementById("b2");
        let c2 = document.getElementById("c2");
        let d2 = document.getElementById("d2");
        let e2 = document.getElementById("e2");
        let f2 = document.getElementById("f2");
        let g2 = document.getElementById("g2");
        let h2 = document.getElementById("h2");
        /* END BOTTOM */

        const bottom = {
            name: "bottom",
            pawns: [a2, b2, c2, d2, e2, f2, g2, h2],
            rooks: [h1, a1],
            knights: [g1, b1],
            bishops: [f1, c1],
            queen: d1,
            king: e1,
        };

        const top = {
            name: "top",
            pawns: [a7, b7, c7, d7, e7, f7, g7, h7],
            rooks: [h8, a8],
            knights: [g8, b8],
            bishops: [f8, c8],
            queen: d8,
            king: e8,
        };

        switch (side) {
            case top.name:
                for (let item of top.pawns) {
                    item.classList.add(sideColor[color].pawn);
                }
                for (let item of top.rooks) {
                    item.classList.add(sideColor[color].rook);
                }
                for (let item of top.knights) {
                    item.classList.add(sideColor[color].knights);
                }
                for (let item of top.bishops) {
                    item.classList.add(sideColor[color].bishop);
                }
                top.queen.classList.add(sideColor[color].queen);
                top.king.classList.add(sideColor[color].king);
                break;
            case bottom.name:
                for (let item of bottom.pawns) {
                    item.classList.add(sideColor[color].pawn);
                }
                for (let item of bottom.rooks) {
                    item.classList.add(sideColor[color].rook);
                }
                for (let item of bottom.knights) {
                    item.classList.add(sideColor[color].knights);
                }
                for (let item of bottom.bishops) {
                    item.classList.add(sideColor[color].bishop);
                }
                bottom.queen.classList.add(sideColor[color].queen);
                bottom.king.classList.add(sideColor[color].king);
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
        this.colors = new HandlerUtil().parseColors();
        this.lines = {
            1: ["a", "b", "c", "d", "e", "f", "g", "h"],
            2: ["a", "b", "c", "d", "e", "f", "g", "h"],
            3: ["a", "b", "c", "d", "e", "f", "g", "h"],
            4: ["a", "b", "c", "d", "e", "f", "g", "h"],
            5: ["a", "b", "c", "d", "e", "f", "g", "h"],
            6: ["a", "b", "c", "d", "e", "f", "g", "h"],
            7: ["a", "b", "c", "d", "e", "f", "g", "h"],
            8: ["a", "b", "c", "d", "e", "f", "g", "h"],
        };
        this.positions = {
            a8: "rook-" + this.colors.bot,
            b8: "knight-" + this.colors.bot,
            c8: "bishop-" + this.colors.bot,
            d8: "queen-" + this.colors.bot,
            e8: "king-" + this.colors.bot,
            f8: "bishop-" + this.colors.bot,
            g8: "knight-" + this.colors.bot,
            h8: "rook-" + this.colors.bot,
            a7: "pawn-" + this.colors.bot,
            b7: "pawn-" + this.colors.bot,
            c7: "pawn-" + this.colors.bot,
            d7: "pawn-" + this.colors.bot,
            e7: "pawn-" + this.colors.bot,
            f7: "pawn-" + this.colors.bot,
            g7: "pawn-" + this.colors.bot,
            h7: "pawn-" + this.colors.bot,
            a6: null,
            b6: null,
            c6: null,
            d6: null,
            e6: null,
            f6: null,
            g6: null,
            h6: null,
            a5: null,
            b5: null,
            c5: null,
            d5: null,
            e5: null,
            f5: null,
            g5: null,
            h5: null,
            a4: null,
            b4: null,
            c4: null,
            d4: null,
            e4: null,
            f4: null,
            g4: null,
            h4: null,
            a3: null,
            b3: null,
            c3: null,
            d3: null,
            e3: null,
            f3: null,
            g3: null,
            h3: null,
            a2: "pawn-" + this.colors.user,
            b2: "pawn-" + this.colors.user,
            c2: "pawn-" + this.colors.user,
            d2: "pawn-" + this.colors.user,
            e2: "pawn-" + this.colors.user,
            f2: "pawn-" + this.colors.user,
            g2: "pawn-" + this.colors.user,
            h2: "pawn-" + this.colors.user,
            a1: "rook-" + this.colors.user,
            b1: "knight-" + this.colors.user,
            c1: "bishop-" + this.colors.user,
            d1: "queen-" + this.colors.user,
            e1: "king-" + this.colors.user,
            f1: "bishop-" + this.colors.user,
            g1: "knight-" + this.colors.user,
            h1: "rook-" + this.colors.user,
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
        this.classes = new HandlerUtil().classes;
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
        this.queue = new HandlerUtil().whoQueue();
        let cellTo = undefined;
        let figureId = figure.attributes.id.value;
        let figureClassName = this.positions[figureId];
        let figureName = figureClassName.split("-")[0];
        let figureColor = figureClassName.split("-")[1];
        let cellFrom = document.getElementById(from);
        if (this.queue.color === figureColor && this.checkMove(to)) {
            cellTo = document.getElementById(to);
            cellFrom.classList.remove(figureClassName);
            cellFrom.classList.remove(this.classes.hold);
            cellFrom.classList.add(this.classes.cell);
            if (this.positions[to] !== null) {
                this.eatFigure(from, to);
                cellTo.classList.remove(this.positions[toId]);
            }
            cellTo.classList.add(figureClassName);
            this.positions[to] = this.positions[from];
            this.positions[from] = null;
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
            movePos = {
                n: [],
                s: [],
                e: [],
                w: [],
                ne: [],
                nw: [],
                se: [],
                sw: [],
            },
            eatPos = {
                n: [],
                s: [],
                e: [],
                w: [],
                ne: [],
                nw: [],
                se: [],
                sw: [],
            },
            pos = figure.attributes.id.value,
            coordinate = this.getCoordinate(pos);
        this.queue = new HandlerUtil().whoQueue();
        tmp = this.positions[pos].split("-")[0];
        switch (tmp) {
            case this.figures.pawn:
                eatPos = {
                    user: {
                        n: [],
                        s: [],
                        e: [],
                        w: [],
                        ne: [[1,1]],
                        nw: [[1,-1]],
                        se: [],
                        sw: [],
                    },
                    bot: {
                        n: [],
                        s: [],
                        e: [],
                        w: [],
                        ne: [],
                        nw: [],
                        se: [[-1,1]],
                        sw: [[-1,-1]],
                    }
                }
                if (coordinate.row === "7" || coordinate.row === "2") {
                    movePos = {
                        user: {
                            n: [
                                [1, 0],
                                [2, 0],
                            ],
                            s: [],
                            e: [],
                            w: [],
                            ne: [],
                            nw: [],
                            se: [],
                            sw: [],
                        },
                        bot: {
                            n: [],
                            s: [
                                [-1, 0],
                                [-2, 0],
                            ],
                            e: [],
                            w: [],
                            ne: [],
                            nw: [],
                            se: [],
                            sw: [],
                        },
                    };
                } else {
                    movePos = {
                        user: {
                            n: [[1, 0]],
                            s: [],
                            e: [],
                            w: [],
                            ne: [],
                            nw: [],
                            se: [],
                            sw: [],
                        },
                        bot: {
                            n: [],
                            s: [[-1, 0]],
                            e: [],
                            w: [],
                            ne: [],
                            nw: [],
                            se: [],
                            sw: [],
                        },
                    };
                }
                switch (this.queue.who) {
                    case "user":
                        this.analyzeMove(pos, movePos.user);
                        this.analyzeEat(pos, eatPos.user)
                        break;
                    case "bot":
                        this.analyzeMove(pos, movePos.bot);
                        this.analyzeEat(pos, eatPos.bot)
                        break;
                    default:
                        break;
                }
                break;
            case this.figures.rook:
                for (let i = 1; i < 8; i++) {
                    movePos.n.push([i, 0]);
                    movePos.s.push([-i, 0]);
                    movePos.w.push([0, i]);
                    movePos.e.push([0, -i]);
                }
                this.analyzeMove(pos, movePos);
                this.analyzeEat(pos, movePos);
                break;
            case this.figures.knight:
                movePos = {
                    n: [[-2, -1]],
                    e: [[-2, 1]],
                    s: [[-1, -2]],
                    w: [[-1, 2]],
                    ne: [[1, -2]],
                    nw: [[1, 2]],
                    se: [[2, -1]],
                    sw: [[2, 1]],
                };
                this.analyzeMove(pos, movePos);
                this.analyzeEat(pos, movePos);
                break;
            case this.figures.bishop:
                for (let i = 1; i < 8; i++) {
                    movePos.ne.push([i, i]);
                    movePos.se.push([-i, i]);
                    movePos.sw.push([-i, -i]);
                    movePos.nw.push([i, -i]);
                }
                this.analyzeMove(pos, movePos)
                this.analyzeEat(pos, movePos);
                break;
            case this.figures.queen:
                for (let i = 1; i < 8; i++) {
                    movePos.n.push([i, 0]);
                    movePos.s.push([-i, 0]);
                    movePos.e.push([0, i]);
                    movePos.w.push([0, -i]);
                    movePos.ne.push([i, i]);
                    movePos.se.push([-i, i]);
                    movePos.sw.push([-i, -i]);
                    movePos.nw.push([i, -i]);
                }
                this.analyzeMove(pos, movePos);
                this.analyzeEat(pos, movePos)
                break;
            case this.figures.king:
                movePos = {
                    e: [[0, 1]],
                    w: [[0, -1]],
                    ne: [[1, 1]],
                    nw: [[1, -1]],
                    n: [[1, 0]],
                    se: [[-1, 1]],
                    s: [[-1, 0]],
                    sw: [[-1, -1]],
                };
                this.analyzeMove(pos, movePos);
                this.analyzeEat(pos, movePos)
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

    analyzeMove(pos, movePos) {
        let nextPosition = undefined,
            coordinate = this.getCoordinate(pos),
            indexOfLine = this.lines[coordinate.row].indexOf(coordinate.column);
        movePos.n.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToPossibleMove(nextPosition)) {this.setCellToPossibleMove(nextPosition);return true;} else {return false;}} else {return false;}});
        movePos.s.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToPossibleMove(nextPosition)) {this.setCellToPossibleMove(nextPosition);return true;} else {return false;}} else {return false;}});
        movePos.e.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToPossibleMove(nextPosition)) {this.setCellToPossibleMove(nextPosition);return true;} else {return false;}} else {return false;}});
        movePos.w.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToPossibleMove(nextPosition)) {this.setCellToPossibleMove(nextPosition);return true;} else {return false;}} else {return false;}});
        movePos.ne.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToPossibleMove(nextPosition)) {this.setCellToPossibleMove(nextPosition);return true;} else {return false;}} else {return false;}});
        movePos.nw.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToPossibleMove(nextPosition)) {this.setCellToPossibleMove(nextPosition);return true;} else {return false;}} else {return false;}});
        movePos.se.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToPossibleMove(nextPosition)) {this.setCellToPossibleMove(nextPosition);return true;} else {return false;}} else {return false;}});
        movePos.sw.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToPossibleMove(nextPosition)) {this.setCellToPossibleMove(nextPosition);return true;} else {return false;}} else {return false;}});
    }

    analyzeEat(pos, eatPos) {
        let coordinate = this.getCoordinate(pos),
            nextPosition = undefined,
            indexOfLine = this.lines[coordinate.row].indexOf(coordinate.column);
        eatPos.n.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToEat(nextPosition)) {this.setCellToEat(nextPosition);return true;} else {return false;}} else {return false;}});
        eatPos.e.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToEat(nextPosition)) {this.setCellToEat(nextPosition);return true;} else {return false;}} else {return false;}});
        eatPos.w.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToEat(nextPosition)) {this.setCellToEat(nextPosition);return true;} else {return false;}} else {return false;}});
        eatPos.s.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToEat(nextPosition)) {this.setCellToEat(nextPosition);return true;} else {return false;}} else {return false;}});
        eatPos.ne.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToEat(nextPosition)) {this.setCellToEat(nextPosition);return true;} else {return false;}} else {return false;}});
        eatPos.nw.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToEat(nextPosition)) {this.setCellToEat(nextPosition);return true;} else {return false;}} else {return false;}});
        eatPos.se.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToEat(nextPosition)) {this.setCellToEat(nextPosition);return true;} else {return false;}} else {return false;}});
        eatPos.sw.every((item) => {if (item !== undefined) {nextPosition=this.lines[coordinate.row][indexOfLine+item[1]]+(parseInt(coordinate.row) + item[0]).toString();if (this.checkCellToEat(nextPosition)) {this.setCellToEat(nextPosition);return true;} else {return false;}} else {return false;}});
    }

    getCoordinate(pos) {
        return {
            row: pos.slice(1, 2),
            column: pos.slice(0, 1),
        };
    }

    possibleChangeFigure() {}

    isCheck() {}

    isCheckMate() {}

    setCellClass(pos, className) {
        let cell = document.getElementById(pos);
        cell.classList.remove(this.classes.cell);
        cell.classList.add(className);
    }

    deleteCellClass(pos, className) {
        let cell = document.getElementById(pos);
        cell.classList.remove(className);
        cell.classList.add(this.classes.cell);
    }

    checkCellToPossibleMove(pos) {
        let cell = this.positions[pos];
        if (cell === null) {
            return true;
        } else {
            return false;
        }
    }

    checkCellToEat(pos) {
        let cell = this.positions[pos],
            color = undefined;
        if (cell === null || cell === undefined) {
            return false;
        } else {
            color = cell.split("-")[1];
            return color === this.queue.opposite;
        }
    }

    setCellToPossibleMove(pos) {
        //document.getElementById(pos).classList.remove(this.classes.cell);
        document.getElementById(pos).classList.add(this.classes.possibleMove);
    }

    setCellToEat(pos) {
        //document.getElementById(pos).classList.remove(this.classes.cell);
        document.getElementById(pos).classList.add(this.classes.killMove);
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
        this.classes = {
            cell: "cell",
            hold: "hold",
            possibleMove: "possible-move",
            wrongMove: "wrong-move",
            killMove: "kill-move",
            chekMove: "check-move",
            checkMateMove: "checkmate-move",
        };
    }

    whoQueue() {
        return {
            who: localStorage.getItem("currentMove"),
            color: localStorage.getItem("moveColor"),
            opposite: localStorage.getItem("oppositeColor"),
        };
    }

    toggleQueue() {
        let queue = this.whoQueue();
        let userColor = localStorage.getItem("userColor");
        let botColor = localStorage.getItem("botColor");
        switch (queue.color) {
            case userColor:
                localStorage.setItem("currentMove", "bot");
                localStorage.setItem("oppositeColor", userColor);
                localStorage.setItem("moveColor", botColor);
                break;
            case botColor:
                localStorage.setItem("currentMove", "user");
                localStorage.setItem("oppositeColor", botColor);
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
        document.querySelectorAll("." + this.classes.hold).forEach((item) => {
            item.classList.remove(this.classes.hold);
            item.classList.add(this.classes.cell);
        });
        document
            .querySelectorAll("." + this.classes.possibleMove)
            .forEach((item) => {
                item.classList.remove(this.classes.possibleMove);
                item.classList.add(this.classes.cell);
            });
        document
            .querySelectorAll("." + this.classes.killMove)
            .forEach((item) => {
                item.classList.remove(this.classes.killMove);
                item.classList.add(this.classes.cell);
            });
    }
}
