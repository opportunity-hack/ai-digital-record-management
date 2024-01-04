const pythonListDocs = `import requests

url = "https://fu8z8mjflj.execute-api.us-east-1.amazonaws.com/prod/list"

payload = {}
headers = {
  'x-api-key': '[API KEY]'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
`

export default pythonListDocs