document.onreadystatechange = () => {

    if (document.readyState === "complete") {
        fillWhiteSide("top");
        fillBlackSide("bottom");
        handlerModels();
    }

}

function handlerModels() {
    document.querySelectorAll('.cell').forEach(item => {
        item.addEventListener('click', () => {
            if (item.className.split(" ").length === 2) {
                clearModels();
                item.classList.remove('cell');
                item.classList.add('hold');
            } else if (item.className.split(" ").length === 1) {
                let figure = document.querySelector('.hold');
                if (figure !== null) {
                    moveFigure(figure, figure.attributes.id.value, item.attributes.id.value);
                }
            }
        });
    });
}

function clearModels() {
    document.querySelectorAll('.hold').forEach(item => {
        item.classList.remove('hold');
        item.classList.add('cell');
    });
}

function whoStep() {
    let color = document.getElementById('data').attributes.getNamedItem('aria-move').value;
    return color;
}

function whoStepToggle() {
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
function moveFigure(figure, from, to) {
    let className = figure.className.split(' ')[0];
    let figureArray = className.split("-");
    let name = figureArray[0];
    let color = figureArray[1];
    console.log('color: ', color);
    let colorOrder = whoStep();
    if (colorOrder === color) {
        document.getElementById(from).classList.remove(className);
        document.getElementById(from).classList.remove('hold');
        document.getElementById(from).classList.add('cell');
        document.getElementById(to).classList.add(className);
        whoStepToggle();
    } else {
        clearModels();
    }
}

function fillWhiteSide(side) {
    fillSide(side, "white");
}


function fillBlackSide(side) {
    fillSide(side, "black");
}

function fillSide(side, color) {

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