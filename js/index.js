
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/app.scss';
import jQuery from 'jquery/dist/jquery';
import './utils/injectormanager';
import './utils/link-template';
import EventBus from './utils/eventbus';

import APATEApp from './app';
// components
import './components/form-open';

import '@material/typography/dist/mdc.typography.css';

/* globals window, document, $, navigator */

// eventbus event names
window.EVENT = {
    TEMPLATE_LOADED: 'template-loaded',
    FORM_OPEN_SHOW: 'form-open-show',
    OPEN_FILE: 'open-file',



};
// global eventbus
window.EventBus = new EventBus();


window.jQuery = jQuery;
window.$ = jQuery;


// window.InjectorManager = new InjectorManager();

const app = new APATEApp();
$(document).ready(app.init.bind(app));


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js', {
        scope: '.',
    }).then((registration) => {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
}
