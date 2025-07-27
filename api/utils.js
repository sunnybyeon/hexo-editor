const { APIError } = require("./error");

/**
 * Throws error if the path is not under the hexo base directory.
 * @param {string} filePath
 * @param {import("hexo")} hexo
 */
function checkPath(filePath, hexo) {
    if (!filePath.startsWith(hexo.base_dir)) {
        throw new APIError(
            "Permission denied. You can only open files/directories under the hexo blog base directory.",
            403
        );
    }
}

module.exports = { checkPath };
