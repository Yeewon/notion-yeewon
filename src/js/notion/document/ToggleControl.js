import {$} from '../../utils/DOM.js';

export const toggleOff = (id) => {
    const $parent = $(`[data-id='${id}']`);

    $('.toggle', $parent).innerText = '▶';
    for (const $child of $parent.childNodes) {
        if ($child.className !== undefined && $child.className.includes('document-title')) {
            $child.style.display = 'none';
        }
        $parent.classList.remove('toggled');
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
        $parent.classList.add('toggled');
    }

    if (subDocumentCount === 0) {
        const x = document.getElementById('snackbar');
        x.className = 'show';
        setTimeout(function () {
            x.className = x.className.replace('show', '');
        }, 2000);
    } else {
        $('.toggle', $parent).innerText = '▼';
    }
};
