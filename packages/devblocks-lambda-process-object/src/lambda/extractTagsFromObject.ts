import { DetectLabelsCommand, RekognitionClient, StartLabelDetectionCommand } from "@aws-sdk/client-rekognition";

const client = new RekognitionClient({ region: process.env.REGION || "us-east-1" });

export const extractTagsFromObject = async (bucketName: string, objectKey: string) => {
  const extension = objectKey.split(".").pop();

  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg": {
      const command = new DetectLabelsCommand({
        Image: {
          S3Object: {
            Bucket: `${bucketName}`,
            Name: `${objectKey}`,
          },
        },
      });
      const response = (await client.send(command)).Labels?.flatMap((label) => [...label.Aliases.map((alias) => alias.Name), label.Name]);
      return response;
    }
    case "mp4":
      // {
      //   const command = new StartLabelDetectionCommand({
      //     Video: {
      //       S3Object: {
      //         Bucket: `${bucketName}`,
      //         Name: `${objectKey}`,
      //       },
      //     },
      //   });
      //   const response = (await client.send(command))['Labels']?.flatMap((label) => [...label['Aliases'].map((alias) => alias['Name']), label['Name']])
      //   return response
      // }
      return [];

    default:
      return [];
  }
};
