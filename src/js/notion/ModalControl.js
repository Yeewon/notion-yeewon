import {$} from '../utils/DOM.js';

export const ModalController = () => {
    $('.modal-close').addEventListener('click', onModalClose);
};

export const onModalClose = () => {
    $('.modal').classList.remove('open');
};

export const onModalOpen = () => {
    $('.modal').classList += ' open';
};
