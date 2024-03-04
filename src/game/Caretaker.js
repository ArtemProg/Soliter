// @ts-check

import GameState from "./GameState.js";
import GameScene from "../scenes/GameScene.js";

export default class Caretaker {
    
    /** @type {GameState[]} */
    #gameStates = [];

    /** @type {GameScene} */
    #mainScene;

    constructor(mainScene) {
        this.#mainScene = mainScene;
    }

    backup(description) {
        this.#gameStates.push(this.#mainScene.save());
    }

    undo() {
        if (!this.#gameStates.length) {
            return;
        }
        const gameState = this.#gameStates.pop();
        this.#mainScene.restore(gameState);
    }
}