import { type S3Event } from "aws-lambda";

import { extractTextFromObject } from "./extractTextFromObject";
import { indexText } from "./indexText";

export const handler = async (event: S3Event, _: any = {}) => {
  console.log("Running handler");

  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = event.Records[0].s3.object.key;

  // console.log(bucketName);
  // console.log(objectKey);

  const result = await extractTextFromObject(bucketName, objectKey);
  // console.log(result)

  const index = await indexText(bucketName, objectKey, result);
  // console.log(index)
  return index;
};
