import { type APIGatewayEvent } from "aws-lambda";

import { search } from "./search";

export const handler = async (event: APIGatewayEvent, _: any = {}) => {
  const parsedBody = parseBody(event.body);
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

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: await search(parsedBody.text),
    }),
  };
};

const parseBody = (body: string | null) => {
  try {
    return JSON.parse(body);
  } catch (error) {
    return null;
  }
};
