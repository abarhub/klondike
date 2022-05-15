import {initialize} from "./init.js";
import {update} from "./update.js";
import {render} from "./render.js";


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

