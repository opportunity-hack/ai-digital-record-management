import { extractTextFromDocument } from "./extractTextFromDocuments";
import AWS from 'aws-sdk'
import JSZip from "jszip";
import mammoth from "mammoth";
import fs from "node:fs"

const s3 = new AWS.S3();
async function downloadFileFromS3(bucket, key) {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const response = await s3.getObject(params).promise();
  return response.Body;
}

async function extractTextFromDoc(bucketName: string, objectKey: string) {
  const docxBuffer = await downloadFileFromS3(bucketName, objectKey) as Buffer;
  const regex = /[a-zA-Z]+/g;
  const matches = docxBuffer.toString().match(regex);
  const value = matches ? matches.join(' ') : '';
  return value
}

async function extractTextFromDocx(bucketName: string, objectKey: string) {
  const docxBuffer = await downloadFileFromS3(bucketName, objectKey) as Buffer;
  const {value} = await mammoth.extractRawText({ buffer: docxBuffer }); console.log(value)
  return value
}

export const extractTextFromObject = async (bucketName: string, objectKey: string) => {
  const extension = objectKey.split(".").pop();

  switch (extension) {
    case "docx":
        return await extractTextFromDocx(bucketName, objectKey);
    case "doc":
        return await extractTextFromDoc(bucketName, objectKey)
    case "png":
    case "jpg":
    case "jpeg":
    case "tiff":
    case "pdf":
      return extractTextFromDocument(bucketName, objectKey);
    default:
      return "File type not supported!";
  }
};
