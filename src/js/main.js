import {$} from './utils/DOM.js';
import App from './notion/App.js';
import {ModalController} from './notion/ModalControl.js';

const $target = $('#app');

new App({$target});
ModalController();
