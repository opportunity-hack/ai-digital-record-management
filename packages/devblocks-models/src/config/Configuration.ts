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
};
