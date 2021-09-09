import {API} from '../utils/api.js';
import DocumentForm from './document/DocumentForm.js';
import DocumentList from './document/DocumentList.js';
import PostEditMain from './editor/main/PostEditMain.js';
import PostEditModal from './editor/modal/PostEditModal.js';
import {ModalController, onModalClose} from './ModalControl.js';
import {$} from '../utils/DOM.js';
import {initRouter, push} from '../utils/router.js';
import DocumentHeader from './document/DocumentHeader.js';
import {USER_NAME} from '../constants/notion.js';
import ParentDocumentPath from './editor/main/ParentDocumentPath.js';
import {onToggle, onSelect, removeHandler, addSubDocumentHandler, modalCloseHandler, submitHandler} from './handler.js';
import SubDocumentLink from './editor/main/SubDocumentLink.js';

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

    new DocumentHeader({
        $target: $documentListContainer,
        text: USER_NAME,
    });

    new DocumentForm({
        $target: $documentListContainer,
        onSubmit: async (newTitle) => {
            const {id, newDocument} = await submitHandler(newTitle);
            this.setState({
                documents: [...this.state.documents, newDocument],
                selectedDocument: newDocument,
            });

            fetchEditor(id);
        },
    });

    const parentDocumentPath = new ParentDocumentPath({
        initialState: this.state,
    });

    const documentList = new DocumentList({
        $target: $documentListContainer,
        initialState: this.state.documents,
        onToggle,
        onSelect,
        onAddSubDocument: async (parentId) => {
            addSubDocumentHandler(parentId);
            const {id, title} = await API.addDocument('', parentId);

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
        },
        onRemove: async (id) => {
            const {documents} = this.state;
            const nextDocuments = removeHandler(documents, id);

            await API.deleteDocument(id);
            this.setState(nextDocuments);
            fetchDocuments();
            push(`/`);
        },
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

    const subDocumentLink = new SubDocumentLink({
        initialState: this.state,
    });

    const fetchDocuments = async () => {
        const documents = await API.getDocuments();
        this.setState({
            ...this.state,
            documents,
        });
        documentList.setState(this.state.documents);
    };

    const fetchEditor = async (id) => {
        const {title, content} = await API.getContent(id);

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
        subDocumentLink.setState(this.state.selectedDocument.id);
    };

    const setModalClose = async () => {
        const id = await modalCloseHandler(this.state.selectedDocument);
        await fetchEditor(id);
    };

    const onEventHandler = () => {
        window.onpopstate = () => this.route();
        window.addEventListener('click', async ({target}) => {
            if (target.className === 'modal open') {
                onModalClose();
                setModalClose();
            }
        });
        $('.modal-close').addEventListener('click', setModalClose);
        $('.username').addEventListener('click', () => {
            push(`/`);
        });
    };

    const init = async () => {
        await fetchDocuments();
        this.route();
        initRouter(() => this.route());
        onEventHandler();
        ModalController();
    };

    init();
}
