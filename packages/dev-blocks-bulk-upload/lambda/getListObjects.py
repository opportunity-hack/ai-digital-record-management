import boto3
import json 
import os

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

bucket_name = os.environ['BUCKET_NAME']

def handler(event, context):

    print(event) 

    print(json.dumps(event))

    object_list = []

    bucket = s3_client

    continuation_token = None
    while True:

        if continuation_token:
            objects_s3 = bucket.list_objects_v2(
                Bucket=bucket_name,
                Prefix='public/',
                ContinuationToken=continuation_token
            )
        else:
            objects_s3 = bucket.list_objects_v2(
                Bucket=bucket_name,
                Prefix='public/'
            )

        if 'Contents' in objects_s3:
            for obj in objects_s3['Contents']:
                print(obj['Key'])
                files_val = obj['Key']
                print(files_val)

                object_list.append(files_val)
                print(files_val)

        if 'NextContinuationToken' in objects_s3:
            continuation_token = objects_s3['NextContinuationToken']
        else:
            break

    response = object_list

    pre_response  = buildResponse(response)

    print(pre_response)

    result = pre_response

    return result



def buildResponse(body):

    return {
        "statusCode" : 200,
        "headers" : {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type' : 'application/json'
        },
        "body" : json.dumps(body)
    }