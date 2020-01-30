
import APATE from '../apate';

/* globals window, EVENT, HTMLElement, fetch, customElements */


APATE.namespace('APATE.utils');


export default APATE.utils.LinkTemplate = class extends HTMLElement {

    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._initialized) {
            return;
        }
        if (oldValue !== newValue) {
            this[name] = newValue;
        }
    }

    get src() {
        return this.getAttribute('src');
    }

    set src(value) {
        this.setAttribute('src', value);
        this.setSrc();
        this.render();
    }

    constructor() {
        super();
        this._template = '';
        this._path = '';
        this._initialized = false;
    }

    async connectedCallback() {
        if (this.hasAttribute('src')) {
            await this.setSrc();
        }

        if (this.hasAttribute('context')) {
            await this.setContext();
        }

        this.render();
        this._initialized = true;
        // dispatch event
        window.EventBus.dispatchEvent(EVENT.TEMPLATE_LOADED, { path: this._path });
    }

    async setSrc() {
        this._path = this.getAttribute('src');
        this._template = await APATE.utils.LinkTemplate.fetchSrc(this._path);
    }

    static async fetchSrc(src) {
        const response = await fetch(src);
        if (response.status !== 200) {
            throw Error(`template-link ${response.status}: ${response.statusText}`);
        }
        return response.text();
    }

    render() {
        this.innerHTML = this._template;
    }

};

customElements.define('link-template', APATE.utils.LinkTemplate);
