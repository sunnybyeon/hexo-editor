const api = {
    fs: require("./fs"),
    hexo: require("./hexo"),
};
const { handleError } = require("./error");

/**
 * Creates a connect middleware function for the API and returns it.
 * @param {import("hexo")} hexo
 */
function createMiddleware(hexo) {
    /**
     * @param {import("connect").IncomingMessage} req
     * @param {import("node:http").ServerResponse} res
     * @param {import("connect").NextFunction} next
     */
    return function (req, res, next) {
        try {
            const reqURL = new URL(req.url, "http://localhost/");
            reqURL.pathname += reqURL.pathname.endsWith("/") ? "" : "/";

            if (reqURL.pathname === "/fs/file/") {
                api.fs.file(req, res, hexo);
            } else if (reqURL.pathname === "/fs/directory/") {
                api.fs.directory(req, res, hexo);
            } else if (reqURL.pathname === "/hexo/posts/") {
                api.hexo.posts(req, res, hexo);
            } else if (reqURL.pathname === "/hexo/pages/") {
                api.hexo.pages(req, res, hexo);
            } else if (reqURL.pathname == "/hexo/new/") {
                api.hexo.newAPI(req, res, hexo);
            } else {
                res.writeHead(404);
                res.end();
            }
        } catch (error) {
            handleError(res, error);
        }
    };
}

module.exports = createMiddleware;
