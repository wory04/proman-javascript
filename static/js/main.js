import { dom } from "./dom.js";
import { reglog } from "./reglog.js";

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();
    // init reglog
    reglog.init();

}

init();
