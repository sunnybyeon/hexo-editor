const path = require("node:path");

const { handleError } = require("../error");
const { checkPath } = require("../utils");

/**
 * Handles the requests to /hexo/new.
 * @param {import("connect").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handleRequest(req, res, hexo) {
    if (req.method === "POST") {
        handlePost(req, res, hexo);
    } else {
        res.writeHead(405);
        res.end();
    }
}

/**
 * Handles the POST requests to /hexo/new.
 * @param {import("connect").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handlePost(req, res, hexo) {
    let reqBody = "";
    req.on("data", (chunk) => (reqBody += chunk));
    req.on("end", async () => {
        try {
            /** @type {{title: string, layout?: string, slug?: string, path?: string, replace: boolean}} */
            const { replace, ...data } = Object.assign(
                { replace: false },
                JSON.parse(reqBody),
            );
            checkPath(path.join(hexo.base_dir, data.path || "", "./"), hexo);

            await hexo.post.create(data, replace);
            await hexo.source.process();

            res.writeHead(201);
            res.end();
        } catch (error) {
            handleError(res, error);
        }
    });
}

module.exports = handleRequest;
