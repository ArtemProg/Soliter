// @ts-check

import Phaser from "../lib/phaser.js";
import Card from "../game/Card.js";
import Spot from "../game/Spot.js";
import SpotDump from "../game/SpotDump.js";
import SpotStack from "../game/SpotStack.js";
import SpotsResults from "../game/SpotsResults.js";
import SpotTemp from "../game/SpotTemp.js";
//import { Math } from "phaser";

export default class GameScene extends Phaser.Scene {
    
    /** @type {SpotDump} */
    spotDump;

    /** @type {SpotStack} */
    spotStack;

    /** @type {SpotsResults[]} */
    spotsResults = [];

    /** @type {SpotTemp[]} */
    spotsTemp = [];

    /** @type {Card[]} */
    cards = [];

    constructor() {
        super('Game');
    }

    init() {
        this.cardSize = {width: 140, height: 190};
    }

    create() {
        this.createBackground();
        this.createSpots();
        this.createCards();
        this.initEventDrag();

        this.input.on("gameobjectdown", this.onCardClicked, this);
    }

    createBackground() {
        //
    }

    createSpots() {
        
        const distance = 20;

        this.spotDump = new SpotDump(this, 5 * this.cardSize.width + (distance * 2) * 5 + distance, distance, this.cardClickSpotAnother);
        this.spotStack = new SpotStack(this, 6 * this.cardSize.width + (distance * 2) * 6 + distance, distance, this.cardClickSpotStack);

        //this.spotStack = new SpotStack(this, this.scale.width - this.cardSize.width, distance);
        //this.spotStack = new SpotStack(this, 7 * this.cardSize.width + (distance * 2) * 7 / 2 + distance, distance);
        
        for (let i = 0, x = distance; i < 4; i++, x += (distance * 2)) {
            this.spotsResults.push(new SpotsResults(this, i * this.cardSize.width + x, distance, this.cardClickSpotAnother));
        }
        
        for (let i = 0, x = distance; i < 7; i++, x += (distance * 2)) {
            this.spotsTemp.push(new SpotTemp(this, i * this.cardSize.width + x, this.cardSize.height + distance * 4, this.cardClickSpotTemp));
        }
    }

    createCards() {

        this.settingCards = {
            order: ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'],
            suits: ['clubs', 'diamonds', 'hearts', 'spades'],
            overlap: {
                'diamonds': ['clubs', 'spades'],
                'hearts': ['clubs', 'spades'],
                'clubs': ['diamonds', 'hearts'],
                'spades': ['diamonds', 'hearts'],
            },
        };

        /** @type {{suit: string, order: string}[]} */
        let cards = [];

        this.settingCards.suits.forEach(suit => {
            this.settingCards.order.forEach(order => {
                cards.push( { suit, order } );
            });
        });
        Phaser.Utils.Array.Shuffle(cards);

        let currentIndex = 0;
        let currentSpot;

        for (let i = 0; i < this.spotsTemp.length; i++) {
            currentSpot = this.spotsTemp[i];
            for (let j = 0; j < i + 1; j++, currentIndex++) {
                this.cards.push(new Card({
                    scene: this,
                    spot: currentSpot,
                    value: cards[currentIndex],
                }));
            }
            this.spotsTemp[i].cards[i].open();
        }
        currentSpot = this.spotStack;
        while(currentIndex < cards.length) {
            this.cards.push(new Card({
                scene: this,
                spot: currentSpot,
                value: cards[currentIndex],
            }));
            currentIndex++;
        }


        // cards.forEach(nameCard => {

        //     this.cards.push(new Card({
        //         scene: this,
        //         spot: currentSpot,
        //         x: position.x,
        //         y: position.y,
        //         texture: 'cards',
        //         //frame: 'back',
        //         frame: nameCard,
        //         value: nameCard,
        //     }));

        // });
        
    }

