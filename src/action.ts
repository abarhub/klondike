import {initialize} from "./init.js";

// ACTION

export function nouvellePartie() {
    initialize(true);
}

export function recommencer() {
    initialize(false);
}
