export const subDocumentButtonTemplate = (subDocuments) => {
    return `
            <ul>
                ${subDocuments
                    .map(
                        ({id, title}) => `
                    <li class="sub-document">
                        <button class="go-sub-document-button" data-id="${id}">${title}</button>
                    </li>
                    `
                    )
                    .join('')}
            </ul>
            `;
};
