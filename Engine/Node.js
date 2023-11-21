export class Node {
    constructor(tagName, className, style = {}) {
        this.element = document.createElement(tagName);
        this.element.className = className;
        Object.assign(this.element.style, style);
    }

    appendTo(parent) {
        parent.appendChild(this.element);
    }

    addEventListener(event, handler) {
        this.element.addEventListener(event, handler);
    }

    removeEventListener(event, handler) {
        this.element.removeEventListener(event, handler);
    }
}
