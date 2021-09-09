import MainEditor from './MainEditor.js';
import {getItem} from '../../../utils/storage.js';
import {autoSave} from '../AutoSave.js';

export default function PostEditMain({
    $target,
    initialState = {
        id: '',
        title: '',
        content: '',
    },
}) {
    const $section = document.createElement('div');

    this.state = initialState;

    let postLocalSaveKey = `temp-post-${this.state.id}`;

    const post = getItem(postLocalSaveKey, {
        id: this.state.id,
        title: '',
        content: '',
    });

    let timer = null;

    const mainEditor = new MainEditor({
        $target,
        initialState: post,
        onEditing: (post) => autoSave(post, postLocalSaveKey, timer),
    });

    this.setState = async (nextState) => {
        this.state = nextState;
        this.render();
        mainEditor.setState(this.state);
    };

    this.render = () => {
        $target.appendChild($section);
    };
}
