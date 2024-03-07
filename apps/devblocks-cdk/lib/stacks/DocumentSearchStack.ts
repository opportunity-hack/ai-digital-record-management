import path from "node:path";

import { Constants } from "@devblocks/models";
import type { DocumentSearchStackConfiguration } from "@devblocks/models/src/models/ServiceConfiguration";
import type { StackProps } from "aws-cdk-lib";
import { aws_apigateway, aws_iam, aws_lambda, aws_lambda_event_sources, aws_lambda_nodejs, aws_logs, aws_opensearchservice, aws_s3, CfnOutput, Duration, RemovalPolicy, Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import type { Construct } from "constructs";

export class DocumentSearchStack extends Stack {
  readonly searchDocumentEndpoint: string;

  /**
   * Constructor for the Amplify Stack
   *
   * @param scope the scope of the stack
   * @param id the name to give the stack on AWS Cloudformation.
   * @param props various properties to be passed in
   */
  constructor(scope: Construct, id: string, props: StackProps & { documentSearchStackConfiguration: DocumentSearchStackConfiguration; stage: string }) {
    super(scope, id, props);

    // S3 Storage bucket where all documents will be stored.
    const documentStorageBucket = new aws_s3.Bucket(this, `${props.documentSearchStackConfiguration.documentStorageBucketName}-123231232`, {
      bucketName: props.documentSearchStackConfiguration.documentStorageBucketName,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      eventBridgeEnabled: true,
    });

    documentStorageBucket.addCorsRule({
      allowedOrigins: ["http://localhost:3000", "*"],
      allowedMethods: [aws_s3.HttpMethods.GET, aws_s3.HttpMethods.POST, aws_s3.HttpMethods.HEAD, aws_s3.HttpMethods.PUT, aws_s3.HttpMethods.DELETE],
      allowedHeaders: ["*"],
      maxAge: 3600,
    });

    const documentStorageBucketObjectCreatedSource = new aws_lambda_event_sources.S3EventSource(documentStorageBucket, {
      events: [aws_s3.EventType.OBJECT_CREATED],
      filters: [{ prefix: "public/" }],
    });

    const documentSearchIndex = new aws_opensearchservice.Domain(this, `${props.documentSearchStackConfiguration.documentSearchIndexName}-${props.stage}-${props.env?.region}`, {
      version: aws_opensearchservice.EngineVersion.OPENSEARCH_1_3,
      zoneAwareness: {
        enabled: false,
      },
      capacity: {
        masterNodeInstanceType: "t3.small.search",
        dataNodeInstanceType: "t3.small.search",
        multiAzWithStandbyEnabled: false,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      tlsSecurityPolicy: aws_opensearchservice.TLSSecurityPolicy.TLS_1_2,
    });

    // Attach Textract policy to the aws_iam role
    // ====================================================================================================
    // Lambda function for processing documents
    // ====================================================================================================
    const processDocumentLambda = new aws_lambda_nodejs.NodejsFunction(this, `${props.documentSearchStackConfiguration.processDocumentLambdaName}-${props.stage}-${props.env?.region}`, {
      functionName: `${props.documentSearchStackConfiguration.processDocumentLambdaName}-${props.stage}`,
      entry: path.join(__dirname, "../../../../packages/devblocks-lambda-process-object/src/lambda/main.ts"),
      runtime: aws_lambda.Runtime.NODEJS_18_X,

      // We add a timeout here different from the default of 3 seconds, since we expect these API calls to take longer
      timeout: Duration.minutes(15),
      memorySize: 1024,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: aws_lambda_nodejs.SourceMapMode.BOTH,
        sourcesContent: false,
        target: "esnext",
      },
      environment: {
        REGION: props.env?.region ?? "us-west-1",
        OPENSEARCH_ENDPOINT: documentSearchIndex.domainEndpoint,
        OPENSEARCH_MASTER_PASSWORD: documentSearchIndex.masterUserPassword?.toString() ?? "",
      },
    });
    processDocumentLambda.addEventSource(documentStorageBucketObjectCreatedSource);
    documentStorageBucket.grantReadWrite(processDocumentLambda);
    processDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["textract:DetectDocumentText"],
        resources: ["*"],
      }),
    );
    processDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["rekognition:*"],
        resources: ["*"],
      }),
    );
    processDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["s3:ReadObject"],
        resources: [`${documentStorageBucket.bucketArn}/*`],
      }),
    );
    processDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["es:*"],
        resources: ["*"],
      }),
    );
    processDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["transcribe:*"],
        resources: ["*"],
      }),
    );

    const documentStorageBucketTranscriptionCreatedSource = new aws_lambda_event_sources.S3EventSource(documentStorageBucket, {
      events: [aws_s3.EventType.OBJECT_CREATED],
      filters: [{ prefix: "transcription/", suffix: ".json" }],
    });

    const updateOpensearchLambda = new aws_lambda_nodejs.NodejsFunction(this, `${props.documentSearchStackConfiguration.updateOpensearchLambdaName}-${props.stage}-${props.env?.region}`, {
      functionName: `${props.documentSearchStackConfiguration.updateOpensearchLambdaName}-${props.stage}`,
      entry: path.join(__dirname, "../../../../packages/devblocks-lambda-store-text-transcribe/src/lambda/main.ts"),
      runtime: aws_lambda.Runtime.NODEJS_18_X,

      // We add a timeout here different from the default of 3 seconds, since we expect these API calls to take longer
      timeout: Duration.minutes(15),
      memorySize: 1024,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: aws_lambda_nodejs.SourceMapMode.BOTH,
        sourcesContent: false,
        target: "esnext",
      },
      environment: {
        REGION: props.env?.region ?? "us-west-1",
        OPENSEARCH_ENDPOINT: documentSearchIndex.domainEndpoint,
        OPENSEARCH_MASTER_PASSWORD: documentSearchIndex.masterUserPassword?.toString() ?? "",
      },
    });
    updateOpensearchLambda.addEventSource(documentStorageBucketTranscriptionCreatedSource);
    documentStorageBucket.grantReadWrite(updateOpensearchLambda);
    updateOpensearchLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["s3:ReadObject"],
        resources: [`${documentStorageBucket.bucketArn}/*`],
      }),
    );
    updateOpensearchLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["es:*"],
        resources: ["*"],
      }),
    );

    // ====================================================================================================
    // Lambda function for processing .zip file
    // ====================================================================================================
    const processZipFiles = new lambda.Function(this, "document-search-process-zip-files-1232", {
      runtime: lambda.Runtime.PYTHON_3_10,
      code: lambda.Code.fromAsset("../../packages/dev-blocks-bulk-upload/lambda"),
      handler: "bulkprocessing.handler",
      timeout: Duration.minutes(15),
      environment: {
        BUCKET_NAME: documentStorageBucket.bucketName,
      },
      memorySize: 1024,
    });

    documentStorageBucket.grantReadWrite(processZipFiles);

    processZipFiles.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["logs:*", "apigateway:*", "s3:*"],
        resources: ["*"],
      }),
    );

    // adding trigger to the lambda function from s3 trigger
    documentStorageBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(processZipFiles), {
      suffix: ".zip",
      prefix: "zip",
    });

    // ====================================================================================================
    // Lambda function for deleting documents
    // ====================================================================================================
    const documentStorageBucketObjectDeletedSource = new aws_lambda_event_sources.S3EventSource(documentStorageBucket, {
      events: [aws_s3.EventType.OBJECT_REMOVED],
      filters: [{ prefix: "public/" }],
    });
    const deleteDocumentLambda = new aws_lambda_nodejs.NodejsFunction(this, `${props.documentSearchStackConfiguration.deleteDocumentLambdaName}-${props.stage}-${props.env?.region}`, {
      functionName: `${props.documentSearchStackConfiguration.deleteDocumentLambdaName}-${props.stage}`,
      entry: path.join(__dirname, "../../../../packages/devblocks-lambda-delete-object/src/lambda/main.ts"),
      runtime: aws_lambda.Runtime.NODEJS_18_X,

      // We add a timeout here different from the default of 3 seconds, since we expect these API calls to take longer
      timeout: Duration.minutes(15),
      memorySize: 1024,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: aws_lambda_nodejs.SourceMapMode.BOTH,
        sourcesContent: false,
        target: "esnext",
      },
      environment: {
        REGION: props.env?.region ?? "us-west-1",
        OPENSEARCH_ENDPOINT: documentSearchIndex.domainEndpoint,
        OPENSEARCH_MASTER_PASSWORD: documentSearchIndex.masterUserPassword?.toString() ?? "",
      },
    });
    deleteDocumentLambda.addEventSource(documentStorageBucketObjectDeletedSource);
    documentStorageBucket.grantReadWrite(deleteDocumentLambda);
    deleteDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["textract:DetectDocumentText"],
        resources: ["*"],
      }),
    );
    deleteDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["s3:ReadObject"],
        resources: [`${documentStorageBucket.bucketArn}/*`],
      }),
    );
    deleteDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["es:*"],
        resources: ["*"],
      }),
    );

    // ====================================================================================================
    // Lambda function for searching documents
    // ====================================================================================================
    const searchDocumentLambda = new aws_lambda_nodejs.NodejsFunction(this, `${props.documentSearchStackConfiguration.searchDocumentLambdaName}-${props.stage}-${props.env?.region}`, {
      functionName: `${props.documentSearchStackConfiguration.searchDocumentLambdaName}`,
      entry: path.join(__dirname, "../../../../packages/devblocks-lambda-search-object/src/lambda/main.ts"),
      runtime: aws_lambda.Runtime.NODEJS_18_X,

      // We add a timeout here different from the default of 3 seconds, since we expect these API calls to take longer
      timeout: Duration.minutes(15),
      memorySize: 2048,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: aws_lambda_nodejs.SourceMapMode.BOTH,
        sourcesContent: false,
        target: "esnext",
      },
      environment: {
        REGION: props.env?.region ?? "us-west-1",
        OPENSEARCH_ENDPOINT: documentSearchIndex.domainEndpoint,
        OPENSEARCH_MASTER_PASSWORD: documentSearchIndex.masterUserPassword?.toString() ?? "",
      },
    });
    searchDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["es:*"],
        resources: ["*"],
      }),
    );

    const searchDocumentApi = new aws_apigateway.LambdaRestApi(this, `${props.documentSearchStackConfiguration.searchDocumentApiName}-${props.stage}-${props.env?.region}`, {
      restApiName: `${props.documentSearchStackConfiguration.searchDocumentApiName}-${props.stage}`,
      handler: searchDocumentLambda,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
        allowHeaders: aws_apigateway.Cors.DEFAULT_HEADERS,
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
      },
    });
    const searchDocumentIntegration = new aws_apigateway.LambdaIntegration(searchDocumentLambda);
    searchDocumentApi.root.addMethod("POST", searchDocumentIntegration);

    const searchDocumentApiDeployment = new aws_apigateway.Deployment(this, `${props.documentSearchStackConfiguration.searchDocumentDeploymentName}-${props.stage}-${props.env?.region}`, {
      api: searchDocumentApi,
    });

    new aws_apigateway.Stage(this, `${props.documentSearchStackConfiguration.searchDocumentStageName}-${props.stage}-${props.env?.region}`, {
      stageName: `${props.documentSearchStackConfiguration.searchDocumentStageName}-${props.stage}`,
      deployment: searchDocumentApiDeployment,
    });

    // ====================================================================================================
    // Lambda function for searching documents
    // ====================================================================================================
    // const locationService = new aws_location.CfnPlaceIndex(this, `${props.documentSearchStackConfiguration.locationServiceName}-${props.stage}-${props.env?.region}`, {
    //   dataSource: "Esri",
    //   indexName: `${props.documentSearchStackConfiguration.locationServiceName}-${props.stage}`,
    // });

    const editDocumentLambda = new aws_lambda_nodejs.NodejsFunction(this, `${props.documentSearchStackConfiguration.editDocumentLambdaName}-${props.stage}-${props.env?.region}`, {
      functionName: `${props.documentSearchStackConfiguration.editDocumentLambdaName}`,
      entry: path.join(__dirname, "../../../../packages/devblocks-lambda-edit-object/src/lambda/main.ts"),
      runtime: aws_lambda.Runtime.NODEJS_18_X,

      // We add a timeout here different from the default of 3 seconds, since we expect these API calls to take longer
      timeout: Duration.minutes(15),
      memorySize: 2048,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: aws_lambda_nodejs.SourceMapMode.BOTH,
        sourcesContent: false,
        target: "esnext",
      },
      environment: {
        REGION: props.env?.region ?? "us-west-1",
        OPENSEARCH_ENDPOINT: documentSearchIndex.domainEndpoint,
        OPENSEARCH_MASTER_PASSWORD: documentSearchIndex.masterUserPassword?.toString() ?? "",
        // LOCATION_INDEX_NAME: locationService.indexName,
      },
    });
    editDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["es:*"],
        resources: ["*"],
      }),
    );
    editDocumentLambda.addToRolePolicy(
      new PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["geo:*"],
        resources: ["*"],
      }),
    );

    const editDocumentApi = new aws_apigateway.LambdaRestApi(this, `${props.documentSearchStackConfiguration.editDocumentApiName}-${props.stage}-${props.env?.region}`, {
      restApiName: `${props.documentSearchStackConfiguration.editDocumentApiName}-${props.stage}`,
      handler: editDocumentLambda,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
        allowHeaders: aws_apigateway.Cors.DEFAULT_HEADERS,
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
      },
    });
    const editDocumentIntegration = new aws_apigateway.LambdaIntegration(editDocumentLambda);
    editDocumentApi.root.addMethod("POST", editDocumentIntegration);

    const editDocumentApiDeployment = new aws_apigateway.Deployment(this, `${props.documentSearchStackConfiguration.editDocumentDeploymentName}-${props.stage}-${props.env?.region}`, {
      api: editDocumentApi,
    });

    new aws_apigateway.Stage(this, `${props.documentSearchStackConfiguration.editDocumentStageName}-${props.stage}-${props.env?.region}`, {
      stageName: `${props.documentSearchStackConfiguration.editDocumentStageName}-${props.stage}`,
      deployment: editDocumentApiDeployment,
    });

    // Lambda function to upload data to S3 bucket uasing presigned URL from the Backup bucket
    const preserve_search_upload_presigned_url = new lambda.Function(this, "preserve_search_get_object_presignedURL-1232", {
      runtime: lambda.Runtime.PYTHON_3_10,
      code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../packages/dev-blocks-bulk-upload/lambda")),
      handler: "getSignedURL.handler",
      environment: {
        BUCKET_NAME: documentStorageBucket.bucketName,
      },
    });

    preserve_search_upload_presigned_url.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["logs:*", "apigateway:*", "s3:*", "dynamodb:*"],
        resources: ["*"],
      }),
    );

    // API to get the presigned URL
    const get_preSignedURL_API = new aws_apigateway.RestApi(this, "dpreserve_search_get_object_preSignedURL_API-1232", {
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new aws_apigateway.LogGroupLogDestination(
          new aws_logs.LogGroup(this, "preserve_search_get_object_preSignedURL_api_log_group-1232", {
            logGroupName: "preserve_search_get_object_preSignedURL_api_log_group-1232",
            retention: aws_logs.RetentionDays.ONE_MONTH,
            removalPolicy: RemovalPolicy.DESTROY,
          }),
        ),
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["*"],
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
      },
    });

    // get_presigned_URL integration
    const get_preSignedURL_integration = new aws_apigateway.LambdaIntegration(preserve_search_upload_presigned_url);

    // declaring the resource and then adding method
    const get_preSignedURL_api_path = get_preSignedURL_API.root.addResource("getSignedObjectUrl");

    // adding post method
    get_preSignedURL_api_path.addMethod("POST", get_preSignedURL_integration);

    // ====================================================================================================
    const preserve_search_upload_presigned_url_put = new lambda.Function(this, "preserve_search_get_object_presignedURL_put-1232", {
      runtime: lambda.Runtime.PYTHON_3_10,
      code: aws_lambda.Code.fromAsset(path.join(__dirname, "../../../../packages/dev-blocks-bulk-upload/lambda")),
      handler: "getUploadURL.handler",
      environment: {
        BUCKET_NAME: documentStorageBucket.bucketName,
      },
    });
    documentStorageBucket.grantReadWrite(preserve_search_upload_presigned_url_put);

    preserve_search_upload_presigned_url_put.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["logs:*", "apigateway:*", "s3:*", "dynamodb:*"],
        resources: ["*"],
      }),
    );

    // API to get the presigned URL
    const get_preSignedURL_API_put = new aws_apigateway.RestApi(this, "dpreserve_search_get_object_preSignedURL_API_put-1232", {
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new aws_apigateway.LogGroupLogDestination(
          new aws_logs.LogGroup(this, "preserve_search_get_object_preSignedURL_api_log_group_put-1232", {
            logGroupName: "preserve_search_get_object_preSignedURL_api_log_group_put-1232",
            retention: aws_logs.RetentionDays.ONE_MONTH,
            removalPolicy: RemovalPolicy.DESTROY,
          }),
        ),
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["*"],
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
      },
    });

    // get_presigned_URL integration
    const get_preSignedURL_integration_put = new aws_apigateway.LambdaIntegration(preserve_search_upload_presigned_url_put);

    // declaring the resource and then adding method
    const get_preSignedURL_api_path_put = get_preSignedURL_API_put.root.addResource("getSignedObjectUrl");

    // adding post method
    get_preSignedURL_api_path_put.addMethod("POST", get_preSignedURL_integration_put);

    new CfnOutput(this, Constants.DocumentSearchConstants.SEARCH_DOCUMENT_API_ENDPOINT_REGION, {
      exportName: Constants.DocumentSearchConstants.SEARCH_DOCUMENT_API_ENDPOINT_REGION.replaceAll("_", "-"),
      value: props.env?.region ?? "us-west-1",
    });
    new CfnOutput(this, Constants.DocumentSearchConstants.SEARCH_DOCUMENT_API_ENDPOINT, {
      exportName: Constants.DocumentSearchConstants.SEARCH_DOCUMENT_API_ENDPOINT.replaceAll("_", "-"),
      value: searchDocumentApi.url,
    });

    new CfnOutput(this, Constants.DocumentSearchConstants.EDIT_DOCUMENT_API_ENDPOINT_REGION, {
      exportName: Constants.DocumentSearchConstants.EDIT_DOCUMENT_API_ENDPOINT_REGION.replaceAll("_", "-"),
      value: props.env?.region ?? "us-west-1",
    });

    new CfnOutput(this, "getpresignedurl", {
      exportName: "getpresignedurl",
      value: get_preSignedURL_API.url,
    });

    new CfnOutput(this, "getpresignedurlput", {
      exportName: "getpresignedurlput",
      value: get_preSignedURL_API_put.url,
    });

    new CfnOutput(this, Constants.DocumentSearchConstants.EDIT_DOCUMENT_API_ENDPOINT, {
      exportName: Constants.DocumentSearchConstants.EDIT_DOCUMENT_API_ENDPOINT.replaceAll("_", "-"),
      value: editDocumentApi.url,
    });

    new CfnOutput(this, Constants.DocumentSearchConstants.DOCUMENT_BUCKET_REGION, {
      exportName: Constants.DocumentSearchConstants.DOCUMENT_BUCKET_REGION.replaceAll("_", "-"),
      value: props.env?.region ?? "us-west-1",
    });
    new CfnOutput(this, Constants.DocumentSearchConstants.DOCUMENT_BUCKET_NAME, {
      exportName: Constants.DocumentSearchConstants.DOCUMENT_BUCKET_NAME.replaceAll("_", "-"),
      value: documentStorageBucket.bucketName,
    });

    this.searchDocumentEndpoint = searchDocumentApi.url;
  }
}
