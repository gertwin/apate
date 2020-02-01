
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
import './components/form-save';
import './components/message-box';

import '@material/typography/dist/mdc.typography.css';

/* globals window, document, $, navigator */

// global eventbus
window.EventBus = new EventBus();
// jquery
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
