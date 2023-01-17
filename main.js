document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        console.log('Work!');
        new StartGame("white").activate();
        new EventListener(new Chess()).activate();
    }
}
class Chess {
    constructor() {
        console.log('Chess');
        this.colors = new HandlerUtil().parseColors();
        this.queue = null;
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
        }
        this.user = {
            side : "bottom",
            color : this.colors.user
        };
        this.bot = {
            side : "top",
            color : this.colors.bot
        }
    }

    moveFigure(figure, from, to) {
        let className = figure.className.split(' ')[0];
        let figureArray = className.split("-");
        let name = figureArray[0];
        let color = figureArray[1];
        let fromInteger = from.split('-')[1];
        let toInteger = to.split('-')[1];
        let colorQueue = new HandlerUtil().whoQueue();
        if (colorQueue === color && this.checkMove(to)) {
            document.getElementById(from).classList.remove(className);
            document.getElementById(from).classList.remove('hold');
            document.getElementById(from).classList.add('cell');
            document.getElementById(to).classList.add(className);
            let tmp = this.position[fromInteger];
            this.position[fromInteger] = null;
            this.position[toInteger] = tmp;
            new HandlerUtil().toggleQueue();
            new HandlerUtil().clearDecals();
        } else {
            console.log('wrong-move');
            this.setPositionClass(to, 'wrong-move');
            new HandlerUtil().clearDecals();
        }
    }

    checkMove(pos) {
        let cell = document.getElementById(pos).className.match('possible-move');
        return cell !== null;
    }

    setPositionClass(pos, className) {
        let cell = document.getElementById(pos);
        cell.classList.remove('cell');
        cell.classList.add(className);
        setTimeout(() => {
            this.deletePositionClass(pos, className);
            }, 1000);
    }

    deletePositionClass(pos, className) {
        let cell = document.getElementById(pos);
        cell.classList.remove(className);
        cell.classList.add('cell');
    }

    eatFigure(killer, meal) {}

    possibleMove(figure) {
        this.queue = new HandlerUtil().whoQueue();
        let id = figure.attributes.id.value;
        let pos = id.split('-')[1];
        let peace = this.position[pos].split("-")[0];
        switch (peace) {
            case "pawn":
                if (pos >= 49 && pos <= 56 && this.queue === this.user.color && this.position[pos] === 'pawn-'+this.queue) {
                    let firstPosition = (parseInt(pos) - 8).toString();
                    let secondPosition = (parseInt(pos) - 16).toString();
                    let positions = [firstPosition, secondPosition];
                    if (this.checkCellToPossibleMove(firstPosition) === true) {
                        for (let item of positions) {
                            if (this.checkCellToPossibleMove(item) === true) {
                                this.setCellToPossibleMove(item);
                            }
                        }
                    }
                } else if (pos >= 9 && pos <= 16 && this.queue === this.bot.color && this.position[pos] === 'pawn-'+this.queue) {
                    let firstPosition = (parseInt(pos) + 8).toString();
                    let secondPosition = (parseInt(pos) + 16).toString();
                    let positions = [firstPosition, secondPosition];
                    if (this.checkCellToPossibleMove(firstPosition) === true) {
                        for (let item of positions) {
                            if (this.checkCellToPossibleMove(item) === true) {
                                this.setCellToPossibleMove(item);
                            }
                        }
                    }
                } else if (pos < 49 && pos > 8 && this.queue === this.user.color && this.position[pos] === 'pawn-'+this.queue) {
                    let nextPosition = (parseInt(pos) - 8).toString();
                    if (this.checkCellToPossibleMove(nextPosition) === true) {
                        this.setCellToPossibleMove(nextPosition);
                    }
                } else if (pos > 16 && pos < 57 && this.queue === this.bot.color && this.position[pos] === 'pawn-'+this.queue) {
                    let nextPosition = (parseInt(pos) + 8).toString();
                    if (this.checkCellToPossibleMove(nextPosition) === true) {
                        this.setCellToPossibleMove(nextPosition);
                    }
                }
                break;
            default:
                break;
        }
    }

    setCellToPossibleMove(pos) {
        document.getElementById('cell-'+pos).classList.remove('cell');
        document.getElementById('cell-'+pos).classList.add('possible-move');
    }

    checkCellToPossibleMove(pos) {
        let cell = document.getElementById('cell-'+pos).className.split(" ").length;
        return cell === 1;
    }

    possibleEat(figure) {}

    possibleChangeFigure(figure) {}

    isCheck() {}

    ifCheckMate() {}
}

class EventListener {
    constructor(chess) {
        console.log('EventListener');
        this.game = chess;
    }

    activate() {
        document.querySelectorAll('.cell').forEach(item => {
            item.addEventListener('click', () => {
                if (item.className.split(" ").length === 2) {
                    new HandlerUtil().clearDecals();
                    item.classList.remove('cell');
                    item.classList.add('hold');
                    this.game.possibleMove(item);
                } else if (item.className.split(" ").length === 1) {
                    let figure = document.querySelector('.hold');
                    if (figure !== null) {
                        this.game.moveFigure(figure, figure.attributes.id.value, item.attributes.id.value);
                    }
                }
            });
        });
    }
}

class StartGame {
    constructor(userColor) {
        console.log('StartGame');
        this.user = {
            color : userColor,
            side : "bottom"
        };
        this.bot = {
            color : userColor === "white" ? "black" : "white",
            side : "top"
        };
    }

    activate() {
        let h1 = document.getElementById('data');
        h1.setAttribute('aria-user', this.user.color);
        h1.setAttribute('aria-bot', this.bot.color);
        this.fillSide(this.user.side, this.user.color);
        this.fillSide(this.bot.side, this.bot.color);
    }

    fillSide(side, color) {
        console.log(side, color)
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

        switch (side) {
            case "top":
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
                    document.getElementById('cell-' + i.toString()).classList.add(sideColor[color].pawn);
                }
                break;
            case "bottom":
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
                    document.getElementById('cell-' + i.toString()).classList.add(sideColor[color].pawn);
                }
                break;
            default:
                window.alert("Error! Wrong Callback!");
                break;
        }
    }
}

class HandlerUtil {
    constructor() {
    }

    whoQueue() {
        return document.getElementById('data').attributes.getNamedItem('aria-move').value;
    }

    toggleQueue() {
        let color = document.getElementById('data').attributes.getNamedItem('aria-move').value;
        switch (color) {
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

    parseColors() {
        let userColor = document.getElementById('data').attributes.getNamedItem('aria-user').value;
        let botColor = document.getElementById('data').attributes.getNamedItem('aria-bot').value;
        return {
            user: userColor,
            bot: botColor
        };
    }

    clearDecals() {
        document.querySelectorAll('.hold').forEach(item => {
            item.classList.remove('hold');
            item.classList.add('cell');
        });
        document.querySelectorAll('.possible-move').forEach(item => {
            item.classList.remove('possible-move');
            item.classList.add('cell');
        });
    }
}