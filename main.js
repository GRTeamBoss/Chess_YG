document.onreadystatechange = () => {

    if (document.readyState == "complete") {
        fillWhiteSide("top");
        fillBlackSide("bottom");
        handlerModels();
    }

}

function handlerModels() {
    document.querySelectorAll('.cell').forEach(item => {
        item.addEventListener('click', e => {
            clearModels();
            if (item.className.split(" ").length == 2) {
                item.classList.remove('cell');
                item.classList.add('hold');
            }
            console.log(item.className.toString(), item.attributes.id.value);
        });
    });
}

function clearModels() {
    document.querySelectorAll('.hold').forEach(item => {
        item.classList.remove('hold');
        item.classList.add('cell');
    });
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
    var h1 = document.getElementById('cell-1');
    var a1 = document.getElementById('cell-8');
    // knights
    var g1 = document.getElementById('cell-2');
    var b1 = document.getElementById('cell-7');
    // bishop
    var f1 = document.getElementById('cell-3');
    var c1 = document.getElementById('cell-6');
    // queen
    var e1 = document.getElementById('cell-4');
    // king
    var d1 = document.getElementById('cell-5');
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
    var h8 = document.getElementById('cell-57');
    var a8 = document.getElementById('cell-64');
    // knights
    var g8 = document.getElementById('cell-58');
    var b8 = document.getElementById('cell-63');
    // bishop
    var f8 = document.getElementById('cell-59');
    var c8 = document.getElementById('cell-62');
    // queen
    var e8 = document.getElementById('cell-60');
    // king
    var d8 = document.getElementById('cell-61');
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
            for (item of top.rook) {
                item.classList.add(sideColor[color].rook);
            }
            for (item of top.knights) {
                item.classList.add(sideColor[color].knights);
            }
            for (item of top.bishop) {
                item.classList.add(sideColor[color].bishop);
            }
            top.queen.classList.add(sideColor[color].queen);
            top.king.classList.add(sideColor[color].king);
            for (var i = 9; i < 17; i++) {
                document.getElementById('cell-' + i.toString()).classList.add(sideColor[color].pawn);
            }
            break;
        case "bottom":
            for (item of bottom.rook) {
                item.classList.add(sideColor[color].rook);
            }
            for (item of bottom.knights) {
                item.classList.add(sideColor[color].knights);
            }
            for (item of bottom.bishop) {
                item.classList.add(sideColor[color].bishop);
            }
            bottom.queen.classList.add(sideColor[color].queen);
            bottom.king.classList.add(sideColor[color].king);
            for (var i = 49; i < 57; i++) {
                document.getElementById('cell-' + i.toString()).classList.add(sideColor[color].pawn);
            }
            break;
        default:
            window.alert("Error! Wrong Callback!");
            break;
    }
}