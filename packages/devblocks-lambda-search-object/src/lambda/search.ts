const { defaultProvider } = require("@aws-sdk/credential-provider-node"); // V3 SDK.
const { Client } = require("@opensearch-project/opensearch");
const { AwsSigv4Signer } = require("@opensearch-project/opensearch/aws");

const client = new Client({
  ...AwsSigv4Signer({
    region: process.env.REGION ?? "us-east-1",
    service: "es",
    getCredentials: () => {
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: `https://${process.env.OPENSEARCH_ENDPOINT}`, // OpenSearch domain URL
});

const createNewIndex = async (indexName: string): Promise<any> => {
  const indexExists = await client.indices.exists({ index: indexName });
  if (indexExists.statusCode === 200) return;

  return await client.indices.create({
    index: indexName,
    body: {
      mappings: {
        properties: {
          text: { type: "text" },
          date: { type: "date" },
          location: { type: "geo_point" },
          tags: { type: "keyword" },
          bucketName: { type: "text" },
          objectKey: { type: "text" },
        },
      },
    },
  });
};

export const search = async (text: string, location: string, date: Date, tags: Array<string>) => {
  // Create a new index if it doesn't exist
  const indexName = "documents";
  await createNewIndex(indexName);

  // const query = {
  //   query: {
  //     fuzzy: {
  //       // Fuzzy search for the text
  //       text: {
  //         value: text,
  //         fuzziness: "AUTO",
  //       },
  //     },
  //   },
  // };

  const must: Array<any> = [];

  if (text) {
    must.push({
      fuzzy: {
        text: {
          value: text,
          fuzziness: "AUTO",
        },
      },
    });
  }
  if (location) {
    must.push({
      geo_distance: {
        distance: "200km",
        location,
      },
    });
  }

  if (date) {
    must.push({
      range: {
        date: {
          eq: date,
        },
      },
    });
  }

  if (tags) {
    must.push({
      terms: {
        tags,
      },
    });
  }

  const query = {
    query: {
      bool: {
        must,
      },
    },
  };

  const response = await client.search({
    index: indexName,
    body: query,
  });

  return response.body.hits;
};
