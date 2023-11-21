import { Node } from './Node.js';

export class Sprite extends Node {
    constructor(imagePath, style = {}) {
        super('div', 'sprite');
        this.image = new Image();
        this.image.src = imagePath;
        Object.assign(this.image.style, style);
    }

    onLoad(handler) {
        this.image.onload = handler;
    }
}
