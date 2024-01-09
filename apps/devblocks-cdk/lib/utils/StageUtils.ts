import type { StageConfiguration } from "@devblocks/models";
import type { App, Environment } from "aws-cdk-lib";

import { AmplifyStack } from "../stacks/AmplifyStack";

export class StageUtils {
  private readonly configuration: StageConfiguration;

  private readonly app: App;

  private readonly env: Environment;

  private readonly stage: string;

  constructor(app: App, configuration: StageConfiguration, env: Environment, stage: string) {
    this.app = app;
    this.configuration = configuration;
    this.env = env;
    this.stage = stage;
  }

  setupStages = () => {
    new AmplifyStack(this.app, this.configuration.amplifyStackConfiguration.stackName, {
      env: this.env,
      stage: this.stage,
      amplifyStackConfiguration: this.configuration.amplifyStackConfiguration,
    });
  };
}
