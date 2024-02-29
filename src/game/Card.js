// @ts-check

import Phaser from "../lib/phaser.js";
import Spot from "./Spot.js";

export default class Card extends Phaser.GameObjects.Sprite {

    constructor(data) {

        const spot = data.spot ? data.spot: data.scene.spotStack;
        const{x, y} = spot.getPosition();

        super(data.scene, x, y, 'cards', 'back');
        this.scene = data.scene;
        this.value = data.value;
        this.isOpen = false;
        this.setInteractive({ draggable: true });
        this.scene.add.existing(this);
        this.currentSpot;
        this.setSpot(spot);
    }

    /** @param {Spot} spot */
    setSpot(spot) {
        if (spot && this.currentSpot != spot) {
            this.currentSpot = spot;
            this.currentSpot.addCard(this);
            const{x, y} = spot.getPositionCard(this);
            this.setPosition(x, y);
        }
    }

    open(callback) {
        this.isOpen = true;
        
        this.scene.input.setDraggable(this);
        
        if (callback) {
            this.flip(callback);
        } else {
            this.setTexture('cards', this.fullName);
        }

    }

    get fullName() {
        return `${this.value.suit}${this.value.order}`;
    }


    flip(callback) {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: "Linear",
            duration: 150,
            onComplete: () => {
                this.show(callback);
            }
        });
    }

    show(callback) {
        this.setTexture('cards', this.fullName);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: "Linear",
            duration: 150,
            onComplete: () => {
                if (callback) {
                    callback();
                }
            }
        });
    }

    sceneClicked(scene) {
        scene.sceneCardClicked.call(scene, this);
    }


}