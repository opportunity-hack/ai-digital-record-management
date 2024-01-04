import { Constants, INFRA_CONFIG } from "@devblocks/models";
import { Amplify } from "aws-amplify";

import envInfo from "@root/local-env-info.json";

export const initialize = () => {
  const baseAmplifyCDKStackName: string = INFRA_CONFIG.amplifyStackConfiguration.stackName;

  // Load the exports provisioned by AWS CDK.
  // The comment below turns off ESLint just for this line.
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const cdkExport = require(`@root/exports/cdk-exports-${envInfo.envName}.json`);

  // Set up Amplify configuration
  Amplify.configure({
    // General Amplify configuration
    [Constants.AmplifyConstants.REGION]: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.REGION.replaceAll("_", "")],

    // Amplify Auth configuration
    [Constants.AmplifyConstants.COGNITO_REGION]: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.COGNITO_REGION.replaceAll("_", "")],
    [Constants.AmplifyConstants.USER_POOLS_ID]: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.USER_POOLS_ID.replaceAll("_", "")],
    [Constants.AmplifyConstants.USER_POOLS_WEB_CLIENT_ID]: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.USER_POOLS_WEB_CLIENT_ID.replaceAll("_", "")],
    [Constants.AmplifyConstants.COGNITO_IDENTITY_POOL_ID]: cdkExport[baseAmplifyCDKStackName][Constants.AmplifyConstants.COGNITO_IDENTITY_POOL_ID.replaceAll("_", "")],
  });
};