    initEventDrag() {
        
        //this.input.setDraggable(this.cards);

        let index = 0;

        
        let container = this.add.container();
        this.children.bringToTop(container); // перемещаем на верхний уровень (поверх всех)

        const pointXY = {x: 0, y: 0};

        this.input.on('dragstart',
            /** 
             * @param {Phaser.Input.Pointer} pointer
             * @param {Card} gameObject
            */
            (pointer, gameObject) => {

            if (!gameObject.isOpen) {
                return;
            }

            index = this.children.getIndex(gameObject);

            //this.children.bringToTop(gameObject); // перемещаем на верхний уровень (поверх всех)

            const indexCard = gameObject.currentSpot.cards.indexOf(gameObject);
            const arr = gameObject.currentSpot.cards.slice(indexCard);
            
            container.removeAll();
            container.x = 0;
            container.y = 0;
            container.add(arr);

            this.children.bringToTop(container); // перемещаем на верхний уровень (поверх всех)
            
            // Запоминаем координаты центра объекта относительно игрового поля
            pointXY.x = gameObject.x;
            pointXY.y = gameObject.y;

            const posXY = gameObject.currentSpot.getPositionCard(gameObject);
            
        });

        const cardTexture = this.cardSize; //this.textures.get("card").getSourceImage();
        const range = {
            minX: cardTexture.width / 2,
            maxX: this.scale.width - cardTexture.width / 2,
            minY: cardTexture.height / 2,
            maxY: this.scale.height - cardTexture.height / 2,
        };

        /** @type {undefined | Spot} */
        let selectedSpot;
        this.input.on('drag',
            /** 
             * @param {Phaser.Input.Pointer} pointer
             * @param {Card} gameObject
             * @param {number} dragX
             * @param {number} dragY
            */
            (pointer, gameObject, dragX, dragY) => {

            if (!gameObject.isOpen) {
                return;
            }

            // Предпологаемый центр карты с учетом границ экрана
            const x = Math.round(Phaser.Math.Clamp(dragX, range.minX, range.maxX));
            const y = Math.round(Phaser.Math.Clamp(dragY, range.minY, range.maxY));

            // Позиция группы с учетом смещения основной перетягиваемой карты
            container.x = Math.round(x - pointXY.x);
            container.y = Math.round(y - pointXY.y);

            //console.log(`${Math.round(x)}, y: ${Math.round(y)} / x: ${Math.round(container.x)}, y: ${Math.round(container.y)}`);

            /** @param {Spot[]} spots */
            const activeSpot = (spots) => {
                
                /** @type {undefined | {spot: Spot, square: number}} */
                let selected;
                
                const objectInfo = {x, y , width: gameObject.width, height: gameObject.height};

                spots.forEach(spot => {
                    if (!spot.isTemp() && container.list.length > 1) {
                        return;
                    }

                    if (spot.intersection(objectInfo)) {

                        if (gameObject.currentSpot != spot) {
                            const validСards = spot.nextValueCard();
                            if(!validСards.includes(gameObject.fullName)) {
                                return;
                            }
                        }

                        let square = spot.intersectionSquare(objectInfo);
                        if (!selected || square > selected.square) {
                            if (selectedSpot) {
                                selectedSpot.setActivity(false);
                                selectedSpot = undefined;
                            }
                            selected = { spot, square };
                        };
                    }
                });
                if (selectedSpot) {
                    selectedSpot.setActivity(false);
                    selectedSpot = undefined;
                }
                if (selected) {
                    selectedSpot = selected.spot;
                    selectedSpot.setActivity(true);

                    

                }
            }

            activeSpot(this.spotsResults);
            if (!selectedSpot) {
                activeSpot(this.spotsTemp);
            }

        });

        this.input.on('dragend',
            /** 
             * @param {Phaser.Input.Pointer} pointer
             * @param {Card} gameObject
            */
            (pointer, gameObject) => {

            if (!gameObject.isOpen) {
                return;
            }
            
            if (selectedSpot) {

                if (gameObject.currentSpot != selectedSpot) {
                    gameObject.currentSpot.removeCard(gameObject);
                }

                container.list.forEach(
                    /** @param {Card} card */
                    card => {
                    card.setSpot(selectedSpot);
                });

                selectedSpot.setActivity(false);
                selectedSpot = undefined;
            }

            if (gameObject.currentSpot && 0) {
                const droPosition = gameObject.currentSpot.getPositionCard(gameObject);

                this.tweens.add({
                    targets: gameObject,
                    x: droPosition.x,
                    y: droPosition.y,
                    delay: 50,
                    ease: "Linear",
                    duration: 150,
                    // onComplete: () => {
                    //     if (params.callback) {
                    //         params.callback();
                    //     }
                    // }
                });
            }

            container.removeAll();

            //this.children.moveTo(gameObject, index); // перемещение на прежний уровень

        });
    }

