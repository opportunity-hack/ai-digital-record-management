import type { AmplifyStackConfiguration, DocumentSearchStackConfiguration } from "./ServiceConfiguration";

export interface StageConfiguration {
  readonly amplifyStackConfiguration: AmplifyStackConfiguration;
  readonly documentSearchStackConfiguration: DocumentSearchStackConfiguration;
}
