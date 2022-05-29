/**
 * Handles HTTP Exceptions (axios)
 *
 * @param {any} e
 */
const httpExceptionHandler = (e) => {
    const {
        status,
        statusText,
        data: { message }
    } = e.response;
    console.log(`The server response was "${status} ${statusText}"`);
    if (message) {
        console.log(`Inner exception message : "${message}"`);
    }
};

export default httpExceptionHandler;
