import axios from "axios";
import httpExceptionHandler from "./http-exception-handler";

/**
 * High-level function to coordinate fetching data from the JazzHR API.
 */
const fetch = (apiKey, page) => {
    try {
        const res = axios({
            method: `get`,
            url: `https://api.resumatorapi.com/v1/jobs/page/${page}?apikey=${apiKey}`
        });
        return res;
    } catch (e) {
        httpExceptionHandler(e);
    }
};

/**
 * Recursive function to coordinate fetching data from the JazzHR API.
 */
export const getApiData = async ({ apiKey, verbose, typePrefix, page = 1 }) => {
    let entities = [];

    return fetch(apiKey, page)
        .then((res) => {
            entities = entities.concat(res.data);
            return fetch(apiKey, page + 1);
        })
        .catch(() => {
            return entities;
        });
};
