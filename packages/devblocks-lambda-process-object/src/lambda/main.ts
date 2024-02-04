import { type S3Event } from "aws-lambda";

import { extractTextFromObject } from "./extractTextFromObject";
import { indexText } from "./indexText";

export const handler = async (event: S3Event, _: any = {}) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = event.Records[0].s3.object.key;

  const result = await extractTextFromObject(bucketName, objectKey);
  const index = await indexText(bucketName, objectKey, result);

  console.log(result);
  console.log(index);

  return index;
};
