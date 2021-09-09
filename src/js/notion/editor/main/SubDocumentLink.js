import {subDocumentButtonTemplate} from '../../../templates/subDocumentButton.js';
import {API} from '../../../utils/api.js';
import {$, setClassName} from '../../../utils/DOM.js';
import {push} from '../../../utils/router.js';

export default function SubDocumentLink({initialState}) {
    const $link = document.createElement('div');
    setClassName('subDocument-link', $link);
    $('.editor-container').appendChild($link);

    this.state = initialState;

    this.setState = (nextState) => {
        this.state = nextState;
        this.render();
    };

    this.render = async () => {
        const {documents} = await API.getContent(this.state);
        $link.innerHTML = subDocumentButtonTemplate(documents);
    };

    $link.addEventListener('click', ({target}) => {
        const {id} = target.dataset;
        const {className} = target;
        if (className === 'go-sub-document-button') {
            push(`/documents/${id}`);
        }
    });
}
