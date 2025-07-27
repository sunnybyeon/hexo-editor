class APIError extends Error {
    /**
     * @param {string} message
     * @param {number} statusCode
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.HTTPStatusCode = statusCode;
    }
}

/**
 * Ends the HTTP Response with an error.
 * @param {import("node:http").ServerResponse} res
 * @param {any} error
 */
function handleError(res, error) {
    res.writeHead(error?.HTTPStatusCode || 500);
    res.end(JSON.stringify({ error: String(error) }));
}

module.exports = { APIError, handleError };
