import deepMapKeys from "deep-map-keys"

const conflictFieldPrefix = `jazzhr_`
// restrictedNodeFields from here https://www.gatsbyjs.com/docs/node-interface/
const restrictedNodeFields = [`id`, `children`, `parent`, `fields`, `internal`]

/**
 * Create the Graph QL Node
 *
 * @param {any} ent
 * @param {any} type
 * @param {any} createNode
 */
async function createGraphQLNode(
  ent,
  type,
  createNode,
  store,
  cache,
  createContentDigest
) {
  const id = !ent.id ? (!ent.ID ? 0 : ent.ID) : ent.id
  let node = {
    id: `${type}_${id.toString()}`,
    children: [],
    parent: null,
    internal: {
      type: type,
    },
  }
  node = recursiveAddFields(ent, node)
  node.internal.content = JSON.stringify(node)
  node.internal.contentDigest = createContentDigest(node)
  createNode(node)
}
const _createGraphQLNode = createGraphQLNode
export { _createGraphQLNode as createGraphQLNode }

/**
 * Add fields recursively
 *
 * @param {any} ent
 * @param {any} newEnt
 * @returns the new node
 */
function recursiveAddFields(ent, newEnt) {
  for (const k of Object.keys(ent)) {
    if (!newEnt.hasOwnProperty(k)) {
      const key = getValidKey(k)
      newEnt[key] = ent[k]
      // Nested Objects & Arrays of Objects
      if (typeof ent[key] === `object`) {
        if (!Array.isArray(ent[key]) && ent[key] != null) {
          newEnt[key] = recursiveAddFields(ent[key], {})
        } else if (Array.isArray(ent[key])) {
          if (ent[key].length > 0 && typeof ent[key][0] === `object`) {
            ent[k].map((el, i) => {
              newEnt[key][i] = recursiveAddFields(el, {})
            })
          }
        }
      }
    }
  }
  return newEnt
}
const _recursiveAddFields = recursiveAddFields
export { _recursiveAddFields as recursiveAddFields }

/**
 * Validate the GraphQL naming conventions & protect specific fields.
 *
 * @param {any} key
 * @returns the valid name
 */
function getValidKey({ key, verbose = false }) {
  let nkey = String(key)
  const NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/
  let changed = false
  // Replace invalid characters
  if (!NAME_RX.test(nkey)) {
    changed = true
    nkey = nkey.replace(/-|__|:|\.|\s/g, `_`)
  }
  // Prefix if first character isn't a letter.
  if (!NAME_RX.test(nkey.slice(0, 1))) {
    changed = true
    nkey = `${conflictFieldPrefix}${nkey}`
  }
  if (restrictedNodeFields.includes(nkey)) {
    changed = true
    nkey = `${conflictFieldPrefix}${nkey}`.replace(/-|__|:|\.|\s/g, `_`)
  }
  if (changed && verbose)
    console.log(
      `Object with key "${key}" breaks GraphQL naming convention. Renamed to "${nkey}"`
    )

  return nkey
}

const _getValidKey = getValidKey
export { _getValidKey as getValidKey }

// Create entities from the few the lever API returns as an object for presumably
// legacy reasons.
export function normalizeEntities(entities) {
  return entities.reduce((acc, e) => acc.concat(e), [])
}

// Standardize ids + make sure keys are valid.
export function standardizeKeys(entities) {
  return entities.map(e =>
    deepMapKeys(e, key =>
      key === `ID` ? getValidKey({ key: `id` }) : getValidKey({ key })
    )
  )
}

// Standardize dates on ISO 8601 version.
export function standardizeDates(entities) {
  return entities.map(e => {
    if (e.original_open_date) {
      e.original_open_date = new Date(e.original_open_date).toISOString()
    }
    return e
  })
}

export function createGatsbyIds(createNodeId, entities) {
  return entities.map(e => {
    e.jazzhr_id = e.id
    e.id = createNodeId(e.jazzhr_id.toString())
    return e
  })
}

export function createNodesFromEntities({
  entities,
  createNode,
  createContentDigest,
}) {
  entities.forEach(e => {
    const { ...entity } = e
    const node = {
      ...entity,
      parent: null,
      children: [],
      internal: {
        type: `jazzHr`,
        contentDigest: createContentDigest(entity),
      },
    }
    createNode(node)
  })
}
