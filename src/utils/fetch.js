import axios from `axios`
import httpExceptionHandler from `./http-exception-handler`

/**
 * High-level function to coordinate fetching data from the JazzHR API.
 */
const fetch = async ({ apiKey, verbose, typePrefix }) => {
    let entities = []
  try {
    const res = await axios({
      method: `get`,
      url: `https://api.resumatorapi.com/v1/jobs?apikey=${apiKey}`,
    })
    entities = res.data
  } catch (e) {
    httpExceptionHandler(e)
  }

  return entities
}

export default fetch;