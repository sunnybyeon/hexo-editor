const path = require("node:path");

const serveAPI = require("./api");
const serveStatic = require("serve-static");

hexo.extend.filter.register("server_middleware", addMiddlewares);

/**
 * @param {import("connect").Server} app
 */
function addMiddlewares(app) {
    app.use(
        hexo.config.root + "editor/",
        serveStatic(path.join(__dirname, "./public/"))
    );
    app.use(hexo.config.root + "editor/api/", serveAPI(hexo));
}
