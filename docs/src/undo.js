// function cloneObject(obj:any) {
//     var clone = {};
//     for(var i in obj) {
//         if(typeof(obj[i])=="object" && obj[i] != null)
//             clone[i] = cloneObject(obj[i]);
//         else
//             clone[i] = obj[i];
//     }
//     return clone;
// }
import { GameObject, GameObject2 } from "./game-object.js";
import { addEvent, gos } from "./init.js";
const lastGameState = new Array();
// function clone(obj: any) {
//     if (null == obj || "object" != typeof obj) return obj;
//     var copy = obj.constructor();
//     for (var attr in obj) {
//         if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
//     }
//     return copy;
// }
// function deepCopy<T>(source: T): T {
//     return Array.isArray(source)
//         ? source.map(item => deepCopy(item))
//         : source instanceof Date
//             ? new Date(source.getTime())
//             : source && typeof source === 'object'
//                 ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
//                     Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
//                     o[prop] = deepCopy((source as { [key: string]: any })[prop]);
//                     return o;
//                 }, Object.create(Object.getPrototypeOf(source)))
//                 : source as T;
// }
function deepCopy2(source) {
    const res = new GameObject();
    if (source.mouse) {
        res.mouse = {
            pressed: source.mouse.pressed,
            wasPressed: source.mouse.wasPressed,
            targets: {}
        };
        if (source.mouse.targets) {
            if (source.mouse.targets.slot) {
                res.mouse.targets.slot = deepCopy2(source.mouse.targets.slot);
            }
            if (source.mouse.targets.card) {
                res.mouse.targets.card = deepCopy2(source.mouse.targets.card);
            }
        }
    }
    if (source.transform) {
        res.transform = {
            x: source.transform.x,
            y: source.transform.y,
            width: source.transform.width,
            height: source.transform.height
        };
    }
    if (source.card) {
        res.card = {
            suit: source.card.suit,
            rank: source.card.rank,
            faceUp: source.card.faceUp
        };
    }
    if (source.slot) {
        switch (source.slot.kind) {
            case "pile":
                res.slot = {
                    kind: source.slot.kind,
                    pile: source.slot.pile
                };
                break;
            case "stock":
                res.slot = {
                    kind: source.slot.kind
                };
                break;
            case "discard":
                res.slot = {
                    kind: source.slot.kind
                };
                break;
            case "foundation":
                res.slot = {
                    kind: source.slot.kind,
                    foundation: source.slot.foundation
                };
                break;
        }
    }
    if (source.stack) {
        res.stack = {
            previous: deepCopy2(source.stack.previous),
            spaced: source.stack.spaced
        };
    }
    return res;
}
function deepCopy3(source) {
    const clone = deepCopy2(source);
    if (clone.mouse) {
        clone.mouse.pressed = false;
        clone.mouse.wasPressed = false;
        clone.mouse.targets = {};
        //addEvent(clone);
    }
    return clone;
}
function copy(gos) {
    const res = new GameObject2();
    for (let tmp of gos.cards) {
        res.cards.add(deepCopy3(tmp));
    }
    for (let tmp of gos.foundation) {
        res.foundation.push(deepCopy3(tmp));
    }
    for (let tmp of gos.firework) {
        res.firework.add(deepCopy3(tmp));
    }
    res.discardSlot = deepCopy3(gos.discardSlot);
    res.mouseEvent = deepCopy3(gos.mouseEvent);
    return res;
}
export function saveGameState() {
    while (lastGameState.pop() != null) {
    }
    const tmp = copy(gos);
    lastGameState.push(tmp);
}
export function annuleAction() {
    const tmp = lastGameState.pop();
    if (tmp) {
        addEvent(tmp.mouseEvent);
        Object.assign(gos, tmp);
    }
}
