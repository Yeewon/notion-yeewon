export default function Header({$target, text}) {
    const $header = document.createElement('div');
    $header.className = 'username';
    $header.textContent = text;

    $target.appendChild($header);
}
