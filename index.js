const serveAPI = require("./api");

hexo.extend.filter.register("server_middleware", addMiddlewares);

/**
 * @param {import("connect").Server} app
 */
function addMiddlewares(app) {
    app.use(hexo.config.root + "editor/api/", serveAPI(hexo));
}
