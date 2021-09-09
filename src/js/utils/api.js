export const BASE_URL = 'https://kdt.roto.codes';

const option = {
    post: (data) => ({
        method: 'POST',
        body: JSON.stringify(data),
    }),

    delete: () => ({
        method: 'DELETE',
    }),

    put: (data) => ({
        method: 'PUT',
        body: JSON.stringify(data),
    }),
};

const request = async (url, option = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...option,
            headers: {
                'Content-Type': 'application/json',
                'x-username': 'yewon',
            },
        });
        if (!response.ok) {
            throw new Error(response.status);
        }
        return await response.json();
    } catch (err) {
        console.log(`Error : ${err}`);
    }
};

export const API = {
    getDocuments: () => {
        return request(`/documents`);
    },

    getContent: (documentId) => {
        return request(`/documents/${documentId}`);
    },

    addDocument: (newTitle, parentId = null) => {
        const content = {
            title: newTitle,
            parent: parentId,
        };
        return request(`/documents`, option.post(content));
    },

    editDocument: (documentId, newTitle, newContent) => {
        const content = {
            title: newTitle,
            content: newContent,
        };
        return request(`/documents/${documentId}`, option.put(content));
    },

    deleteDocument: (documentId) => {
        return request(`/documents/${documentId}`, option.delete());
    },
};
