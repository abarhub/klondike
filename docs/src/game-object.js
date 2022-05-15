export class GameObject {
    constructor() {
        this.card = undefined;
        this.firework = undefined;
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
