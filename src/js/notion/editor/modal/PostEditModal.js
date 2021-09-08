import {request} from '../../../utils/api.js'
import {getItem, removeItem, setItem} from '../../../utils/storage.js'
import ModalEditor from './ModalEditor.js'

export default function PostEditModal({
    initialState = {
        id: '',
        title: '',
        content: '',
    },
}) {
    this.state = initialState

    let postLocalSaveKey = `temp-post-${this.state.id}`

    const post = getItem(postLocalSaveKey, {
        id: this.state.id,
        title: '',
        content: '',
    })

    let timer = null

    const modalEditor = new ModalEditor({
        initialState: post,
        onEditing: (post) => {
            if (timer !== null) {
                clearTimeout(timer)
            }
            timer = setTimeout(async () => {
                setItem(postLocalSaveKey, {
                    ...post,
                })
                await request(`/documents/${post.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(post),
                })
                removeItem(postLocalSaveKey)
            })
        },
    })

    this.setState = async (nextState) => {
        this.state = nextState
        modalEditor.setState(this.state)
    }
}
