import axios from "axios"
import httpExceptionHandler from "./http-exception-handler"

/**
 * High-level recursive function to coordinate fetching data from the JazzHR API.
 */
const fetch = async (apiKey, page) => {
  const query = `https://api.resumatorapi.com/v1/jobs/page/${page}?apikey=${apiKey}`
  try {
    const response = await axios.get(query)
    const data = response.data
    if (data.length > 99) {
      return data.concat(await fetch(apiKey, page + 1))
    } else {
      return data
    }
  } catch (e) {
    httpExceptionHandler(e)
  }
}

/**
 * Function to coordinate fetching data from the JazzHR API.
 */
export const getApiData = async ({ apiKey, verbose, typePrefix, page = 1 }) => {
  return fetch(apiKey, page).then(data => data)
}
