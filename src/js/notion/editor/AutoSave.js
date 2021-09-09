import {API} from '../../utils/api.js';
import {setItem, removeItem} from '../../utils/storage.js';

export const autoSave = (post, postLocalSaveKey, timer) => {
    if (timer !== null) {
        clearTimeout(timer);
    }
    timer = setTimeout(async () => {
        setItem(postLocalSaveKey, {
            ...post,
        });
        const {id, title, content} = post;
        await API.editDocument(id, title, content);

        // history.pushState(null, null, `/documents/${post.id}`);
        removeItem(postLocalSaveKey);
    });
};
