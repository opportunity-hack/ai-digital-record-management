const { defaultProvider } = require("@aws-sdk/credential-provider-node"); // V3 SDK.
const { Client } = require("@opensearch-project/opensearch");
const { AwsSigv4Signer } = require("@opensearch-project/opensearch/aws");

const client = new Client({
  ...AwsSigv4Signer({
    region: process.env.REGION || "us-east-1",
    service: "es",
    getCredentials: () => {
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: `https://${process.env.OPENSEARCH_ENDPOINT}` || "", // OpenSearch domain URL
});

const createNewIndex = async (indexName: string) => {
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

export const indexText = async (bucketName: string, objectKey: string, text: string, tags: Array<string>) => {
  // Create a new index if it doesn't exist
  const indexName = "documents";
  await createNewIndex(indexName);

  const id = `${bucketName}-${objectKey}`;

  const document = {
    text: `${text}\n\n${tags.join(" ")}`,
    date: null,
    location: null,
    tags,
    bucketName,
    objectKey,
  };

  const response = await client.index({
    id,
    index: indexName,
    body: document,
    refresh: true,
  });

  return response;
};
