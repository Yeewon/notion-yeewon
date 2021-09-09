import {CURRENT_EDIT_DOCUMENT_ID} from '../constants/storage.js';
import {documentTemplate} from '../templates/documentList.js';
import {editorTemplate} from '../templates/editor.js';
import {API} from '../utils/api.js';
import {$} from '../utils/DOM.js';
import {push} from '../utils/router.js';
import {getItem, setItem} from '../utils/storage.js';
import {toggleOff, toggleOn} from './document/ToggleControl.js';
import {onModalOpen} from './ModalControl.js';

export const onToggle = (id) => {
    const $target = $(`[data-id='${id}']`);
    $target.className.includes('toggled') ? toggleOff(id) : toggleOn(id);
};

export const onSelect = (id) => {
    push(`/documents/${id}`);
    setItem(CURRENT_EDIT_DOCUMENT_ID, id);
};

export const removeHandler = (documents, id) => {
    const nextDocuments = [...documents];
    const documentIndex = documents.findIndex((document) => document.id === id);
    nextDocuments.splice(documentIndex, 1);

    return nextDocuments;
};

export const addSubDocumentHandler = (parentId) => {
    setItem(CURRENT_EDIT_DOCUMENT_ID, parentId);
    onModalOpen();
    $('.modal-editor').innerHTML = editorTemplate('', '');
};

export const modalCloseHandler = async (selectedDocument) => {
    const $modalEditor = $('.modal-editor');

    $(`[name='title']`, $modalEditor).value = '';
    $(`[name='content']`, $modalEditor).value = '';

    const {id} = selectedDocument;
    const {title} = await API.getContent(id);

    push(`/documents/${id}`);

    const parentId = getItem(CURRENT_EDIT_DOCUMENT_ID);
    $(`[data-id='${parentId}']`).insertAdjacentHTML('beforeend', documentTemplate(id, title));

    toggleOn(parentId);

    return id;
};

export const submitHandler = async (newTitle) => {
    const {id, title} = await API.addDocument(newTitle);
    const newDocument = {id, title, documents: []};

    $('.document-list').insertAdjacentHTML('beforeend', documentTemplate(id, title));
    push(`/documents/${id}`);

    return {id, newDocument};
};
