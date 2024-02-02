export interface AmplifyStackConfiguration {
  readonly stackName: string;
  readonly amplifyAppName: string;
  readonly amplifyServiceRoleName: string;
  readonly amplifyAuthConfiguration: AmplifyAuthConfiguration;
}

export interface AmplifyAuthConfiguration {
  readonly stackName: string;
  readonly userPoolName: string;
  readonly userPoolClientName: string;
  readonly userPoolIdentityName: string;
  readonly authenticatedRoleName: string;
  readonly unauthenticatedRoleName: string;
}

export interface DocumentSearchStackConfiguration {
  readonly stackName: string;
  readonly documentStorageBucketName: string;
  readonly bulkUploadDocumentsLambdaName: string;
  readonly deleteDocumentLambdaName: string;

  readonly searchDocumentLambdaName: string;
  readonly searchDocumentApiName: string;
  readonly searchDocumentDeploymentName: string;
  readonly searchDocumentStageName: string;
  readonly searchDocumentLogsName: string;

  readonly processDocumentLambdaName: string;
  readonly processDocumentStateMachineName: string;
  readonly objectCreatedEventRuleName: string;

  readonly documentSearchIndexName: string;
}
