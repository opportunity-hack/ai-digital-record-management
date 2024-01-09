

const curlQuery = `import requests
import json

url = "https://0qmyyr2pq9.execute-api.us-east-1.amazonaws.com/prod/query"

payload = json.dumps({
  "query": "who do we need to assess for suicide?",
  "model": "claudeV2"
})
headers = {
  'x-api-key': '[API KEY]',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
`

export default curlQuery