import zipfile
import os
import boto3
import json
from io import BytesIO

s3_resource = boto3.resource('s3')

bucket_name = os.environ['BUCKET_NAME']

def handler(event, context):
    
    print("********* event ************")
    print("\n")
    
    print(json.dumps(event))
    
    print("**************************")
    print("\n")
    
    key_val = event['Records'][0]['s3']['object']['key']
    print(json.dumps(key_val))
    
    
    added_folder = "public"
    print(added_folder)
    
    zip_object = s3_resource.Object(
        bucket_name=bucket_name,
        key=key_val
    )
    buffer = BytesIO(zip_object.get()["Body"].read())
    
    z = zipfile.ZipFile(buffer)
    for filename in z.namelist():
        file_info = z.getinfo(filename)
        s3_resource.meta.client.upload_fileobj(
            z.open(filename),
            Bucket=bucket_name,
            Key=f'{added_folder}/{filename}'
        )
        
    return {
        'statusCode': 200,
        'body': json.dumps('Success!')
    }