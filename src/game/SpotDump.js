// @ts-check

import Card from "./Card.js";
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

    /** @param {Card} card */
    getPositionCard(card) {
        let position = super.getPosition();

        const index = this.cards.indexOf(card);

        const distance = 17;

        if (this.cards.length === 2  && index === this.cards.length - 1) {
            return {
                x: position.x + distance * 2,
                y: position.y
            };
        } else if (this.cards.length > 2 && (index === this.cards.length - 1 || index === this.cards.length - 2)) {
            return {
                x: position.x + distance * (index === this.cards.length - 1 ? 4 : 2),
                y: position.y
            };
        }

        return position;        
        
    }
}