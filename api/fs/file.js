const path = require("node:path");
const fs = require("hexo-fs");

const { checkPath } = require("../utils");
const { handleError } = require("../error");

/**
 * Handles the requests to /fs/file.
 * @param {import("connect").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handleRequest(req, res, hexo) {
    if (req.method === "GET") {
        handleGet(req, res, hexo);
    } else if (req.method === "POST") {
        handlePost(req, res, hexo);
    } else {
        res.writeHead(405);
        res.end();
    }
}

/**
 * Handles the GET requests to /fs/file.
 * @param {import("connect").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handleGet(req, res, hexo) {
    const reqURL = new URL(req.url, "http://localhost/");
    const filePath = path.join(hexo.base_dir, reqURL.searchParams.get("path"));

    checkPath(filePath, hexo);
    const data = fs.readFileSync(filePath);

    res.writeHead(200);
    res.end(JSON.stringify({ data }));
}

/**
 * Handles the POST requests to /fs/file.
 * @param {import("connect").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("hexo")} hexo
 */
function handlePost(req, res, hexo) {
    let reqBody = "";
    req.on("data", (chunk) => (reqBody += chunk));
    req.on("end", () => {
        try {
            /** @type {{path: string, data: string}} */
            const { path: requestFilePath, data } = JSON.parse(reqBody);
            const filePath = path.join(hexo.base_dir, requestFilePath);

            checkPath(filePath, hexo);
            fs.writeFileSync(path.join(hexo.base_dir, requestFilePath), data);

            res.writeHead(201);
            res.end();
        } catch (error) {
            handleError(res, error);
        }
    });
}

module.exports = handleRequest;
