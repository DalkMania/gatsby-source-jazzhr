import {
  normalizeEntities,
  standardizeKeys,
  standardizeDates,
  createGatsbyIds,
  createNodesFromEntities,
  getValidKey,
} from "../utils/normalize"

let entities = require(`./sample-data/data.json`)

describe(`Process JazzHR data`, () => {
  it(`Creates entities from object collections of entities`, () => {
    entities = normalizeEntities(entities)
  })
  it(`Standardizes ids & cleans keys`, () => {
    entities = standardizeKeys(entities)
    expect(entities).toMatchSnapshot()
  })
  it(`Converts to use only GMT dates`, () => {
    entities = standardizeDates(entities)
    expect(entities).toMatchSnapshot()
  })
  it(`creates Gatsby IDs for each entity`, () => {
    const createNodeId = jest.fn()
    createNodeId.mockReturnValue(`uuid-from-gatsby`)
    entities = createGatsbyIds(createNodeId, entities)
    expect(entities).toMatchSnapshot()
  })
  it(`creates nodes for each entry`, () => {
    const createNode = jest.fn()
    const createContentDigest = jest.fn().mockReturnValue(`contentDigest`)
    createNodesFromEntities({
      entities,
      createNode,
      createContentDigest,
    })
    expect(createNode.mock.calls).toMatchSnapshot()
  })
})

describe(`getValidKey`, () => {
  it(`It passes a key through untouched that passes`, () => {
    expect(
      getValidKey({
        key: `hi`,
      })
    ).toBe(`hi`)
  })
  it(`It prefixes keys that start with numbers`, () => {
    expect(
      getValidKey({
        key: `0hi`,
      })
    ).toBe(`jazzhr_0hi`)
  })
  it(`It prefixes keys that conflict with default Gatsby fields`, () => {
    expect(
      getValidKey({
        key: `children`,
      })
    ).toBe(`jazzhr_children`)
  })
  it(`It replaces invalid characters`, () => {
    expect(
      getValidKey({
        key: `h:i`,
      })
    ).toBe(`h_i`)
  })
})
