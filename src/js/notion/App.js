import {request} from '../utils/api.js';
import DocumentForm from './document/DocumentForm.js';
import DocumentList from './document/DocumentList.js';
import PostEditMain from './editor/main/PostEditMain.js';
import PostEditModal from './editor/modal/PostEditModal.js';
import {onModalClose, onModalOpen} from './ModalControl.js';
import {$} from '../utils/DOM.js';
import {getItem, setItem} from '../utils/storage.js';
import {CURRENT_EDIT_DOCUMENT_ID} from '../constants/storage.js';
import {initRouter, push} from '../utils/router.js';
import {documentTemplate} from '../templates/documentList.js';
import DocumentHeader from './document/DocumentHeader.js';
import {USER_NAME} from '../constants/notion.js';
import ParentDocumentPath from './editor/main/ParentDocumentPath.js';
import {toggleOff, toggleOn} from './document/ToggleControl.js';
import {editorTemplate} from '../templates/editor.js';

export default function App({$target}) {
    const $documentListContainer = $('.document-list-container');
    const $editorContainer = $('.editor-container');

    this.state = {
        documents: [],
        selectedDocument: {
            id: null,
            title: null,
            content: null,
        },
    };

    this.setState = (nextState) => {
        this.state = nextState;
    };

    const setDisplay = (type) => {
        $('.parent-path').style.display = type;
        $('.editor').style.display = type;
    };

    this.route = async () => {
        const {pathname} = window.location;

        if (pathname === '/') {
            setDisplay('none');
        } else if (pathname.indexOf('/documents/') === 0) {
            setDisplay('block');
            $('.editor [name="title"]').focus();

            const [, , documentId] = pathname.split('/');
            await fetchEditor(documentId);
        }
    };

    const onSubmit = async (newTitle) => {
        const document = {
            title: newTitle,
            parent: null,
        };

        const {id, title} = await request(`/documents`, {
            method: 'POST',
            body: JSON.stringify({
                ...document,
            }),
        });

        const newDocument = {id, title, documents: []};

        this.setState({
            documents: [...this.state.documents, newDocument],
            selectedDocument: newDocument,
        });

        $('.document-list').insertAdjacentHTML('beforeend', documentTemplate(id, title));
        push(`/documents/${id}`);
        fetchEditor(id);
    };

    const onToggle = (id) => {
        const $target = $(`[data-id='${id}']`);
        $target.className.includes('toggled') ? toggleOff(id) : toggleOn(id);
    };

    const onSelect = (id) => {
        push(`/documents/${id}`);
        setItem(CURRENT_EDIT_DOCUMENT_ID, id);
    };

    const onAddSubDocument = async (parentId) => {
        setItem(CURRENT_EDIT_DOCUMENT_ID, parentId);
        onModalOpen();

        $('.modal-editor').innerHTML = editorTemplate('', '');
        const document = {
            title: '',
            parent: parentId,
        };

        const {id, title} = await request(`/documents`, {
            method: 'POST',
            body: JSON.stringify({
                ...document,
            }),
        });

        this.setState({
            ...this.state,
            selectedDocument: {
                id,
                title,
                content: '',
            },
        });

        postEditModal.setState({
            id,
            title,
            content: '',
        });
    };

    const onRemove = async (id) => {
        const {documents} = this.state;
        const nextDocuments = [...documents];
        const documentIndex = documents.findIndex((document) => document.id === id);
        nextDocuments.splice(documentIndex, 1);

        await request(`/documents/${id}`, {
            method: 'DELETE',
        });

        this.setState(nextDocuments);
        fetchDocuments();
        push(`/`);
    };

    new DocumentHeader({
        $target: $documentListContainer,
        text: USER_NAME,
    });

    new DocumentForm({
        $target: $documentListContainer,
        onSubmit,
    });

    const parentDocumentPath = new ParentDocumentPath({
        initialState: this.state,
    });

    const documentList = new DocumentList({
        $target: $documentListContainer,
        initialState: this.state.documents,
        onToggle,
        onSelect,
        onAddSubDocument,
        onRemove,
    });

    const postEditMainPostEditMain = new PostEditMain({
        $target: $editorContainer,
        initialState: this.state.selectedDocument,
    });

    const postEditModal = new PostEditModal({
        initialState: {
            id: '',
            title: '',
            content: '',
        },
    });

    const fetchDocuments = async () => {
        const documents = await request('/documents');
        this.setState({
            ...this.state,
            documents,
        });
        documentList.setState(this.state.documents);
    };

    const fetchEditor = async (id) => {
        const {title, content} = await request(`/documents/${id}`);

        $('title').innerText = title;
        this.setState({
            ...this.state,
            selectedDocument: {
                id,
                title,
                content,
            },
        });

        postEditMainPostEditMain.setState(this.state.selectedDocument);
        parentDocumentPath.setState(this.state.selectedDocument);
    };

    const modalCloseController = async () => {
        const $modalEditor = $('.modal-editor');
        $(`[name='title']`, $modalEditor).value = '';
        $(`[name='content']`, $modalEditor).value = '';

        const {id} = this.state.selectedDocument;
        const {title} = await request(`/documents/${id}`);
        push(`/documents/${id}`);

        const parentId = getItem(CURRENT_EDIT_DOCUMENT_ID);
        $(`[data-id='${parentId}']`).insertAdjacentHTML('beforeend', documentTemplate(id, title));

        toggleOn(parentId);
        await fetchEditor(id);
    };

    $('.modal-close').addEventListener('click', () => {
        modalCloseController();
    });

    window.addEventListener('click', async ({target}) => {
        if (target.className === 'modal open') {
            onModalClose();
            modalCloseController();
        }
    });

    window.onpopstate = () => {
        this.route();
    };

    $('.username').addEventListener('click', ({target}) => {
        push(`/`);
    });

    const init = async () => {
        await fetchDocuments();
        this.route();
        initRouter(() => this.route());
    };

    init();
}
