import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const input = {
  TableName: process.env.TABLE_NAME,
};
const command = new ScanCommand(input);

export const handler = async () => {
  try {
    const data = await client.send(command);
    console.log("DYNAMODATA", data);
    // process data.
  } catch (error) {
    console.log("ERROR", error);
    // error handling.
  }

  //   return { statusCode: 200, body: "Hello world" };
};
