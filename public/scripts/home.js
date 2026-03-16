import { showMessage } from "./message.js";

const elements = {
    postsUl: /** @type {HTMLUListElement} */ (
        document.querySelector("section#posts > ul")
    ),
    pagesUl: /** @type {HTMLUListElement} */ (
        document.querySelector("section#pages> ul")
    ),
    new: {
        postButton: /** @type {HTMLButtonElement} */ (
            document.getElementById("new-post-open")
        ),
        pageButton: /** @type {HTMLButtonElement} */ (
            document.getElementById("new-page-open")
        ),
        dialog: /** @type {HTMLDialogElement} */ (
            document.getElementById("new")
        ),
        titleInput: /** @type {HTMLInputElement} */ (
            document.getElementById("new-title")
        ),
        layoutInput: /** @type {HTMLSelectElement} */ (
            document.getElementById("new-layout")
        ),
        slugInput: /** @type {HTMLInputElement} */ (
            document.getElementById("new-slug")
        ),
        pathInput: /** @type {HTMLInputElement} */ (
            document.getElementById("new-path")
        ),
        replaceCheckbox: /** @type {HTMLInputElement} */ (
            document.getElementById("new-replace")
        ),
        cancelButton: /** @type {HTMLButtonElement} */ (
            document.getElementById("new-cancel")
        ),
        createButton: /** @type {HTMLButtonElement} */ (
            document.getElementById("new-create")
        ),
    },
};

elements.new.postButton.addEventListener("click", () => {
    elements.new.titleInput.value = "";
    elements.new.slugInput.value = "";
    elements.new.pathInput.value = "";
    elements.new.layoutInput.value = "";
    elements.new.layoutInput.style.display = "block";
    elements.new.dialog.showModal();
});
elements.new.pageButton.addEventListener("click", () => {
    elements.new.titleInput.value = "";
    elements.new.slugInput.value = "";
    elements.new.pathInput.value = "";
    elements.new.layoutInput.value = "page";
    elements.new.layoutInput.style.display = "none";
    elements.new.dialog.showModal();
});
elements.new.cancelButton.addEventListener("click", () => {
    elements.new.dialog.close();
});
elements.new.createButton.addEventListener("click", () => {
    const data = {
        title: elements.new.titleInput.value,
        ...(elements.new.layoutInput.value && {
            layout: elements.new.layoutInput.value,
        }),
        ...(elements.new.slugInput.value && {
            slug: elements.new.layoutInput.value,
        }),
        ...(elements.new.pathInput.value && {
            path: elements.new.pathInput.value,
        }),
        ...(elements.new.replaceCheckbox.checked && {
            replace: elements.new.replaceCheckbox.checked,
        }),
    };
    createArticle(data).finally(() => {
        elements.new.dialog.close();
        if (data.layout === "page") {
            listPages();
        } else {
            // setTimeout(listPosts, 1000);
            listPosts();
        }
    });
});
elements.new.layoutInput.addEventListener("change", () => {
    if (elements.new.layoutInput.value) {
        elements.new.layoutInput.classList.remove("not-selected");
    } else {
        elements.new.layoutInput.classList.add("not-selected");
    }
});

listPosts();
listPages();

async function listPosts() {
    try {
        const response = await fetch("./api/hexo/posts");

        if (!response.ok) {
            throw new Error(
                `Something went wrong with fetching the list of posts: <code>${
                    (await response.json()).error
                }</code>`,
            );
        }

        /** @type {{posts: Array<{title: string, source: string, date: string}>}} */
        const { posts } = await response.json();
        posts.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        elements.postsUl.replaceChildren();
        for (const post of posts) {
            elements.postsUl.insertAdjacentHTML(
                "beforeend",
                `<li><a href="./files?path=${post.source}">
                    <span class="title">${post.title || "Untitled"}</span>
                    <span class="date">${post.date.split("T")[0]}</span>
                </a></li>`,
            );
        }
    } catch (error) {
        showMessage(String(error));
    }
}

async function listPages() {
    try {
        const response = await fetch("./api/hexo/pages");

        if (!response.ok) {
            throw new Error(
                `Something went wrong with fetching the list of pages: <code>${
                    (await response.json()).error
                }</code>`,
            );
        }

        /** @type {{pages: Array<{title: string, source: string, date: string}>}} */
        const { pages } = await response.json();
        pages.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        elements.pagesUl.replaceChildren();
        for (const page of pages) {
            elements.pagesUl.insertAdjacentHTML(
                "beforeend",
                `<li><a href="./files?path=${page.source}">
                    <span class="title">${page.title || "Untitled"}</span>
                    <span class="date">${page.date.split("T")[0]}</span>
                </a></li>`,
            );
        }
    } catch (error) {
        showMessage(String(error));
    }
}

/**
 * @typedef {Object} ArticleConfig
 * @property {string} title
 * @property {string} [layout]
 * @property {string} [slug]
 * @property {string} [path]
 * @property {boolean} [replace]
 */
/**
 * Create a new article (post or page).
 * @param {ArticleConfig} data
 */
async function createArticle(data) {
    try {
        const response = await fetch("./api/hexo/new", {
            body: JSON.stringify(data),
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(
                `Something went wrong while creating a new article with the title: <code>${data.title}</code>
                <br /><code>${(await response.json()).error}</code>`,
            );
        }

        showMessage(
            `Successfully created the article: <code>${data.title}</code>`,
        );
    } catch (error) {
        showMessage(String(error));
    }
}
