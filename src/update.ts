import {canvas, gos} from "./init.js";
import {GameObject, GameObject2} from "./game-object.js";
import {saveGameState} from "./undo.js";

// UPDATE

function updateGrabMouse(go:GameObject){
    if (go.grab)
        updateGrab(go)
    if (go.mouse)
        updateMouse(go)
}

export function listGameObject(gos:GameObject2):GameObject[]{
    const res:GameObject[]=[];
    for (const go of gos.cards.values()) {
        res.push(go);
    }
    if(gos.discardSlot){
        res.push(gos.discardSlot);
    }
    if(gos.foundation){
        for (const go of gos.foundation.values()) {
            res.push(go);
        }
    }
    if(gos.mouseEvent){
        res.push(gos.mouseEvent);
    }
    if(gos.firework){
        for (const go of gos.firework.values()) {
            res.push(go);
        }
    }
    return res;
}

export function update() {
    for (const go of listGameObject(gos)) {
        updateGrabMouse(go);
    }
    for (const go of listGameObject(gos)) {
        if (go.card)
            updateCard(go)
    }
    updateFireworks()
}

function updateCard(go: GameObject) {
    if (go.stack) {
        const { x: px, y: py } = go.stack.previous.transform!
        if (go.stack.spaced) {
            go.transform!.x = px
            go.transform!.y = py + 30
        } else {
            go.transform!.x = px + .2
            go.transform!.y = py + .4
        }
    }
}

function updateFireworks() {
    let found = false
    for (const go of listGameObject(gos).values()) {
        if (go.firework) {
            found = true
            updateFirework(go)
        }
    }
    if (!found) {
        const won = ![...listGameObject(gos).values()]
            .filter(go => go.slot && go.slot.kind === "foundation")
            .map(findTopCardOfSlot)
            .find(go => !go.card || go.card.rank < 13)
        if (won)
            spawnFireworks()
    }
}

function updateFirework(go: GameObject) {
    if (go.firework!.life-- > 0) {
        // gravity
        go.firework!.ay += 0.001

        // physics
        go.firework!.vx += go.firework!.ax
        go.transform!.x += go.firework!.vx
        go.firework!.vy += go.firework!.ay
        go.transform!.y += go.firework!.vy
    } else {
        gos.firework.delete(go)
    }
}

function spawnFireworks() {
    const color = Math.random() < .5 ? "firebrick" : "white"
    const x = Math.random() * canvas.width
    const y = (Math.random() ** 2) * canvas.height
    for (let i = 0; i < 10; i++) {
        const go: GameObject = {
            firework: {
                life: Math.random() * 1000,
                color,
                ax: (Math.random() - .5) * .05,
                ay: Math.random() * -.05,
                vx: 0,
                vy: 0
            },
            transform: {
                x,
                y,
                width: 10,
                height: 10
            }
        }
        gos.firework.add(go)
    }
    setTimeout(spawnFireworks, Math.random() * 400)
}

function updateGrab(go: GameObject) {
    const mouse = [...listGameObject(gos).values()].find(go => !!go.mouse)!
    go.transform!.x = mouse.transform!.x + go.grab!.dx
    go.transform!.y = mouse.transform!.y + go.grab!.dy
}

function updateMouse(go: GameObject) {
    // detect card & slot under mouse
    const { x, y } = go.transform!
    const card = [...listGameObject(gos).values()]
        .filter(go =>
            go.card
            && x >= go.transform!.x - go.transform!.width / 2
            && x < go.transform!.x + go.transform!.width / 2
            && y >= go.transform!.y - go.transform!.height / 2
            && y < go.transform!.y + go.transform!.height / 2
        )
        .sort((a, b) => a.transform!.y - b.transform!.y)
        .pop()
    const slot = [...listGameObject(gos).values()]
        .filter(go =>
            go.slot
            && x >= go.transform!.x - go.transform!.width / 2
            && x < go.transform!.x + go.transform!.width / 2
            && y >= go.transform!.y - go.transform!.height / 2
            && (go.slot!.kind === "pile" || y < go.transform!.y + go.transform!.height / 2)
        )
        .sort((a, b) => a.transform!.y - b.transform!.y)
        .pop()
    go.mouse!.targets = { card, slot }

    // move card when pressed
    const { pressed, wasPressed } = go.mouse!
    const changed = pressed !== wasPressed
    go.mouse!.wasPressed = go.mouse!.pressed
    if (changed) {
        const grabbedCard = [...listGameObject(gos).values()].find(go => !!go.grab)
        if (!grabbedCard && pressed) {
            if (card) {
                if (card.card!.faceUp) {
                    // start moving a card
                    saveGameState();
                    card.grab = {
                        dx: card.transform!.x - x,
                        dy: card.transform!.y - y,
                        stack: card.stack!
                    }
                    delete card.stack
                } else if (findSlotOfCard(card).slot!.kind === "stock"
                    && card === findTopCardOfSlot(card)) {
                    // reveal discarded card
                    card.card!.faceUp = true
                    card.stack!.previous = findTopCardOfSlot(findDiscardSlot())
                }
            } else if (slot && slot.slot!.kind === "stock") {
                // flip discard pile and move it to stock
                let stockCard = slot
                let discardedCard = findTopCardOfSlot(findDiscardSlot())
                while (discardedCard.card) {
                    const { previous } = discardedCard.stack!
                    discardedCard.card.faceUp = false
                    discardedCard.stack = {
                        previous: stockCard,
                        spaced: false
                    }
                    updateCard(discardedCard)
                    stockCard = discardedCard
                    discardedCard = previous
                }
            }
        } else if (grabbedCard && !pressed) {
            moveGrabbedCards(grabbedCard, slot)
        }
    }
}

