// @ts-check

import Phaser from "../lib/phaser.js";
import Card from "./Card.js";

export default class Spot extends Phaser.GameObjects.Graphics {
    
    /** @type {Phaser.Scene} */
    scene;

    /** @type {number} */
    width;

    /** @type {number} */
    height;

    /** @type {Card[]} */
    cards;

    onCardClicked;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scene, x, y, onCardClicked) {
        super(scene, {x, y});
        
        this.onCardClicked = onCardClicked;

        this.cardSize = {width: 140, height: 190};
        
        this.scene = scene;
        this.width =  this.cardSize.width + 10;
        this.height =  this.cardSize.height + 10;
        this.init();
        this.scene.add.existing(this);
        this.cards = [];
    }

    init() {
        this.fillStyle(0xF5F6F7, 0.5);
        this.fillRect(0, 0, this.width, this.height);
    }

    /** @param {boolean} active */
    setActivity(active) {
        this.clear();
        if (active) {
            this.fillStyle(0xCCFF33, 0.7);
        } else {
            this.fillStyle(0xF5F6F7, 0.5);
        }
        this.fillRect(0, 0, this.width, this.height);
    }

    /** @param {{x: number, y: number, width: number, height: number}} card */
    intersection(card) {
        return this.x + this.width > card.x - card.width / 2
            && card.x + card.width / 2 > this.x
            && this.y + this.height > card.y - card.height / 2
            && card.y + card.height / 2 > this.y;
    }

    /** @param {{x: number, y: number, width: number, height: number}} card */
    intersectionSquare(card) {
        const left = Math.max(this.x, card.x - card.width / 2);
        const top = Math.min(this.y, card.y - card.height / 2);
        const right = Math.min(this.x + this.width, card.x + card.width / 2);
        const bottom = Math.max(this.y + this.height, card.y + card.height / 2);

        const width = right - left;
        const height = bottom - top;

        if (width < 0 || height < 0) {
            return 0;
        }

        return width * height;
    }

    getPosition() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
        };
    }

    /** @param {Card} card */
    getPositionCard(card) {
        return this.getPosition();
    }

    /** @param {Card} card */
    addCard(card) {
        this.cards.push(card);
    }

    /** @param {Card} card */
    /** @returns {Card[]} */
    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index === -1) {
            return [];
        }
        const cards = this.cards.slice(index);
        this.cards = this.cards.slice(0, index);
        return cards;
    }

    isTemp() {
        return false;
    }

    currentCard() {
        return this.cards[this.cards.length - 1];
    }

    nextValueCard() {
        
        const settingCards = this.scene.settingCards;

        const order = settingCards.order[this.cards.length];

        const array = [];

        if (this.cards.length === 0) {
            
            settingCards.suits.forEach(suit => {
                array.push(`${suit}${order}`);
            });

        } else if (this.cards.length === settingCards.order.length) {

        } else {

            const valueCard = this.currentCard().value;

            array.push(`${valueCard.suit}${order}`);

        }

        return array;
    }

    cardClicked(card) {
        if (this.onCardClicked) {
            this.onCardClicked.call(this.scene, this, card);
        }
    }

    sceneClicked(scene) {
        scene.sceneSpotClicked.call(scene, this);
    }

}