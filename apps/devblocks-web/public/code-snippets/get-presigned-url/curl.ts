const curlPresigned = `curl --location 'https://fu8z8mjflj.execute-api.us-east-1.amazonaws.com/prod/upload' \\
--header 'x-api-key: [API KEY]' \\
--header 'Content-Type: application/json' \\
--data '{ "name": "Qualitydoc.pdf" }'`

export default curlPresigned