function findDiscardSlot() {
    return [...listGameObject(gos).values()].find(go => !!go.slot && go.slot.kind === "discard")!
}


function moveGrabbedCards(grabbedCard: GameObject, newSlot?: GameObject) {
    const MOVE_CANCELLED = Symbol.for("move cancelled")
    try {
        // check if move target exists
        const topCardOfOldSlot = grabbedCard.grab!.stack.previous
        const oldSlot = findSlotOfCard(topCardOfOldSlot)
        if (!newSlot || newSlot === oldSlot)
            throw MOVE_CANCELLED

        // check if rules allow the move
        const topCardOfNewSlot = findTopCardOfSlot(newSlot)
        switch (newSlot.slot!.kind) {
            case "pile":
                if (oldSlot.slot!.kind === "stock"
                    || (topCardOfNewSlot.card
                        ? !isStackingAllowed(topCardOfNewSlot, grabbedCard)
                        : grabbedCard.card!.rank < 13))
                    throw MOVE_CANCELLED
                break
            case "stock":
                throw MOVE_CANCELLED
            case "discard":
                throw MOVE_CANCELLED
            case "foundation":
                if (oldSlot.slot!.kind === "stock")
                    throw MOVE_CANCELLED
                if (topCardOfNewSlot.card) {
                    if (grabbedCard.card!.suit !== topCardOfNewSlot.card!.suit
                        || grabbedCard.card!.rank !== topCardOfNewSlot.card!.rank + 1)
                        throw MOVE_CANCELLED
                } else {
                    if (grabbedCard.card!.rank !== 1)
                        throw MOVE_CANCELLED
                }
                break
        }

        // put card in new stack
        grabbedCard.stack = {
            previous: topCardOfNewSlot,
            spaced: newSlot.slot!.kind === "pile" && topCardOfNewSlot !== newSlot
        }

        // show last card in origin slot
        //if (topCardOfOldSlot.card && oldSlot.slot!.kind !== "stock")
        if (topCardOfOldSlot.card) {
            topCardOfOldSlot.card!.faceUp = true
        }

        // release card from grab
        delete grabbedCard.grab
    } catch (error) {
        if (error !== MOVE_CANCELLED)
            throw error

        // put card back in old stack
        grabbedCard.stack = grabbedCard.grab!.stack

        delete grabbedCard.grab
    }
}

export function findSlotOfCard(card: GameObject) {
    let slot = card
    while (slot.stack)
        slot = slot.stack.previous
    return slot
}

function findTopCardOfSlot(slot: GameObject) {
    let slotTop = slot
    while (true) {
        const above = findCardAbove(slotTop)
        if (!above)
            break
        slotTop = above
    }
    return slotTop
}

function findCardAbove(card: GameObject) {
    return [...listGameObject(gos).values()].find(go => !!(go.stack && go.stack.previous === card))
}

function isStackingAllowed(bottomCard: GameObject, topCard: GameObject) {
    // check decreasing rank and alternating color
    return topCard.card!.rank + 1 === bottomCard.card!.rank
        && isRedCard(bottomCard) !== isRedCard(topCard)
}

function isRedCard(card: GameObject) {
    switch (card.card!.suit) {
        case "HEARTS":
        case "DIAMONDS":
            return true
        default:
            return false
    }
}
