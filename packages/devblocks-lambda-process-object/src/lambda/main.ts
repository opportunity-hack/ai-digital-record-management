import { type S3Event } from "aws-lambda";

import { extractTagsFromObject } from "./extractTagsFromObject";
import { extractTextFromObject } from "./extractTextFromObject";
import { indexText } from "./indexText";

export const handler = async (event: S3Event, _: any = {}) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = event.Records[0].s3.object.key;

  if (!objectKey) return
  
  console.log(bucketName);
  console.log(objectKey);

  const tags = (await extractTagsFromObject(bucketName, objectKey)) as string[];
  const text = await extractTextFromObject(bucketName, objectKey);
  const index = await indexText(bucketName, objectKey, text, tags);

  console.log(tags);
  console.log(text);
  console.log(index);

  return index;
};
