export class HTMLObject {
    constructor(el) {
        this.el = el;
    }

    getData(data) {
        return this.el.getAttribute('data-'+ data);
    }

    setData(data, value) {
        this.el.setAttribute('data-'+ data, value);
    }
}
