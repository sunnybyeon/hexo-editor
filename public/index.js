import elements from "./elements.js";

elements.fileBrowser.h1.children[0].addEventListener("click", () => {
    openDirectory("/");
});
elements.textEditor.saveButton.addEventListener("click", () => {
    saveFile(
        elements.textEditor.pathInput.value,
        elements.textEditor.textArea.value,
    );
});
elements.newPost.openButton.addEventListener("click", () => {
    elements.newPost.dialog.showModal();
});
elements.newPost.cancelButton.addEventListener("click", () => {
    elements.newPost.dialog.close();
});
elements.newPost.createButton.addEventListener("click", () => {
    const postData = {
        title: elements.newPost.titleInput.value,
        ...(elements.newPost.layoutSelect.value && {
            layout: elements.newPost.layoutSelect.value,
        }),
        ...(elements.newPost.slugInput.value && {
            slug: elements.newPost.layoutSelect.value,
        }),
        ...(elements.newPost.pathInput.value && {
            path: elements.newPost.pathInput.value,
        }),
        ...(elements.newPost.replaceCheckbox.checked && {
            replace: elements.newPost.replaceCheckbox.checked,
        }),
    };
    createPost(postData).finally(() => {
        elements.newPost.dialog.close();
    });
});
elements.newPost.layoutSelect.addEventListener("change", () => {
    if (elements.newPost.layoutSelect.value) {
        elements.newPost.layoutSelect.classList.remove("not-selected");
    } else {
        elements.newPost.layoutSelect.classList.add("not-selected");
    }
});
elements.message.okButton.addEventListener("click", () => {
    elements.message.dialog.close();
});
openDirectory("/");

/**
 * Fetches the directory contents and displays them on the file browser.
 * @param {string} directoryPath
 */
async function openDirectory(directoryPath) {
    try {
        directoryPath = normalizePath(directoryPath);
        directoryPath += directoryPath.endsWith("/") ? "" : "/";

        const response = await fetch(
            `./api/fs/directory?path=${directoryPath}`,
        );
        if (!response.ok) {
            throw new Error(
                `Something went wrong with fetching contents the contents of the directory: <code>${directoryPath}</code><br /><code>` +
                    (await response.json()).error +
                    "</code>",
            );
        }

        /** @type {{contents: Array<{type: "file" | "directory", name: string}>}} */
        const { contents } = await response.json();

        const contentSortingHelper = { directory: 0, file: 1 };
        contents.sort(
            (a, b) =>
                contentSortingHelper[a.type] - contentSortingHelper[b.type],
        );

        elements.fileBrowser.ul.replaceChildren();
        if (directoryPath !== "/") {
            const li = document.createElement("li");
            li.textContent = "../";
            li.addEventListener("click", () =>
                openDirectory(directoryPath + "../"),
            );
            li.classList.add("directory");
            elements.fileBrowser.ul.appendChild(li);
        }
        for (const content of contents) {
            const li = document.createElement("li");
            li.textContent =
                content.name + (content.type === "file" ? "" : "/");
            li.addEventListener(
                "click",
                content.type === "file"
                    ? () => openFile(directoryPath + content.name)
                    : () => openDirectory(directoryPath + content.name),
            );
            li.classList.add(content.type);
            elements.fileBrowser.ul.appendChild(li);
        }
        elements.fileBrowser.ul.scroll(0, 0);

        elements.fileBrowser.h1.replaceChildren(
            elements.fileBrowser.h1.children[0],
            ...directoryPath
                .split("/")
                .filter((path) => path.length)
                .map((path, i, paths) => {
                    const span = document.createElement("span");
                    span.textContent = path + "/";
                    span.addEventListener("click", () =>
                        openDirectory(paths.slice(0, i + 1).join("/")),
                    );
                    return span;
                }),
        );
    } catch (error) {
        showMessage(String(error));
    }
}

/**
 * Fetches the data of the file and displays it on the text editor.
 * @param {string} filePath
 */
async function openFile(filePath) {
    try {
        filePath = normalizePath(filePath);

        const response = await fetch(`./api/fs/file?path=${filePath}`);
        if (!response.ok) {
            throw new Error(
                `Something went wrong with fetching the data of file: <code>${filePath}</code><br /><code>` +
                    (await response.json()).error +
                    "</code>",
            );
        }

        /** @type {{data: string}} */
        const { data } = await response.json();

        elements.textEditor.pathInput.value = filePath;
        elements.textEditor.textArea.value = data;
    } catch (error) {
        showMessage(String(error));
    }
}

/**
 * Saves the data to the file at the given path.
 * @param {string} filePath
 * @param {string} data
 */
async function saveFile(filePath, data) {
    try {
        filePath = normalizePath(filePath);

        const response = await fetch("./api/fs/file", {
            body: JSON.stringify({ path: filePath, data }),
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(
                `Something went wrong when writing to the file: <code>${filePath}</code><br /><code>` +
                    (await response.json()).error +
                    "</code>",
            );
        }
        showMessage(`Successfully saved the file: <code>${filePath}</code>`);
    } catch (error) {
        showMessage(String(error));
    }
}

/**
 * @typedef {Object} PostConfig
 * @property {string} title
 * @property {string} [layout]
 * @property {string} [slug]
 * @property {string} [path]
 * @property {boolean} [replace]
 */
/**
 * Create a new post.
 * @param {PostConfig} data
 */
async function createPost(data) {
    try {
        const response = await fetch("./api/hexo/post", {
            body: JSON.stringify(data),
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(
                `Something went wrong while creating a new post with the title: <code>${data.title}</code><br /><code>` +
                    (await response.json()).error +
                    "</code>",
            );
        }

        /** @type {{path: string, content: string}} */
        const { path, content } = await response.json();

        elements.textEditor.pathInput.value = path;
        elements.textEditor.textArea.value = content;

        showMessage(
            `Successfully created the post: <code>${data.title}</code>, and opened the file in the editor.`,
        );
    } catch (error) {
        showMessage(String(error));
    }
}

/**
 * Displays the message to the user via the message dialog. The message can contain some HTML.
 * @param {string} message
 */
function showMessage(message) {
    elements.message.paragraph.replaceChildren();
    elements.message.paragraph.insertAdjacentHTML("afterbegin", message);
    elements.message.dialog.showModal();
}

/**
 * Returns the normalized path. The returned path won't have a leading '/'.
 * @param {string} path
 */
function normalizePath(path) {
    const url = new URL(path, "http://localhost/");
    return decodeURIComponent(url.pathname.substring(1));
}
