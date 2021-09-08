export const parentDocumentPathTemplate = (parentDocumentList) => {
    return `
        ${parentDocumentList
            .map(
                ({id, title}) => `
            <button class="go-parent-document-button" data-id="${id}">${title}</button>
            `
            )
            .join(`<span class="path-separation-bar">/</span>`)}
    `;
};
