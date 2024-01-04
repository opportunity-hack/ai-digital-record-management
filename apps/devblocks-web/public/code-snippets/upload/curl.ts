const curlUpload = `curl --location '[PRESIGNED URL]' \\
--form 'key="[API KEY]"' \\
--form 'AWSAccessKeyId=""' \\
--form 'x-amz-security-token=""' \\
--form 'policy=""' \\
--form 'signature=""' \\
--form 'file=@"/Users/loveneetsingh/Downloads/test-doc-dev-blocks-v4/QualityManagementSystem.pdf"'`

export default curlUpload