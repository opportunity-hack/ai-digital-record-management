const typescriptPresigned = `var myHeaders = new Headers();
myHeaders.append("x-api-key", "[API KEY]");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "name": "Qualitydoc.pdf"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://fu8z8mjflj.execute-api.us-east-1.amazonaws.com/prod/upload", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));`

export default typescriptPresigned