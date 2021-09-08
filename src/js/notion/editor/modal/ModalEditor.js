import {$} from '../../../utils/DOM.js'

export default function ModalEditor({
    initialState = {
        id,
        title: '',
        content: '',
    },
    onEditing,
}) {
    const $modalEditor = $('.modal-editor')

    this.state = initialState

    this.setState = (nextState) => {
        this.state = nextState
    }

    $modalEditor.addEventListener('keyup', ({target}) => {
        const name = target.getAttribute('name')

        if (this.state[name] !== undefined) {
            const nextState = {
                ...this.state,
                [name]: target.value,
            }

            this.setState(nextState)
            onEditing(this.state)
        }
    })
}
