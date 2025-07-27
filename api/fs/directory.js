const path = require("node:path");
const fs = require("hexo-fs");

const { checkPath } = require("../utils");

/**
 * Handles the requests to /fs/directory.
 * @param {import("connect").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handleRequest(req, res, hexo) {
    if (req.method === "GET") {
        handeleGet(req, res, hexo);
    } else {
        res.writeHead(405);
        res.end();
    }
}

/**
 * Handles the GET requests to /fs/directory.
 * @param {import("connect").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handeleGet(req, res, hexo) {
    const reqURL = new URL(req.url, "http://localhost/");
    const directoryPath = path.join(
        hexo.base_dir,
        reqURL.searchParams.get("path"),
        "./"
    );

    checkPath(directoryPath, hexo);
    const directoryEntries = fs.readdirSync(directoryPath, {
        withFileTypes: true,
    });

    const contents = [];
    for (const entry of directoryEntries) {
        contents.push({
            type: entry.isDirectory() ? "directory" : "file",
            name: entry.name,
        });
    }

    res.writeHead(200);
    res.end(JSON.stringify({ contents }));
}

module.exports = handleRequest;
