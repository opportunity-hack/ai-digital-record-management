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

const createNewIndex = async (indexName: string) => {
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

export const editObject = async (bucketName: string, objectKey: string, text: string | null, location: string | null, date: string | null, tags: Array<string>) => {
  // Create a new index if it doesn't exist
  const indexName = "documents";
  await createNewIndex(indexName);
  await createNewTagIndex();

  const id = `${bucketName}-${objectKey}`;

  const document = {
    text: `${text?.toLowerCase()}`,
    date,
    location,
    tags: tags.map((tag) => tag.toLowerCase()),
    bucketName,
    objectKey,
  };

  const response = await client.index({
    id,
    index: indexName,
    body: document,
    refresh: true,
  });
  
  if (tags && tags.length > 0) {
    tags.map((tag) => client.index({
      id: tag.toLowerCase(),
      index: "tags",
      body: {
        text: tag.toLowerCase(),
      },
    }));
  }

  return response;
};
