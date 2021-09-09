import {$, addClassName, removeClassName, replaceClassName, setClassName} from '../../utils/DOM.js';

export const toggleOff = (id) => {
    const $parent = $(`[data-id='${id}']`);

    $('.toggle', $parent).innerText = '▶';
    for (const $child of $parent.childNodes) {
        if ($child.className !== undefined && $child.className.includes('document-title')) {
            $child.style.display = 'none';
        }
        removeClassName('toggled', $parent);
    }
};

export const toggleOn = (id) => {
    const $parent = $(`[data-id='${id}']`);
    let subDocumentCount = 0;

    for (const $child of $parent.childNodes) {
        if ($child.className !== undefined && $child.className.includes('document-title')) {
            subDocumentCount += 1;
            $child.style.display = 'block';
        }
        addClassName('toggled', $parent);
    }

    if (subDocumentCount === 0) {
        const $snackbar = document.getElementById('snackbar');
        setClassName('show', $snackbar);
        setTimeout(function () {
            $snackbar.className = replaceClassName('show', '', $snackbar);
        }, 2000);
    } else {
        $('.toggle', $parent).innerText = '▼';
    }
};
