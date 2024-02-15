import type { AmplifyStackConfiguration, DocumentSearchStackConfiguration, StaticWebsiteHostingStackConfiguration } from "./ServiceConfiguration";

export interface StageConfiguration {
  readonly amplifyStackConfiguration: AmplifyStackConfiguration;
  readonly documentSearchStackConfiguration: DocumentSearchStackConfiguration;
  readonly staticWebsiteHostingStackConfiguration: StaticWebsiteHostingStackConfiguration;
}
