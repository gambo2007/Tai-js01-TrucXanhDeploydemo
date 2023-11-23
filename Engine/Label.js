import { Node } from './Node.js';

export class Label extends Node {
    constructor(text, style = {}) {
        super('div', 'label');
        this.element.textContent = text;
        Object.assign(this.element.style, style);
        console.log('Label initialized.');
    }

    static createMessage(text, color) {
        return new Label(text, {
            fontSize: '45px',
            fontFamily: 'sans-serif',
            color: color,
            textAlign: 'center',
            textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff',
            position: 'absolute',
            width: 'max-content',
            height: 'max-content',
            
        });
    }
}
