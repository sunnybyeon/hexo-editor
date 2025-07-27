const path = require("node:path");

const { handleError } = require("../error");
const { checkPath } = require("../utils");

/**
 * Handles the requests to /hexo/post.
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
 * Handles the POST requests to /hexo/post.
 * @param {import("connect").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handlePost(req, res, hexo) {
    let reqBody = "";
    req.on("data", (chunk) => (reqBody += chunk));
    req.on("end", () => {
        try {
            /** @type {{title: string, layout?: string, slug?: string, path?: string, replace: boolean}} */
            const { replace, ...data } = Object.assign(
                { replace: false },
                JSON.parse(reqBody)
            );
            checkPath(path.join(hexo.base_dir, data.path || "", "./"), hexo);

            hexo.post.create(data, replace, (error, result) => {
                if (error) {
                    handleError(res, error);
                    return;
                }

                result.path = result.path.replace(hexo.base_dir, "");
                res.writeHead(201);
                res.end(JSON.stringify(result));
            });
        } catch (error) {
            handleError(res, error);
        }
    });
}

module.exports = handleRequest;
