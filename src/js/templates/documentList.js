export const documentListTemplate = (documents, isRoot = false) => {
    return `
            ${documents
                .map(
                    ({id, title}) => `
                    <ul data-id="${id}" class="document-title" style="display: ${isRoot ? 'block' : 'none'}"> 
                        <li class="document-element">
                            <button class="toggle"><span id="${id}-toggle"></span>&#9654;</button>
                            <button class="document"><span>${title}</span></button>
                            <div class="control-button">
                                <button class="remove-button btn btn-cyan">-<span class="remove-button-text">삭제</span></button>
                                <button class="add-button btn btn-cyan">+<span class="add-button-text">페이지 내에 하위페이지 추가하기</span></button>
                            </div>
                        </li>
                    </ul>
                `
                )
                .join('')}
            `;
};

export const documentTemplate = (id, title) => {
    return `
            <ul data-id="${id}" class="document-title" style="display: block"> 
                <li class="document-element">
                    <button class="toggle"><span id="${id}-toggle"></span>&#9654;</button>
                    <button class="document"><span>${title}</span></button>
                    <div class="control-button">
                        <button class="remove-button btn btn-cyan">-<span class="remove-button-text">삭제</span></button>
                        <button class="add-button btn btn-cyan">+<span class="add-button-text">페이지 내에 하위페이지 추가하기</span></button>
                    </div>
                </li>
            </ul>
            `;
};
