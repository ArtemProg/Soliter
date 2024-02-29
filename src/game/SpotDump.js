// @ts-check

import Spot from "./Spot.js";

export default class SpotDump extends Spot {
    init1() {

        //this.cardSize = {width: 140, height: 190};

        this.lineStyle(10, 0xF5F6F7, 0.5);
        this.strokeCircle(
            this.cardSize.width / 4,
            this.cardSize.height / 2,
            this.cardSize.width / 4);
    }

    setActivity(active) {
        
    }

    getPosition1() {
        return {
            x: this.x + this.cardSize.width / 4,
            y: this.y + this.cardSize.height / 2,
        };
    }
}