import { getApiData } from "./utils/fetch"
import * as normalize from "./utils/normalize"

export const createSchemaCustomization = async ({ actions }, { subDomain }) => {
  const { createFieldExtension, createTypes } = actions

  // Create URL Fields
  createFieldExtension({
    name: "applyUrl",
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `${subDomain}/apply/jobs/details/${source.board_code}`
        },
      }
    },
  })

  createFieldExtension({
    name: "customApplyUrl",
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `${subDomain}/apply/${source.board_code}/${normalize.slugify(
            source.title
          )}`
        },
      }
    },
  })

  const typeDefs = `
        type jazzHr implements Node {
            jazzhr_id: String
            title: String
            recruiter: String
            board_code: String
            department: String
            hiring_lead: String
            team_id: String
            state: String
            city: String
            zip: String
            description: String
            minimum_salary: String
            maximum_salary: String
            type: String
            notes: String
            original_open_date: String
            send_to_job_boards: String
            internal_code: String
            status: String
            questionnaire: String
            applyUrl: String @applyUrl
            customApplyUrl: String @customApplyUrl
        }
    `

  createTypes(typeDefs)
}

export const sourceNodes = async (
  { actions, getNode, store, cache, createNodeId, createContentDigest },
  { apiKey, verboseOutput }
) => {
  const { createNode } = actions

  let entities = await getApiData({
    apiKey,
    verboseOutput,
  })

  // Normalize data & create nodes
  //
  // Creates entities from object collections of entities
  entities = normalize.normalizeEntities(entities)

  // Standardizes ids & cleans keys
  entities = normalize.standardizeKeys(entities)

  // Converts to use only GMT dates
  entities = normalize.standardizeDates(entities)

  // creates Gatsby IDs for each entity
  entities = normalize.createGatsbyIds(createNodeId, entities)

  // creates nodes for each entry
  normalize.createNodesFromEntities({
    entities,
    createNode,
    createContentDigest,
  })

  return
}
