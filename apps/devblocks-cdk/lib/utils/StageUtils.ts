import type { StageConfiguration } from "@devblocks/models/src/models/StageConfiguration";
import type { App, Environment } from "aws-cdk-lib";

import { AmplifyStack } from "../stacks/AmplifyStack";
import { DocumentSearchStack } from "../stacks/DocumentSearchStack";
import path from "path";
import { StaticWebsiteHostingStack } from "../stacks/StaticWebsiteHostingStack";

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
    const documentSearchStack = new DocumentSearchStack(this.app, this.configuration.documentSearchStackConfiguration.stackName, {
      env: this.env,
      stage: this.stage,
      documentSearchStackConfiguration: this.configuration.documentSearchStackConfiguration,
    });

    const amplifyStack = new AmplifyStack(this.app, this.configuration.amplifyStackConfiguration.stackName, {
      env: this.env,
      stage: this.stage,
      amplifyStackConfiguration: this.configuration.amplifyStackConfiguration,
      searchDocumentEndpoint: documentSearchStack.searchDocumentEndpoint,
    });
    amplifyStack.addDependency(documentSearchStack);

    
    new StaticWebsiteHostingStack(this.app, this.configuration.staticWebsiteHostingStackConfiguration.stackName, {
      stackName: this.configuration.staticWebsiteHostingStackConfiguration.stackName,
      env: this.env,
      stage: this.stage,
      staticWebsiteHostingStackConfiguration: this.configuration.staticWebsiteHostingStackConfiguration,
      staticAssetsFilePath: path.resolve(__dirname, "../../../../apps/devblocks-web/out"),
      cfnOutputName: `${this.configuration.staticWebsiteHostingStackConfiguration.stackName}-domain-name`,
    });
  };
}
