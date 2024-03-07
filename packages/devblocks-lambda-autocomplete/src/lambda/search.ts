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

const createNewTagIndex = async () => {
  const indexExists = await client.indices.exists({ index: "tags" });
  if (indexExists.statusCode === 200) return;
  await client.indices.create({
    index: "tags",
    body: {
      mappings: {
        properties: {
          text: { type: "text" }
        },
      },
    },
  });
}

const createNewIndex = async (indexName: string): Promise<any> => {
  const indexExists = await client.indices.exists({ index: indexName });
  if (indexExists.statusCode === 200) return;

  return await client.indices.create({
    index: indexName,
    body: {
      mappings: {
        properties: {
          text: { type: "text" },
          date: { type: "text" },
          location: { type: "geo_point" },
          tags: { type: "text" },
          bucketName: { type: "text" },
          objectKey: { type: "text" },
        },
      },
    },
  });
};

export const search = async (text: string) => {
  // Create a new index if it doesn't exist
  const indexName = "documents";
  await createNewIndex(indexName);
  await createNewTagIndex();

  let query: any = {
    query: {
      match_phrase_prefix: {
        text: {
          query: text
        }
      }
    },
  };

  if (text.length === 0) {
    query = {
      query: {
        size: 100,
        match_all: {}
      }
    };
  }

  const response = await client.search({
    index: "tags",
    body: query,
  });

  return response.body.hits.hits.map((hit: any) => hit._source.text);
};
