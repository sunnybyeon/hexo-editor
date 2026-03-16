import { showMessage } from "./message.js";

const elements = {
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
};

elements.fileBrowser.h1.children[0].addEventListener("click", () => {
    openDirectory("/");
});
elements.textEditor.saveButton.addEventListener("click", () => {
    saveFile(
        elements.textEditor.pathInput.value,
        elements.textEditor.textArea.value,
    );
});

const path = new URLSearchParams(document.location.search).get("path");
if (path) {
    openDirectory(path.substring(0, path.lastIndexOf("/")));
    openFile(path);
} else {
    openDirectory("/");
}

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
 * Returns the normalized path, i.e. the returned path won't have a leading '/'.
 * @param {string} path
 */
function normalizePath(path) {
    const url = new URL(path, "http://localhost/");
    return decodeURIComponent(url.pathname.substring(1));
}
