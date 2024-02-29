// @ts-check

import Phaser from "../lib/phaser.js";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.createBackground();
        this.preloadAssets();
    }

    create() {
        this.scene.start('Start');
    }

    preloadAssets() {
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
    }
    
    createBackground() {
        // this.add.sprite(0, 0, "bg").setOrigin(0, 0);
    }
}