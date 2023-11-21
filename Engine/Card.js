import { Node } from './Node.js';
import { Sprite } from './Sprite.js';

export class Card extends Node {
    constructor(cardNumber, frontImagePath, imagePath, flipCardHandler) {
        super('div', 'card');
        this.element.dataset.index = cardNumber;
        this.element.dataset.initialValue = cardNumber;
        this.element.style.width = '100px';
        this.element.style.height = '100px';
        this.element.style.border = '1px solid blue';
        this.element.style.backgroundSize = 'cover';
        this.element.style.cursor = 'pointer';
        this.element.style.textAlign = 'center';
        this.element.style.lineHeight = '100px';

        // Use Sprite for the back image
        this.imageSprite = new Sprite(`images/${imagePath}`);
        this.imageSprite.appendTo(this.element);

        // Use Sprite for the front image
        this.frontImageSprite = new Sprite(`images/${frontImagePath}`);
        this.frontImageSprite.appendTo(this.element);

        this.flipCardHandler = flipCardHandler.bind(this); // Ensure proper binding
        this.element.addEventListener('click', () => this.flipCardHandler(cardNumber));
    }

    async setBackgroundImage() {
        await this.frontImageSprite.onLoad();
        this.element.style.backgroundImage = `url(${this.frontImageSprite.image.src})`;
    }

    setInnerHTML(html) {
        this.element.innerHTML = html;
    }
}
