import { type S3Event } from "aws-lambda";
import AWS from "aws-sdk";

import { indexText } from "./indexText";

export const handler = async (event: S3Event, _: any = {}) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = event.Records[0].s3.object.key;

  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };
  const response = await s3.getObject(params).promise() as { Body: Buffer };
  const text = JSON.parse(response.Body.toString("utf-8")).results.transcripts[0].transcript;

  const index = await indexText(bucketName, objectKey.slice(0, -5).slice(14), text);
  return index;
};
