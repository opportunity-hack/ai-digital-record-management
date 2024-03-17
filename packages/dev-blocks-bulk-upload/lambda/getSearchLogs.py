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
    num_log_streams = 50

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
    
    events_val = []
    for log_stream in log_streams:
        log_stream_name = log_stream['logStreamName']
        events_val.append(logs_client.get_log_events(
            logGroupName=log_group_name,
            logStreamName=log_stream_name
        ))

    list_of_events = []
    for event in events_val:
        for log_event in event['events']:
            message = log_event['message']
            if message.count("INFO") > 0:
                message = message.split("INFO")[1]
                list_of_events.append({"message": message, "timestamp": log_event['timestamp']})

    result_val = buildResponse({
        "logs": list_of_events
    })
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