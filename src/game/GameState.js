// @ts-check

import Card from "./Card.js";
import Spot from "./Spot.js";

export default class GameState {

    /** @type {Map<Card, Boolean>} */
    #cards;

    /** @type {Map<Spot, Card[]>} */
    #spots;

    /** @type {Date} */
    #date;

    /** 
     * @param {Spot[]} spots
     * @param {Card[]} cards
    */
    constructor(cards, spots) {

        this.#cards = new Map(cards.map(card => [card, card.isOpen]));

        this.#spots = new Map(spots.map(spot => [spot, [...spot.cards]]));

        this.#date = new Date();

    }

    /** @returns {Map<Card, Boolean>}  */
    getCards() {
        return new Map(this.#cards);
    }

    /** @returns {Map<Spot, Card[]>}  */
    getSpots() {

        const newMap = new Map();

        this.#spots.forEach((cards, spot) => newMap.set(spot, [...cards]) );

        return newMap;
    }

    /** @returns {Date}  */
    getDate() {
        return this.#date;
    }
}