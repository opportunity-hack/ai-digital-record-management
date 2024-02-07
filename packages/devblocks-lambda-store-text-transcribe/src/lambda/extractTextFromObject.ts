import { extractTextFromDocument } from "./extractTextFromDocuments";

export const extractTextFromObject = async (bucketName: string, objectKey: string) => {
  const extension = objectKey.split(".").pop();

  switch (extension) {
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
