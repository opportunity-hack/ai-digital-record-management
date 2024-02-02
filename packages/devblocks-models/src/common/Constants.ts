/** ******************************************************
 * File used to define a namespace, to be used in laying
 * out all the constants used throughout.
 ******************************************************* */

export namespace Constants {
  // Amplify constants used in mapping the CDK outputs to the AWS exports Amplify file
  export namespace AmplifyConstants {
    // General related
    export const AMPLIFY_ID: string = "amplify_app_id";
    export const REGION: string = "aws_project_region";

    // Cognito related
    export const COGNITO_IDENTITY_POOL_ID: string = "aws_cognito_identity_pool_id";
    export const COGNITO_REGION: string = "aws_cognito_region";
    export const USER_POOLS_ID: string = "aws_user_pools_id";
    export const USER_POOLS_WEB_CLIENT_ID: string = "aws_user_pools_web_client_id";
  }

  export namespace DocumentSearchConstants {
    export const SEARCH_DOCUMENT_API_ENDPOINT: string = "search_document_api_endpoint";
    export const SEARCH_DOCUMENT_API_ENDPOINT_REGION: string = "search_document_api_endpoint_region";
  }
}
