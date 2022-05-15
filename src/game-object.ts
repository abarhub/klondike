
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
        card?: GameObject,
        slot?: GameObject
    }
}

export interface Stack {
    previous: GameObject,
    spaced: boolean
}

export interface Transform {
    x: number,
    y: number,
    width: number,
    height: number
}

export class GameObject {
    card?: Card=undefined;
    firework?: Firework=undefined;
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
    cards: Set<GameObject>=new Set<GameObject>();
    discardSlot: GameObject=new GameObject();
    foundation:GameObject[]=new Array<GameObject>();
    mouseEvent:GameObject=new GameObject();
    firework:Set<GameObject>=new Set<GameObject>();
}
