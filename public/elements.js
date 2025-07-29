export default {
    fileBrowser: {
        nav: document.getElementById("file-browser"),
        h1: /** @type {HTMLHeadingElement} */ (
            document.querySelector("nav#file-browser h1")
        ),
        ul: /** @type {HTMLUListElement} */ (
            document.querySelector("nav#file-browser ul")
        ),
    },
    textEditor: {
        section: document.getElementById("text-editor"),
        pathInput: /** @type {HTMLInputElement} */ (
            document.getElementById("text-editor-path")
        ),
        saveButton: /** @type {HTMLButtonElement} */ (
            document.getElementById("text-editor-save")
        ),
        textArea: /** @type {HTMLTextAreaElement} */ (
            document.querySelector("section#text-editor textarea")
        ),
    },
    newPost: {
        dialog: /** @type {HTMLDialogElement} */ (
            document.getElementById("new-post")
        ),
        openButton: /** @type {HTMLButtonElement} */ (
            document.getElementById("new-post-open")
        ),
        titleInput: /** @type {HTMLInputElement} */ (
            document.getElementById("new-post-title")
        ),
        layoutSelect: /** @type {HTMLSelectElement} */ (
            document.getElementById("new-post-layout")
        ),
        slugInput: /** @type {HTMLInputElement} */ (
            document.getElementById("new-post-slug")
        ),
        pathInput: /** @type {HTMLInputElement} */ (
            document.getElementById("new-post-path")
        ),
        replaceCheckbox: /** @type {HTMLInputElement} */ (
            document.getElementById("new-post-replace")
        ),
        cancelButton: /** @type {HTMLButtonElement} */ (
            document.getElementById("new-post-cancel")
        ),
        createButton: /** @type {HTMLButtonElement} */ (
            document.getElementById("new-post-create")
        ),
    },
    message: {
        dialog: /** @type {HTMLDialogElement} */ (
            document.getElementById("message")
        ),
        paragraph: /** @type {HTMLParagraphElement} */ (
            document.querySelector("dialog#message p")
        ),
        okButton: /** @type {HTMLButtonElement} */ (
            document.querySelector("dialog#message button")
        ),
    },
};
