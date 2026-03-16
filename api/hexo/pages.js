/**
 * Handles the requests to /hexo/pages.
 * @param {import("connect").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handleRequest(req, res, hexo) {
    if (req.method === "GET") {
        handleGet(res, hexo);
    } else {
        res.writeHead(405);
        res.end();
    }
}

/**
 * Handles the GET requests to /hexo/pages.
 * @param {import("node:http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handleGet(res, hexo) {
    const pages = hexo.model("Page").map((page) => ({
        title: page.title,
        source: `/${hexo.config.source_dir}/${page.source}`,
        date: page.date,
    }));

    res.writeHead(200);
    res.end(JSON.stringify({ pages }));
}

module.exports = handleRequest;
