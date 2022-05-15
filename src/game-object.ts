export interface GameObject {
    card?: {
        suit: string,
        rank: number,
        faceUp: boolean
    },
    firework?: {
        life: number,
        color: string,
        ax: number,
        ay: number,
        vx: number,
        vy: number
    },
    grab?: {
        dx: number,
        dy: number,
        stack: GameObject["stack"] & {}
    },
    mouse?: {
        pressed: boolean,
        wasPressed: boolean,
        targets: {
            card?: GameObject,
            slot?: GameObject
        }
    },
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
    },
    stack?: {
        previous: GameObject,
        spaced: boolean
    },
    transform?: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}
