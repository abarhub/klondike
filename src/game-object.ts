
export interface Card {
    suit: string,
    rank: number,
    faceUp: boolean
}

export interface Firework{
    life: number,
    color: string,
    ax: number,
    ay: number,
    vx: number,
    vy: number
}

export interface Grab{
    dx: number,
    dy: number,
    stack: Stack & {}
}

export interface Mouse {
    pressed: boolean,
    wasPressed: boolean,
    targets: {
        card?: CardObject,
        slot?: GameObject
    }
}

export interface Stack {
    previous: CardObject,
    spaced: boolean
}

export interface Transform {
    x: number,
    y: number,
    width: number,
    height: number
}

export class FireworkObject {
    firework?: Firework=undefined;
    transform?: Transform=undefined;
}

export abstract class CommonObject{
    stack?: Stack=undefined;
    transform?: Transform=undefined;
    grab?: Grab=undefined;
}

export class CardObject extends CommonObject{
    card?: Card=undefined;
    slot?: {
        kind: "pile",
        pile: number
    } | {
        kind: "stock"
    } | {
        kind: "discard"
    } | {
        kind: "foundation",
        foundation: number
    }=undefined;
}

// export class SlotObject extends CommonObject {
//     card?: Card=undefined;
//     slot?: {
//         kind: "pile",
//         pile: number
//     } | {
//         kind: "stock"
//     } | {
//         kind: "discard"
//     } | {
//         kind: "foundation",
//         foundation: number
//     }=undefined;
// }

export class GameObject {
    //card?: Card=undefined;
    //firework?: Firework=undefined;
    grab?: Grab=undefined;
    mouse?: Mouse=undefined;
    slot?: {
        kind: "pile",
        pile: number
    } | {
        kind: "stock"
    } | {
        kind: "discard"
    } | {
        kind: "foundation",
        foundation: number
    }=undefined;
    stack?: Stack=undefined;
    transform?: Transform=undefined;
}

export class GameObject2 {
    cards: Set<CardObject>=new Set<CardObject>();
    discardSlot: GameObject=new GameObject();
    foundation:GameObject[]=new Array<GameObject>();
    mouseEvent:GameObject=new GameObject();
    firework:Set<FireworkObject>=new Set<FireworkObject>();
}
