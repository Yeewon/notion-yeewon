import MainEditor from './MainEditor.js'
import {getItem, setItem, removeItem} from '../../../utils/storage.js'
import {request} from '../../../utils/api.js'

export default function PostEditMain({
    $target,
    initialState = {
        id: '',
        title: '',
        content: '',
    },
}) {
    const $section = document.createElement('div')

    this.state = initialState

    let postLocalSaveKey = `temp-post-${this.state.id}`

    const post = getItem(postLocalSaveKey, {
        id: this.state.id,
        title: '',
        content: '',
    })

    let timer = null

    const mainEditor = new MainEditor({
        $target,
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
                history.pushState(null, null, `/documents/${post.id}`)
                removeItem(postLocalSaveKey)
            })
        },
    })

    this.setState = async (nextState) => {
        this.state = nextState
        this.render()
        mainEditor.setState(this.state)
    }

    this.render = () => {
        $target.appendChild($section)
    }
}
