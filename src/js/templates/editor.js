export const editorTemplate = (title, content) => {
    return `
        <input type="text" name="title" value="${title}" placeholder="제목없음"/>
        <textarea name="content" placeholder="내용을 입력해주세요.">${content}</textarea>    
    `;
};
