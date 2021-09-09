import {getItem} from '../../../utils/storage.js';
import {autoSave} from '../AutoSave.js';
import ModalEditor from './ModalEditor.js';

export default function PostEditModal({
    initialState = {
        id: '',
        title: '',
        content: '',
    },
}) {
    this.state = initialState;

    let postLocalSaveKey = `temp-post-${this.state.id}`;

    const post = getItem(postLocalSaveKey, {
        id: this.state.id,
        title: '',
        content: '',
    });

    let timer = null;

    const modalEditor = new ModalEditor({
        initialState: post,
        onEditing: (post) => autoSave(post, postLocalSaveKey, timer),
    });

    this.setState = async (nextState) => {
        this.state = nextState;
        modalEditor.setState(this.state);
    };
}
