export interface AmplifyConfiguration {
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
