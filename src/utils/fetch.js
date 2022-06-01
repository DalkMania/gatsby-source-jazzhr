import axios from "axios"
import httpExceptionHandler from "./http-exception-handler"

/**
 * High-level recursive function to coordinate fetching data from the JazzHR API.
 */
const fetch = async (apiKey, page, verbose) => {
  const query = `https://api.resumatorapi.com/v1/jobs/page/${page}?apikey=${apiKey}`
  try {
    const response = await axios.get(query)
    const data = response.data
    if (verbose) {
      console.log(`Fetching JazzHR jobs from Page ${page}`)
    }
    if (data.length > 99) {
      return data.concat(await fetch(apiKey, page + 1, verbose))
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
export const getApiData = async ({ apiKey, verboseOutput, page = 1 }) => {
  return fetch(apiKey, page, verboseOutput).then(data => data)
}
