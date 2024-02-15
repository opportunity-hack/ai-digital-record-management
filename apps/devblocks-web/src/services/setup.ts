// @ts-nocheck
import { Constants, INFRA_CONFIG } from "@devblocks/models";
import { Amplify } from "aws-amplify";

import API_NAMES from "@/constants/api-names";
import cdkExport from "@root/exports/cdk-exports-dev.json"

export const initialize = () => {
  const baseAmplifyCDKStackName: string = INFRA_CONFIG.amplifyStackConfiguration.stackName;
  const documentSearchCDKStackName: string = INFRA_CONFIG.documentSearchStackConfiguration.stackName;
  // Load the exports provisioned by AWS CDK.
  // The comment below turns off ESLint just for this line.
  // eslint-disable-next-line global-require, import/no-dynamic-require
  
  console.log(cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.DOCUMENT_BUCKET_REGION.replaceAll("_", "")]);
  Amplify.configure({
    Auth: {
      identityPoolId: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.COGNITO_IDENTITY_POOL_ID.replaceAll("_", "")],
      region: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.COGNITO_REGION.replaceAll("_", "")],
      userPoolId: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.USER_POOLS_ID.replaceAll("_", "")],
      userPoolWebClientId: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.USER_POOLS_WEB_CLIENT_ID.replaceAll("_", "")],
    },
    API: {
      endpoints: [
        {
          name: API_NAMES.searchDocuments,
          endpoint: cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.SEARCH_DOCUMENT_API_ENDPOINT.replaceAll("_", "")],
        },
        {
          name: API_NAMES.editDocument,
          endpoint: cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.EDIT_DOCUMENT_API_ENDPOINT.replaceAll("_", "")],
        },
        {
          name: API_NAMES.getPresigned,
          endpoint: cdkExport[documentSearchCDKStackName].getpresignedurl,
        },
        {
          name: API_NAMES.getUpload,
          endpoint: cdkExport[documentSearchCDKStackName].getpresignedurlput,
        },
      ],
    },
    Storage: {
      S3: {
        bucket: `${cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.DOCUMENT_BUCKET_NAME.replaceAll("_", "")]}`,
        region: `${cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.DOCUMENT_BUCKET_REGION.replaceAll("_", "")]}`,
      },
    },
  });

  // Storage.configure({
  //   bucket: `${cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.DOCUMENT_BUCKET_NAME.replaceAll("_", "")]}`,
  //   region: `${cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.DOCUMENT_BUCKET_REGION.replaceAll("_", "")]}`,
  //   identityPoolId: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.COGNITO_IDENTITY_POOL_ID.replaceAll("_", "")],
  // });
};
