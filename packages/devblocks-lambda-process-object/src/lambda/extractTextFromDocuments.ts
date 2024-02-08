import type { DetectDocumentTextCommandInput } from "@aws-sdk/client-textract";
import { DetectDocumentTextCommand, StartDocumentTextDetectionCommand, TextractClient } from "@aws-sdk/client-textract";

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

  // Text detection TEST
  const testinput = {
    DocumentLocation: {
      S3Object: {
        Bucket: bucketName,
        Name: objectKey,
      },
    },
    ClientRequestToken: `${bucketName}-${objectKey}`,
    JobTag: `${bucketName}-${objectKey}`,
    NotificationChannel: {
      RoleArn: process.env.STORE_TEXT_TEXTRACT_ROLE_ARN,
      SNSTopicArn: process.env.STORE_TEXT_TEXTRACT_TOPIC_ARN,
    },
  };
  const testcommand = new StartDocumentTextDetectionCommand(testinput);
  console.log("StartDocumentTextDetectionCommand", testcommand);

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
