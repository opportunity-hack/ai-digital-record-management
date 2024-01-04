const typescriptUpload = `var formdata = new FormData();
formdata.append("key", "");
formdata.append("AWSAccessKeyId", "");
formdata.append("x-amz-security-token", "");
formdata.append("policy", "");
formdata.append("signature", "");
formdata.append("file", fileInput.files[0], "[PROXY]");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
`

export default typescriptUpload