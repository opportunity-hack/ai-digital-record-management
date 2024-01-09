const curlQuery = `curl --location 'https://0qmyyr2pq9.execute-api.us-east-1.amazonaws.com/prod/query' \\
--header 'x-api-key: [API KEY]' \\
--header 'Content-Type: application/json' \\
--data '{
    "query":"who do we need to assess for suicide?",
    "model":"claudeV2"
}'`

export default curlQuery