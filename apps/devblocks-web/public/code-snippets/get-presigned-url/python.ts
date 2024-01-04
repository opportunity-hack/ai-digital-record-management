const pythonPresigned = `import requests
import json

url = "https://fu8z8mjflj.execute-api.us-east-1.amazonaws.com/prod/upload"

payload = json.dumps({
  "name": "Qualitydoc.pdf"
})
headers = {
  'x-api-key': '[API KEY]',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)`

export default pythonPresigned