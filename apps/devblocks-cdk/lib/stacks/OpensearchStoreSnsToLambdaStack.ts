import type { StackProps } from "aws-cdk-lib";
import { aws_iam, aws_lambda, aws_lambda_event_sources, aws_lambda_nodejs, aws_sns, Duration, NestedStack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export class OpensearchStoreSnsToLambdaStack extends NestedStack {
  readonly roleArn: string;

  readonly topicArn: string;

  constructor(scope: Construct, id: string, props: StackProps & { entry_path: string; name: string; stage: string }) {
    super(scope, id, props);

    const lambdaFunction = new aws_lambda_nodejs.NodejsFunction(this, props.name, {
      functionName: props.name,
      entry: props.entry_path,
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      timeout: Duration.seconds(30),
      memorySize: 1024,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: aws_lambda_nodejs.SourceMapMode.BOTH,
        sourcesContent: false,
        target: "esnext",
      },
    });
    lambdaFunction.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["es:*"],
        resources: ["*"],
      }),
    );

    const topic = new aws_sns.Topic(this, `${props.name}-topic-${props.stage}-${props.env}`, {});
    lambdaFunction.addEventSource(new aws_lambda_event_sources.SnsEventSource(topic));
    const role = new aws_iam.Role(this, `${props.name}-role-${props.stage}-${props.env}`, {
      assumedBy: new aws_iam.ServicePrincipal("textract.amazonaws.com"),
    });
    role.attachInlinePolicy(
      new aws_iam.Policy(this, "TextractPolicy", {
        statements: [
          new aws_iam.PolicyStatement({
            actions: ["sns:Publish"],
            effect: aws_iam.Effect.ALLOW,
            resources: [topic.topicArn],
          }),
        ],
      }),
    );

    this.roleArn = role.roleArn;
    this.topicArn = topic.topicArn;
  }
}
