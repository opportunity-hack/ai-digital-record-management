import type { StackProps } from "aws-cdk-lib";
import { aws_s3, CfnOutput, RemovalPolicy, Stack } from "aws-cdk-lib";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import type { Construct } from "constructs";

import type { StaticWebsiteHostingStackConfiguration } from "@devblocks/models";

export class StaticWebsiteHostingStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps & { staticWebsiteHostingStackConfiguration: StaticWebsiteHostingStackConfiguration; stage: string; staticAssetsFilePath: string; cfnOutputName: string }) {
    super(scope, id, props);

    const bucket = new aws_s3.Bucket(this, `${props.staticWebsiteHostingStackConfiguration.bucketName}-${props.stage}-${props.env!.region}`, {
      accessControl: BucketAccessControl.PRIVATE,

      // Ensures that the S3 bucket is properly cleaned up when the stack is deleted.
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // TODO: Path is baked in at the moment
    // Is there some way to verify that this path exists?
    // Deploy the static website to the bucket.
    new BucketDeployment(this, `${props.staticWebsiteHostingStackConfiguration.bucketDeploymentName}-${props.stage}-${props.env!.region}`, {
      destinationBucket: bucket,
      sources: [Source.asset(props.staticAssetsFilePath)],
    });

    const originAccessIdentity = new OriginAccessIdentity(this, `${props.staticWebsiteHostingStackConfiguration.originAccessIdentityName}-${props.stage}-${props.env!.region}`);
    bucket.grantRead(originAccessIdentity);

    const distribution = new Distribution(this, `${props.staticWebsiteHostingStackConfiguration.distributionName}`, {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity }),
      },
    });

    new CfnOutput(this, props.cfnOutputName, {
      exportName: props.cfnOutputName.replaceAll("_", "-"),
      value: distribution.domainName,
    });
  }
}
