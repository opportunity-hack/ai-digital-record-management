import { APP_NAME } from "@devblocks/models";
import type { AmplifyAuthConfiguration } from "@devblocks/models/src/models/ServiceConfiguration";
import type { StackProps } from "aws-cdk-lib";
import { aws_iam, Duration, NestedStack } from "aws-cdk-lib";
import { AccountRecovery, CfnIdentityPool, CfnIdentityPoolRoleAttachment, UserPool, UserPoolClient, VerificationEmailStyle } from "aws-cdk-lib/aws-cognito";
import { FederatedPrincipal, Role } from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export class AmplifyAuthStack extends NestedStack {
  readonly authenticatedRole: Role;

  readonly unauthenticatedRole: Role;

  readonly region: string;

  readonly cognitoIdentityPoolId: string;

  readonly cognitoUserPoolId: string;

  readonly cognitoUserPoolClientId: string;

  constructor(scope: Construct, id: string, props: StackProps & { amplifyAuthConfiguration: AmplifyAuthConfiguration }) {
    super(scope, id, props);

    const cognitoUserPool = new UserPool(this, `${props.amplifyAuthConfiguration.userPoolName}`, {
      userPoolName: `${props.amplifyAuthConfiguration.userPoolName}`,
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: `Verify your email for ${APP_NAME}`,
        emailBody: `Your ${APP_NAME} verification code is {####}. Never share it!`,
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: `Your ${APP_NAME} verification code is {####}. Never share it!`,
      },
      userInvitation: {
        emailSubject: `Invite to join ${APP_NAME}`,
        emailBody: `Hello, {username}, your temporary password for your new ${APP_NAME} account is {####}. Never share it!`,
        smsMessage: `Hello, {username}, your temporary password for your new ${APP_NAME} account is {####}. Never share it!`,
      },
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          mutable: true,
          required: true,
        },
      },
      passwordPolicy: {
        tempPasswordValidity: Duration.hours(24),
        minLength: 12,
        requireDigits: true,
        requireSymbols: true,
        requireUppercase: true,
        requireLowercase: true,
      },
      signInCaseSensitive: false,
      accountRecovery: AccountRecovery.EMAIL_ONLY,
    });

    // This user pool client will
    const cognitoUserPoolClient = new UserPoolClient(this, `${props.amplifyAuthConfiguration.userPoolClientName}`, {
      userPool: cognitoUserPool,
    });

    const cognitoIdentityPool = new CfnIdentityPool(this, `${props.amplifyAuthConfiguration.userPoolIdentityName}`, {
      identityPoolName: `${props.amplifyAuthConfiguration.userPoolIdentityName}`,
      allowUnauthenticatedIdentities: false,
    });

    this.authenticatedRole = new Role(this, `${props.amplifyAuthConfiguration.authenticatedRoleName}`, {
      roleName: `${props.amplifyAuthConfiguration.authenticatedRoleName}`,
      description: "IAM Role to be used as an Unauthenticated role for the Cognito user pool identities, used by Amplify",
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazon.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": cognitoIdentityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      maxSessionDuration: Duration.hours(1),
    });

    // Add ability to add and read from buckets
    this.authenticatedRole.addToPolicy(
      new aws_iam.PolicyStatement({
        actions: ["s3:*"],
        resources: ["*"],
      }),
    );

    this.unauthenticatedRole = new Role(this, `${props.amplifyAuthConfiguration.unauthenticatedRoleName}`, {
      roleName: `${props.amplifyAuthConfiguration.unauthenticatedRoleName}`,
      description: "IAM Role to be used as an Authenticated role for the Cognito user pool identities, used by Amplify",
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazon.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": cognitoIdentityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      maxSessionDuration: Duration.hours(1),
    });

    new CfnIdentityPoolRoleAttachment(this, `${props.amplifyAuthConfiguration.authenticatedRoleName}-attachment`, {
      identityPoolId: cognitoIdentityPool.ref,
      roles: {
        unauthenticated: this.unauthenticatedRole.roleArn,
        authenticated: this.authenticatedRole.roleArn,
      },
    });

    // Outputs that will be used by other stacks
    this.region = props.env!.region!;
    this.cognitoIdentityPoolId = cognitoIdentityPool.ref;
    this.cognitoUserPoolId = cognitoUserPool.userPoolId;
    this.cognitoUserPoolClientId = cognitoUserPoolClient.userPoolClientId;
  }
}
