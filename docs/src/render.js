import { canvas, ctx, gos } from "./init.js";
import { findSlotOfCard, listGameObject } from "./update.js";
// RENDER
export function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderTitle();
    renderSlots();
    renderCards();
    renderFireworks();
    //renderMouse();
}
function renderTitle() {
    ctx.font = "60px serif";
    ctx.fillStyle = "darkgrey";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("Klondike", canvas.width * .5, canvas.height * .95);
    ctx.fillText("____", canvas.width * .5, canvas.height * .96);
}
function renderCards() {
    const sortedCards = [...gos.cards.values()]
        .filter(go => go.card)
        .sort((a, b) => {
        const grabA = findSlotOfCard(a).grab ? 1 : 0;
        const grabB = findSlotOfCard(b).grab ? 1 : 0;
        if (grabA === grabB)
            // both grabbed or none grabbed
            return a.transform.y - b.transform.y;
        else
            // one grabbed (foreground) and one normal (background)
            return grabA - grabB;
    });
    for (const go of sortedCards)
        renderCard(go);
}
function renderCard(go) {
    const { suit, rank, faceUp } = go.card;
    const { x, y, width, height } = go.transform;
    const halfwidth = width / 2, halfheight = height / 2;
    if (faceUp)
        ctx.fillStyle = "white";
    else {
        const gradient = ctx.createLinearGradient(-halfwidth, -halfheight / 2, halfwidth, halfheight / 2);
        gradient.addColorStop(0, "#CCC");
        gradient.addColorStop(1, "#EEE");
        ctx.fillStyle = gradient;
    }
    ctx.strokeStyle = "#555";
    makeRectangle(x, y, halfwidth, halfheight, () => (ctx.stroke(), ctx.fill()));
    if (faceUp) {
        // color
        const suitColor = {
            SPADES: "black",
            HEARTS: "firebrick",
            CLUBS: "black",
            DIAMONDS: "firebrick"
        }[suit];
        ctx.fillStyle = suitColor;
        ctx.textBaseline = "alphabetic";
        const xpad = 10, ypad = 23, ypadneg = 13;
        // rank
        const rankText = rank === 1 ? "A" : rank <= 10 ? "" + rank : ["J", "Q", "K"][rank - 11];
        ctx.font = "13pt sans";
        ctx.textAlign = "left";
        ctx.fillText(rankText, x - halfwidth + xpad, y - halfheight + ypad);
        ctx.textAlign = "right";
        ctx.fillText(rankText, x + halfwidth - xpad, y + halfheight - ypad + ypadneg);
        // suit
        const suitChar = {
            SPADES: "\u2660",
            HEARTS: "\u2665",
            CLUBS: "\u2663",
            DIAMONDS: "\u2666"
        }[suit];
        ctx.font = "16pt sans";
        ctx.textAlign = "right";
        ctx.fillText(suitChar, x + halfwidth - xpad, y - halfheight + ypad);
        ctx.textAlign = "left";
        ctx.fillText(suitChar, x - halfwidth + xpad, y + halfheight - ypad + ypadneg);
        // large suit symbol
        const largeSuitChar = {
            SPADES: "\u2664",
            HEARTS: "\u2661",
            CLUBS: "\u2667",
            DIAMONDS: "\u2662"
        }[suit];
        ctx.font = "30pt sans";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(largeSuitChar, x, y);
    }
}
function makeRectangle(x, y, halfwidth, halfheight, callback) {
    const radius = 15;
    ctx.save();
    ctx.translate(x, y);
    ctx.save();
    ctx.moveTo(-halfwidth + radius, -halfheight);
    ctx.lineTo(halfwidth - radius, -halfheight);
    ctx.quadraticCurveTo(halfwidth, -halfheight, halfwidth, -halfheight + radius);
    ctx.lineTo(halfwidth, halfheight - radius);
    ctx.quadraticCurveTo(halfwidth, halfheight, halfwidth - radius, halfheight);
    ctx.lineTo(-halfwidth + radius, halfheight);
    ctx.quadraticCurveTo(-halfwidth, halfheight, -halfwidth, halfheight - radius);
    ctx.lineTo(-halfwidth, -halfheight + radius);
    ctx.quadraticCurveTo(-halfwidth, -halfheight, -halfwidth + radius, -halfheight);
    ctx.closePath();
    callback();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
}
function renderFireworks() {
    for (const go of gos.firework.values()) {
        if (go.firework) {
            const { x, y, width, height } = go.transform;
            ctx.strokeStyle = "black";
            ctx.strokeRect(x - width / 2, y - height / 2, width - width / 2, height - height / 2);
            ctx.fillStyle = go.firework.color;
            ctx.fillRect(x - width / 2, y - height / 2, width - width / 2, height - height / 2);
        }
    }
}
function renderMouse() {
    for (const go of listGameObject(gos).values()) {
        if (go.mouse) {
            const { x, y } = go.transform;
            const { pressed, targets } = go.mouse;
            const rad = 5;
            ctx.fillStyle = pressed ? "red" : "grey";
            ctx.fillRect(x - rad, y - rad, 2 * rad, 2 * rad);
            ctx.font = "8pt sans";
            ctx.fillStyle = "blue";
            ctx.textAlign = "left";
            if (targets.card)
                ctx.fillText(targets.card.card.rank + " of " + targets.card.card.suit, x + 10, y);
            if (targets.slot)
                ctx.fillText(Object.values(targets.slot.slot).join(" "), x + 10, y - 15);
        }
    }
}
function renderSlots() {
    for (const go of listGameObject(gos).values())
        if (go.slot)
            renderSlot(go);
}
function renderSlot(go) {
    const { x, y, width, height } = go.transform;
    const halfwidth = width / 2, halfheight = height / 2;
    ctx.strokeStyle = "#CCC";
    makeRectangle(x, y, halfwidth, halfheight, () => ctx.stroke());
}
