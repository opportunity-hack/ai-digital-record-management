import { APP_NAME, Constants } from "@devblocks/models";
import type { AmplifyStackConfiguration } from "@devblocks/models/src/models/ServiceConfiguration";
import type { StackProps } from "aws-cdk-lib";
import { aws_amplify, CfnOutput, Stack } from "aws-cdk-lib";
import type { Construct } from "constructs";

import { AmplifyAuthStack } from "./AmplifyAuthStack";

export class AmplifyStack extends Stack {
  /**
   * Constructor for the Amplify Stack
   *
   * @param scope the scope of the stack
   * @param id the name to give the stack on AWS Cloudformation.
   * @param props various properties to be passed in
   */
  constructor(scope: Construct, id: string, props: StackProps & { amplifyStackConfiguration: AmplifyStackConfiguration; stage: string; searchDocumentEndpoint: string }) {
    super(scope, id, props);

    // The website uses NextJS SSG which will be deployed by uploading the .zip file to Amplify.
    const amplifyApp = new aws_amplify.CfnApp(this, `${props.amplifyStackConfiguration.amplifyAppName}`, {
      name: `${props.amplifyStackConfiguration.amplifyAppName}`,
      iamServiceRole: `${props.amplifyStackConfiguration.amplifyServiceRoleName}`,
      description: `The ${APP_NAME} AWS Amplify Application`,
      environmentVariables: [{ name: "SEARCH_DOCUMENT_API_ENDPOINT", value: props.searchDocumentEndpoint }],
    });

    const authStack = new AmplifyAuthStack(this, `${props.amplifyStackConfiguration.amplifyAuthConfiguration.stackName}`, {
      amplifyAuthConfiguration: props.amplifyStackConfiguration.amplifyAuthConfiguration,
      env: props.env,
    });

    // Create the cloudformation outputs that will be outputted to the resulting file used by the Amplify frontend
    if (amplifyApp) {
      new CfnOutput(this, Constants.AmplifyConstants.AMPLIFY_ID, {
        exportName: Constants.AmplifyConstants.AMPLIFY_ID.replaceAll("_", "-"),
        value: amplifyApp.attrAppId,
      });

      new CfnOutput(this, Constants.AmplifyConstants.REGION, {
        exportName: Constants.AmplifyConstants.REGION.replaceAll("_", "-"),
        value: props.env!.region!,
      });

      new CfnOutput(this, Constants.AmplifyConstants.COGNITO_REGION, {
        exportName: Constants.AmplifyConstants.COGNITO_REGION.replaceAll("_", "-"),
        value: authStack.region,
      });
    }

    new CfnOutput(this, Constants.AmplifyConstants.COGNITO_IDENTITY_POOL_ID, {
      exportName: Constants.AmplifyConstants.COGNITO_IDENTITY_POOL_ID.replaceAll("_", "-"),
      value: authStack.cognitoIdentityPoolId,
    });

    new CfnOutput(this, Constants.AmplifyConstants.USER_POOLS_ID, {
      exportName: Constants.AmplifyConstants.USER_POOLS_ID.replaceAll("_", "-"),
      value: authStack.cognitoUserPoolId,
    });

    new CfnOutput(this, Constants.AmplifyConstants.USER_POOLS_WEB_CLIENT_ID, {
      exportName: Constants.AmplifyConstants.USER_POOLS_WEB_CLIENT_ID.replaceAll("_", "-"),
      value: authStack.cognitoUserPoolClientId,
    });
  }
}
