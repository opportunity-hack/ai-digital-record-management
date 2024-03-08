import boto3
import json 
import os
import gzip
from base64 import b64decode

logs_client = boto3.client('logs')

cloudwatch_log_name = os.environ['CLOUDWATCH_LOG_NAME']

def handler(event, context):
    # Log group name to retrieve logs from
    log_group_name = cloudwatch_log_name

    # Number of recent log streams to retrieve
    num_log_streams = 1

    # Get the most recent log streams
    log_streams = logs_client.describe_log_streams(
        logGroupName=log_group_name,
        orderBy='LastEventTime',
        descending=True,
        limit=num_log_streams
    )['logStreams']

    if not log_streams:
        print('No log streams found in the log group.')
        return []

    log_stream_name = log_streams[0]['logStreamName']
    print(log_stream_name)

    events_val = logs_client.get_log_events(
        logGroupName=log_group_name,
        logStreamName=log_stream_name
    )
    print(events_val)

    print(log_streams)

    result_val = buildResponse(events_val)
    print(result_val)

    return result_val


def buildResponse(body):

    return {
        "statusCode" : 200,
        "headers" : {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type' : 'application/json'
        },
        "body" : json.dumps(body)
    }