    /** 
     * @param {Phaser.Input.Pointer} pointer
     * @param {Card|Spot} gameObject
    */
    onCardClicked(pointer, gameObject) {
        gameObject.sceneClicked(this);
    }

    /** @param {Spot} spot */
    sceneSpotClicked(spot) {
        if (spot === this.spotStack && spot.cards.length === 0) {

            this.spotDump.cards.forEach(card => card.setVisible(false));
            
            let card =  this.spotDump.cards.pop();
            card.setVisible(true);
            this.children.bringToTop(card);

            const startPosXY = this.spotDump.getPosition();
            const endPosXY = this.spotStack.getPosition();

            //---
            const flip = (callback) => {
                this.tweens.add({
                    targets: card,
                    x: Math.round(endPosXY.x + (startPosXY.x - endPosXY.x) / 2),
                    y: Math.round(endPosXY.y + (startPosXY.y - endPosXY.y) / 2),
                    scaleX: 0,
                    //delay: 50,
                    ease: "Linear",
                    duration: 150,
                    onComplete: () => {
                        show(callback);
                    }
                });
            }

            const show = (callback) => {
                card.setTexture('cards', 'back');
                this.tweens.add({
                    targets: card,
                    x: endPosXY.x,
                    y:endPosXY.y,
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

            flip(() => {
                this.spotDump.removeCard(card);
                card.setSpot(this.spotStack);
                card.isOpen = false;
                this.input.setDraggable(card, false);

                const arr = this.spotDump.cards;
                while (arr.length) {
                    card = arr.pop();
                    card.setVisible(false);
                    this.children.bringToTop(card);
                    card.setSpot(this.spotStack);
                    card.isOpen = false;
                    card.setTexture('cards', 'back');
                    this.input.setDraggable(card, false);
                }

                this.spotStack.cards.forEach(card => card.setVisible(true));

            });
            //---


        }
    }

    /** @param {Card} card */
    sceneCardClicked(card) {
        card.currentSpot.cardClicked(card);
    }

    /** 
     * @param {Spot} spot
     * @param {Card} card
    */
    cardClickSpotStack(spot, card) {
        
        this.children.bringToTop(card);

        const startPosXY = this.spotStack.getPosition();
        const endPosXY = this.spotDump.getPosition();

        const flip = (callback) => {
            this.tweens.add({
                targets: card,
                x: Math.round(endPosXY.x + (startPosXY.x - endPosXY.x) / 2),
                y: Math.round(endPosXY.y + (startPosXY.y - endPosXY.y) / 2),
                scaleX: 0,
                //delay: 50,
                ease: "Linear",
                duration: 150,
                onComplete: () => {
                    show(callback);
                }
            });
        }

        const show = (callback) => {
            card.setTexture('cards', card.fullName);
            this.tweens.add({
                targets: card,
                x: endPosXY.x,
                y:endPosXY.y,
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
        
        flip(() => {
            this.spotStack.removeCard(card);
            card.setSpot(this.spotDump);

            card.isOpen = true;
        
            this.input.setDraggable(card);
        });
    }

    /** 
     * @param {Spot} spot
     * @param {Card} card
    */
    cardClickSpotTemp(spot, card) {
        if (card.isOpen) {
            //
        } else if (spot.currentCard() === card) {
            card.open(() => {});
        }
    }

    cardClickSpotAnother(spot, card) {
        console.log('Another', spot, card);
    }

}