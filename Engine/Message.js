import { Node } from './Node.js';

export class Message extends Node {
    constructor(text, color) {
        super('div', 'message');
        this.element.textContent = text;
        this.element.style.fontSize = '45px';
        this.element.style.fontFamily = 'sans-serif';
        this.element.style.color = color;
        this.element.style.textAlign = 'center';
        this.element.style.textShadow = '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff';

        this.element.style.position = 'absolute';
        this.element.style.left = '50%';
        this.element.style.top = '50%';
        this.element.style.transform = 'translate(50%, 620%)';
        this.element.style.width = 'max-content'; 
        this.element.style.height = 'max-content';  
    }

}
