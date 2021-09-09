import {parentDocumentPathTemplate} from '../../../templates/parentDocumentPath.js';
import {$, setClassName} from '../../../utils/DOM.js';
import {push} from '../../../utils/router.js';

export default function ParentDocumentPath({initialState}) {
    const $path = document.createElement('div');
    setClassName('parent-path', $path);
    $('.editor-container').appendChild($path);

    let parentDocumentList = [
        {
            id: '',
            title: '',
        },
    ];

    this.state = initialState;

    this.setState = (nextState) => {
        this.state = nextState;
        this.render();
    };

    const findParent = ($target) => {
        const $parentDocument = $target.parentNode;
        const {className} = $parentDocument;
        if (className.includes('document-list')) return;

        const {id} = $parentDocument.dataset;
        const title = $('.document-element .document', $parentDocument).innerText;

        parentDocumentList = [...parentDocumentList, {id, title}];
        findParent($parentDocument);
    };

    this.render = () => {
        const {id} = this.state;
        parentDocumentList = [];

        findParent($(`[data-id="${id}"]`));

        $path.innerHTML = parentDocumentPathTemplate(parentDocumentList.reverse());
    };

    $path.addEventListener('click', ({target}) => {
        const {id} = target.dataset;
        const {className} = target;
        if (className === 'go-parent-document-button') {
            push(`/documents/${id}`);
        }
    });
}
