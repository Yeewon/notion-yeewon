import {REMOVE_CONFIRM_MESSAGE} from '../../constants/message.js';
import {documentListTemplate} from '../../templates/documentList.js';

export default function DocumentList({$target, initialState, onToggle, onSelect, onAddSubDocument, onRemove}) {
    const $documentList = document.createElement('ul');
    $documentList.className = 'document-list';
    $target.appendChild($documentList);

    this.state = initialState;

    this.setState = (nextState) => {
        this.state = nextState;
        this.render();
    };

    const setAllDocuments = ($target, currentDoucments, isRoot) => {
        $target.insertAdjacentHTML('beforeend', documentListTemplate(currentDoucments, isRoot));

        currentDoucments.map(({id, documents}) => {
            isRoot = false;
            if (documents.length === 0) return;
            $target = document.querySelector(`[data-id='${id}']`);
            setAllDocuments($target, documents, isRoot);
        });
    };

    this.render = () => {
        $documentList.innerHTML = ``;
        setAllDocuments($documentList, this.state, true);
    };

    $documentList.addEventListener('click', ({target}) => {
        const $div = target.closest('.document-title');

        if ($div) {
            const {id} = $div.dataset;
            const {className} = target;

            if (className.includes('add-button')) onAddSubDocument(parseInt(id));
            else if (className.includes('remove-button')) {
                if (confirm(REMOVE_CONFIRM_MESSAGE)) onRemove(parseInt(id));
            } else if (className.includes('toggle')) {
                onToggle(id);
            } else {
                onSelect(parseInt(id));
            }
        }
    });

    this.render();
}
