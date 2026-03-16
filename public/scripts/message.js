const elements = {
    dialog: /** @type {HTMLDialogElement} */ (
        document.getElementById("message")
    ),
    paragraph: /** @type {HTMLParagraphElement} */ (
        document.querySelector("dialog#message p")
    ),
    okButton: /** @type {HTMLButtonElement} */ (
        document.querySelector("dialog#message button")
    ),
};

elements.okButton.addEventListener("click", () => {
    elements.dialog.close();
});

/**
 * Displays the message to the user via the message dialog. The message can contain some HTML.
 * @param {string} message
 */
export function showMessage(message) {
    elements.paragraph.replaceChildren();
    elements.paragraph.insertAdjacentHTML("afterbegin", message);
    elements.dialog.showModal();
}
