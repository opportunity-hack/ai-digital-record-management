import json
import boto3
from botocore.config import Config
import os
import uuid

s3_client = boto3.client("s3")
bucket_name = os.environ["BUCKET_NAME"]


def handler(event, context):

    body_ = event["body"]
    print(body_)
    print(type(body_))

    body_1 = json.loads(body_)
    print(body_1)
    print(type(body_1))

    object_Id = body_1["key"]
    print(object_Id)
    print(type(object_Id))

    pre_response_val_get_object = s3_client.generate_presigned_post(
        Bucket=bucket_name, Key=object_Id, ExpiresIn=600,
    )

    response = buildResponse(pre_response_val_get_object)

    print(response)

    return response


def buildResponse(body):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        "body": json.dumps(body),
    }
