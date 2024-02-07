import { type S3Event } from "aws-lambda";

import { deleteText } from "./deleteText";

export const handler = async (event: S3Event, _: any = {}) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = event.Records[0].s3.object.key;

  const index = await deleteText(bucketName, objectKey);
  console.log(index);
  return index;
};
