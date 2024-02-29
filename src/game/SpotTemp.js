// @ts-check

import Card from "./Card.js";
import Spot from "./Spot.js";

export default class SpotTemp extends Spot {
    init1() {
        // this.lineStyle(3, 0xF5F6F7, 0.5);
        // this.strokeRoundedRect(0, 0,
        //     config.cards.size.width, config.cards.size.height);
    }

    setActivity1(active) {
        this.clear();
        if (active) {
            this.lineStyle(5, 0xCCFF33, 0.7);
        } else {
            this.lineStyle(3, 0xF5F6F7, 0.5);
        }
        this.strokeRoundedRect(0, 0,
            this.width, this.height);
    }

    getPosition() {
        let position = super.getPosition();

        return {
            x: position.x,
            y: position.y + (this.cards.length ? (this.cards.length - 1) * 35 : 0),
        };
    }

    /** @param {Card} card */
    getPositionCard(card) {
        let position = super.getPosition();

        const index = this.cards.indexOf(card);

        if (index < 1) {
            return position;
        }
        
        return {
            x: position.x,
            y: position.y + index * 35
        };
    }


    /** @param {{x: number, y: number, width: number, height: number}} card */
    intersection(card) {
        return this.x + this.width > card.x - card.width / 2
            && card.x + card.width / 2 > this.x
            && this.scene.scale.height > card.y - card.height / 2
            && card.y + card.height / 2 > this.y;
    }

    /** @param {{x: number, y: number, width: number, height: number}} card */
    intersectionSquare(card) {
        const left = Math.max(this.x, card.x - card.width / 2);
        const top = Math.min(this.y, card.y - card.height / 2);
        const right = Math.min(this.x + this.width, card.x + card.width / 2);
        const bottom = Math.max(this.scene.scale.height, card.y + card.height / 2);

        const width = right - left;
        const height = bottom - top;

        if (width < 0 || height < 0) {
            return 0;
        }

        return width * height;
    }

    isTemp() {
        return true;
    }

    nextValueCard() {
        
        const settingCards = this.scene.settingCards;

        const order = settingCards.order[settingCards.order.length - 1];

        const array = [];

        if (this.cards.length === 0) {
            
            settingCards.suits.forEach(suit => {
                array.push(`${suit}${order}`);
            });

        } else {

            const valueCard = this.currentCard().value;

            const index = settingCards.order.indexOf(valueCard.order);
            if (index > 0) {
                settingCards.overlap[valueCard.suit].forEach(suit => {
                    array.push(`${suit}${settingCards.order[index - 1]}`);
                });
            }
        }

        return array;
    }

}