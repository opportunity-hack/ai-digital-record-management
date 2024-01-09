const typescriptListDocs = `var myHeaders = new Headers();
myHeaders.append("x-api-key", "[API KEY]");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://fu8z8mjflj.execute-api.us-east-1.amazonaws.com/prod/list", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
`

export default typescriptListDocs