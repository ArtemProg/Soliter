// @ts-check

import Phaser from "../lib/phaser.js";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {
        this.scene.start('Game');
    }
}