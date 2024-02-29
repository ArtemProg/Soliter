// @ts-check

import Phaser from "../lib/phaser.js";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //
    }

    create() {
        this.scene.start('Preload');
    }
}