import {GameObject} from "./game-object.js";
import {canvas, ctx, gos, initialize} from "./init.js";
import {findSlotOfCard, update} from "./update.js";
import {render} from "./render.js";
import {nouvellePartie, recommencer} from "./action.js";


// INIT

initialize(true)

// UPDATE

// RENDER

// ACTION

// RUN

requestAnimationFrame(function run() {
  update()
  render()
  requestAnimationFrame(run)
})

