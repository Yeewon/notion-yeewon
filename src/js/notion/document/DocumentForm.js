import {CHECK_TITLE_INPUT_MESSAGE} from '../../constants/message.js';
import {documentForm} from '../../templates/documentForm.js';
import {$} from '../../utils/DOM.js';

export default function DocumentForm({$target, onSubmit}) {
    const $form = document.createElement('form');
    $target.appendChild($form);

    this.render = () => {
        $form.innerHTML = documentForm();
    };

    $form.addEventListener('submit', (e) => {
        e.preventDefault();

        const $input = $('input', $form);
        const newTitle = $input.value;

        if (!newTitle) {
            alert(CHECK_TITLE_INPUT_MESSAGE);
        } else {
            onSubmit(newTitle);
            $input.value = ``;
        }
    });

    this.render();
}
