import type { DetectDocumentTextCommandInput } from "@aws-sdk/client-textract";
import { DetectDocumentTextCommand, TextractClient } from "@aws-sdk/client-textract";

const combineBlockText = async (blocks: any) => {
  let text = "";
  blocks.forEach((block) => {
    if (block.BlockType === "LINE") {
      text += `${block.Text}\n`;
    }
  });
  return text;
};

export const extractTextFromDocument = async (bucketName: string, objectKey: string) => {
  const textractClient = new TextractClient({ region: process.env.REGION });
  const input: DetectDocumentTextCommandInput = {
    Document: {
      S3Object: {
        Bucket: bucketName,
        Name: objectKey,
      },
    },
  };
  const command = new DetectDocumentTextCommand(input);
  const response = await textractClient.send(command);
  const blocks = response.Blocks;
  return combineBlockText(blocks);
};
