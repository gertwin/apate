
import '../css/app.scss';
import jQuery from 'jquery/dist/jquery';
import './utils/injectormanager';
import APATEApp from './app';

import '@material/typography/dist/mdc.typography.css';

/* globals window, document, $, navigator */

window.jQuery = jQuery;
window.$ = jQuery;


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
