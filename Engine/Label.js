import { Node } from './Node.js';

export class Label extends Node {
    constructor(text, style = {}) {
        super('div', 'label');
        this.element.textContent = text;
        Object.assign(this.element.style, style);
        console.log('Label initialized.');
    }
}
