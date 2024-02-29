// @ts-check

import Phaser from "./lib/phaser.js";
import BootScene from "./scenes/BootScene.js";
import PreloadScene from "./scenes/PreloadScene.js";
import StartScene from "./scenes/StartScene.js";
import GameScene from "./scenes/GameScene.js";

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 1024,
    scene: [BootScene, PreloadScene, StartScene, GameScene],
});