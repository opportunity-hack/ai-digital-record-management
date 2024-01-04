const pythonUpload = `
import requests

url = ""

payload = {'key': '',
'AWSAccessKeyId': '',
'x-amz-security-token': '',
'policy': '',
'signature': ''}
files=[
  ('file',('QualityManagementSystem.pdf',open('/Users/loveneetsingh/Downloads/test-doc-dev-blocks-v4/QualityManagementSystem.pdf','rb'),'application/pdf'))
]
headers = {}

response = requests.request("POST", url, headers=headers, data=payload, files=files)

print(response.text)
`

export default pythonUpload