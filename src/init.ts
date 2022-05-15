import {CardObject, GameObject, GameObject2} from "./game-object.js";
import {nouvellePartie, recommencer} from "./action.js";
import {annuleAction} from "./undo.js";


// INIT

export const gos :GameObject2=new GameObject2();
export const canvas = document.getElementsByTagName("canvas")[0]
export const ctx = canvas.getContext("2d")!
export const OFFSCREEN = -1000
const randomValues: number[]=[];
let seed=Math.random()*100000;
let lastValue=0;
let lastRandomValue=seed;
const multiplier=25214903917
const add=11
const modulo=281474976710656;

function nextPseudoRandom(): number {
    lastRandomValue=(multiplier*lastRandomValue+add)%modulo
    return lastRandomValue;
}

function initRandom(): void{
    lastValue=0
    lastRandomValue=seed;
    while(randomValues.length>0) {
        randomValues.pop();
    }
    for(let i=0;i<200;i++){
        let value=nextPseudoRandom()
        randomValues.push(value/modulo);
    }
}

function getRandom(): number{
    const value=randomValues[lastValue];
    lastValue=(lastValue+1)%randomValues.length;
    return value;
}

// create cards
function createCards(){
    gos.cards.clear()
    for (const suit of ["SPADES", "HEARTS", "CLUBS", "DIAMONDS"])
        for (let rank = 1; rank <= 13; ++rank)
            gos.cards.add({
                card: {
                    suit,
                    rank,
                    faceUp: false
                },
                transform: {
                    x: OFFSCREEN,
                    y: OFFSCREEN,
                    width: 100,
                    height: 150
                }
            })
}

// deal cards
function dealCard(): void {
    const shuffledDeck = [...gos.cards.values()].sort((a, b) => getRandom() - .5)
    for (let pile = 1; pile <= 7; ++pile) {
        let previous: CardObject = {
            slot: {
                kind: "pile",
                pile
            },
            transform: {
                x: pile * 120 - 50,
                y: 300,
                width: 100,
                height: 150
            }
        }
        gos.cards.add(previous)
        for (let position = 1; position <= pile; ++position) {
            const card = shuffledDeck.pop()!
            card.stack = {
                previous,
                spaced: position > 1
            }
            previous = card
        }
        previous.card!.faceUp = true
    }
    let previous: CardObject = {
        slot: {
            kind: "stock"
        },
        transform: {
            x: 70,
            y: 100,
            width: 100,
            height: 150
        }
    }
    gos.cards.add(previous)
    for (const card of shuffledDeck) {
        card.stack = {
            previous,
            spaced: false
        }
        previous = card
    }
}

// create discard slot
function createDiscardSlot(): void{
    const go: GameObject = {
        slot: {
            kind: "discard"
        },
        transform: {
            x: 190,
            y: 100,
            width: 100,
            height: 150
        }
    }
    gos.discardSlot=go;
}

// create foundation
function createFoundation(): void{
    for (let foundation = 1; foundation <= 4; ++foundation) {
        const go: GameObject = {
            slot: {
                kind: "foundation",
                foundation
            },
            transform: {
                x: 120 * foundation + 310,
                y: 100,
                width: 100,
                height: 150
            }
        }
        gos.foundation.push(go)
    }
}

// watch mouse events
function watchMouseEvents(): void {
    const go: GameObject = {
        mouse: {
            pressed: false,
            wasPressed: false,
            targets: {}
        },
        transform: {
            x: OFFSCREEN,
            y: OFFSCREEN,
            width: 1,
            height: 1
        }
    }
    gos.mouseEvent=go;
    addEvent(go);
}

export function addEvent(go: GameObject){
    canvas.addEventListener("mousedown", event => {
        go.mouse!.pressed = true
        event.preventDefault()
    })
    canvas.addEventListener("mouseup", event => {
        go.mouse!.pressed = false
        event.preventDefault()
    })
    canvas.addEventListener("mousemove", event => {
        go.transform!.x = event.offsetX / canvas.offsetWidth * canvas.width
        go.transform!.y = event.offsetY / canvas.offsetHeight * canvas.height
        event.preventDefault()
    })
    canvas.addEventListener("touchstart", event => {
        go.mouse!.pressed = true
        const { left, top } = canvas.getBoundingClientRect()
        go.transform!.x = (event.touches[0].clientX - left) / canvas.offsetWidth * canvas.width
        go.transform!.y = (event.touches[0].clientY - top) / canvas.offsetHeight * canvas.height
        event.preventDefault()
    })
    canvas.addEventListener("touchmove", event => {
        const { left, top } = canvas.getBoundingClientRect()
        go.transform!.x = (event.touches[0].clientX - left) / canvas.offsetWidth * canvas.width
        go.transform!.y = (event.touches[0].clientY - top) / canvas.offsetHeight * canvas.height
        event.preventDefault()
    })
    canvas.addEventListener("touchend", event => {
        go.mouse!.pressed = false
        event.preventDefault()
    })
    canvas.addEventListener("touchcancel", event => {
        go.mouse!.pressed = false
        event.preventDefault()
    })
}

function initDisplay(): void {
    let elt=document?.getElementById("seedValue")
    if(elt) {
        elt.innerHTML = "Seed : " + seed;
    }
}

function initBouton() {
    if(document) {
        document.querySelector('#nouvellePartie')?.addEventListener('click', nouvellePartie);
        document.querySelector('#recommencer')?.addEventListener('click', recommencer);
        document.querySelector('#annuler')?.addEventListener('click', annuleAction);
    }

}

export function initialize(reinitRandom: boolean): void {
    if(reinitRandom) {
        seed=Math.random()
        initRandom()
    } else {
        lastValue=0;
    }
    initDisplay()
    createCards()
    dealCard()
    createDiscardSlot()
    createFoundation()
    watchMouseEvents()
    initBouton();
}



