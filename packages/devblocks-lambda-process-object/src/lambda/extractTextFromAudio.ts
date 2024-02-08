import type { StartTranscriptionJobRequest } from "@aws-sdk/client-transcribe";
import { StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe"; // ES Modules import

const client = new TranscribeClient();
export const extractTextFromAudio = async (bucketName: string, objectKey: string) => {
  const jobName = `transcription-job-${Date.now()}`;
  const languageCode = "en-US";
  const mediaUri = `s3://${bucketName}/${objectKey}`;
  const outputObjectKey = `transcription/${objectKey}.json`;

  // Set up the Transcribe parameters
  const params: StartTranscriptionJobRequest = {
    TranscriptionJobName: jobName,
    LanguageCode: languageCode,
    Media: {
      MediaFileUri: mediaUri,
    },
    OutputBucketName: bucketName, // Optional: specify an S3 bucket for the transcription results
    OutputKey: outputObjectKey, // Optional: specify an S3 key for the transcription results
  };
  const command = new StartTranscriptionJobCommand(params);
  const response = await client.send(command);
  console.log(response);

  return "";
};
