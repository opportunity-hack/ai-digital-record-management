import type { StageConfiguration } from "../models/StageConfiguration";

export const APP_NAME: string = "opportunity";
export const ENVIRONMENT_NAME: string = APP_NAME.toLowerCase();

export const INFRA_CONFIG: StageConfiguration = {
  amplifyStackConfiguration: {
    stackName: `${ENVIRONMENT_NAME}-amplify-stack`,
    amplifyAppName: `${ENVIRONMENT_NAME}`,
    amplifyServiceRoleName: `${ENVIRONMENT_NAME}-application-service-role`,

    amplifyAuthConfiguration: {
      stackName: `${ENVIRONMENT_NAME}-amplify-auth-stack`,
      userPoolName: `${ENVIRONMENT_NAME}-user-pool`,
      userPoolClientName: `${ENVIRONMENT_NAME}-user-pool-client`,
      userPoolIdentityName: `${ENVIRONMENT_NAME}-user-pool-identity`,
      unauthenticatedRoleName: `${ENVIRONMENT_NAME}-unauthenticated-role`,
      authenticatedRoleName: `${ENVIRONMENT_NAME}-authenticated-role`,
    },
  },

  documentSearchStackConfiguration: {
    stackName: `${ENVIRONMENT_NAME}-document-search-stack`,
    documentStorageBucketName: `${ENVIRONMENT_NAME}-bucket-storage`,
    bulkUploadDocumentsLambdaName: `${ENVIRONMENT_NAME}-upload-document-lambda`,
    deleteDocumentLambdaName: `${ENVIRONMENT_NAME}-delete-document-lambda`,

    processDocumentLambdaName: `${ENVIRONMENT_NAME}-process-document-lambda`,
    processDocumentStateMachineName: `${ENVIRONMENT_NAME}-process-document-state-machine`,
    objectCreatedEventRuleName: `${ENVIRONMENT_NAME}-object-created-event-rule`,
    documentSearchIndexName: `${ENVIRONMENT_NAME}-document-search-index`,

    searchDocumentApiName: `${ENVIRONMENT_NAME}-search-document-api`,
    searchDocumentLambdaName: `${ENVIRONMENT_NAME}-search-document-lambda`,
    searchDocumentDeploymentName: `${ENVIRONMENT_NAME}-search-document-deployment`,
    searchDocumentStageName: `${ENVIRONMENT_NAME}-search-document-stage`,
    searchDocumentLogsName: `${ENVIRONMENT_NAME}-search-document-logs`,

    storeTextTextractLambdaName: `${ENVIRONMENT_NAME}-store-text-textract-lambda`,
    storeTextTranscribeLambdaName: `${ENVIRONMENT_NAME}-store-text-transcribe-lambda`,
    storeTagsRekognitionLambdaName: `${ENVIRONMENT_NAME}-store-tags-rekognition-lambda`,
    storeTextTextractTopicName: `${ENVIRONMENT_NAME}-store-text-textract-topic`,
    storeTextTranscribeTopicName: `${ENVIRONMENT_NAME}-store-text-transcribe-topic`,
    storeTagsRekognitionTopicName: `${ENVIRONMENT_NAME}-store-tags-rekognition-topic`,
  },
};
