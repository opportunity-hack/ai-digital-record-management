const typescriptQuery = `var myHeaders = new Headers();
myHeaders.append("x-api-key", "[API KEY]");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "query": "who do we need to assess for suicide?",
  "model": "claudeV2"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://0qmyyr2pq9.execute-api.us-east-1.amazonaws.com/prod/query", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));`

export default typescriptQuery