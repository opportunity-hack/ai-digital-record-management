import { type APIGatewayEvent } from "aws-lambda";

import { editObject } from "./editObject";

const parseBody = (body: string) => {
  try {
    return JSON.parse(body);
  } catch (error) {
    return null;
  }
};

export const handler = async (event: APIGatewayEvent, _: any = {}) => {
  const parsedBody = parseBody(event.body ?? "");
  if (!parsedBody) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid request body",
      }),
    };
  }

  console.log(parsedBody);
  console.log(parsedBody.text);
  console.log(parsedBody.location);

  const editResults = await editObject(parsedBody.bucketName, parsedBody.objectKey, parsedBody.text, parsedBody.location, parsedBody.date, parsedBody.tags);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify({
      message: editResults,
    }),
  };
  return response;
};
