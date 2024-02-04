import { Constants, INFRA_CONFIG } from "@devblocks/models";
import { Amplify } from "aws-amplify";

import envInfo from "@root/local-env-info.json";
import APINames from "@/constants/api_names";

export const initialize = () => {
  const baseAmplifyCDKStackName: string = INFRA_CONFIG.amplifyStackConfiguration.stackName;
  const documentSearchCDKStackName: string = INFRA_CONFIG.documentSearchStackConfiguration.stackName;
  // Load the exports provisioned by AWS CDK.
  // The comment below turns off ESLint just for this line.
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const cdkExport = require(`@root/exports/cdk-exports-${envInfo.envName}.json`);
  console.log(cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.SEARCH_DOCUMENT_API_ENDPOINT.replaceAll("_", "")]);
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
          name: APINames.searchDocuments,
          endpoint: cdkExport[documentSearchCDKStackName][Constants.DocumentSearchConstants.SEARCH_DOCUMENT_API_ENDPOINT.replaceAll("_", "")],
        }
      ]
    }
  });
};
