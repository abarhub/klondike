export class FireworkObject {
    constructor() {
        this.firework = undefined;
        this.transform = undefined;
    }
}
export class CommonObject {
    constructor() {
        this.stack = undefined;
        this.transform = undefined;
        this.grab = undefined;
    }
}
export class CardObject extends CommonObject {
    constructor() {
        super(...arguments);
        this.card = undefined;
        this.slot = undefined;
    }
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
    constructor() {
        //card?: Card=undefined;
        //firework?: Firework=undefined;
        this.grab = undefined;
        this.mouse = undefined;
        this.slot = undefined;
        this.stack = undefined;
        this.transform = undefined;
    }
}
export class GameObject2 {
    constructor() {
        this.cards = new Set();
        this.discardSlot = new GameObject();
        this.foundation = new Array();
        this.mouseEvent = new GameObject();
        this.firework = new Set();
    }
}
