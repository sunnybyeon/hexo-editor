/**
 * Handles the requests to /hexo/posts.
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
 * Handles the GET requests to /hexo/posts.
 * @param {import("node:http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handleGet(res, hexo) {
    const posts = hexo.model("Post").map((post) => ({
        title: post.title,
        source: `/${hexo.config.source_dir}/${post.source}`,
        date: post.date,
    }));

    res.writeHead(200);
    res.end(JSON.stringify({ posts }));
}

module.exports = handleRequest;
