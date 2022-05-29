import { getApiData } from "./utils/fetch";

const typePrefix = `jazzhr__`;

export const createSchemaCustomization = async ({ actions }) => {
    const { createTypes } = actions;
};

export const sourceNodes = async (
    { actions, getNode, store, cache, createNodeId, createContentDigest },
    { apiKey, verboseOutput }
) => {
    const { createNode } = actions;

    let entities = await getApiData({
        apiKey,
        verboseOutput,
        typePrefix
    });
};
