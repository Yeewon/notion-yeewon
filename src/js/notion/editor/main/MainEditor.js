import {editorTemplate} from '../../../templates/editor.js'
import {$} from '../../../utils/DOM.js'

export default function MainEditor({
    $target,
    initialState = {
        id,
        title: '',
        content: '',
    },
    onEditing,
}) {
    const $editor = document.createElement('div')
    $editor.className = 'editor'
    $target.appendChild($editor)

    let isInitialize = false

    this.state = initialState

    this.setState = (nextState) => {
        this.state = nextState

        $editor.querySelector('[name=title]').value = this.state.title
        $editor.querySelector('[name=content]').value = this.state.content

        this.render()
    }

    this.render = () => {
        if (!isInitialize) {
            const {title, content} = this.state
            $editor.innerHTML = editorTemplate(title, content)
            isInitialize = true
        }
    }

    this.render()

    $editor.addEventListener('keyup', async ({target}) => {
        const name = target.getAttribute('name')
        const documentId = this.state.id

        if (this.state[name] !== undefined) {
            if (name === 'title') {
                $(`[data-id="${documentId}"]`).querySelector('.document span').innerText = target.value
            }
            const nextState = {
                ...this.state,
                [name]: target.value,
            }

            this.setState(nextState)
            onEditing(this.state)
        }
    })
}
