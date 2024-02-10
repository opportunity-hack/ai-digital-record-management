import { LocationClient, SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location"; // ES Modules import
// const { LocationClient, SearchPlaceIndexForTextCommand } = require("@aws-sdk/client-location"); // CommonJS import
const client = new LocationClient({});

const textToLocation = async (text: string) => {
  console.log("LOCATION", text)
  console.log("LOCATION", process.env.LOCATION_INDEX_NAME)

  const input = { // SearchPlaceIndexForTextRequest
    IndexName: process.env.LOCATION_INDEX_NAME, // required
    Text: text, // required
  };
  console.log("INPUT")

  const command = new SearchPlaceIndexForTextCommand(input);
  console.log("COMMAND")

  const response = await client.send(command);
  console.log("RESPONSE")

  console.log("LOCATION", response); // successful response
}

export default textToLocation