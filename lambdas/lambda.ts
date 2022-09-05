import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import AWS from "aws-sdk";
const client = new DynamoDBClient({ region: "eu-west-1" });
const input = {
  TableName: process.env.TABLE_NAME,
};
const command = new ScanCommand(input);
type EmailInfo = {
  name: string;
  email: string;
  birthday: Date;
};
type Item = {
  name: string;
  birthdays: [Birthday];
  email: string;
};
type Birthday = {
  name: string;
  date: Date;
};

export const handler = async () => {
  try {
    const { Items } = await client.send(command);
    const newItems = Items?.map((record) =>
      AWS.DynamoDB.Converter.unmarshall(record)
    );

    console.log("DYNAMODATA", newItems);

    const emailsToSendToday = newItems
      ?.reduce((acc: [EmailInfo], next: Item) => {
        console.log("NEXT", next);
        const todaysBirthdays = next?.birthdays.filter(
          (birthday) => new Date() === new Date(birthday.date)
        );
        const emailInfo = todaysBirthdays.map((birthdayData: Birthday) => ({
          ...birthdayData,
          email: next.email,
        }));
        return [...acc, emailInfo];
      }, [])
      .flat();
    console.log("EMAILS", emailsToSendToday);
  } catch (error) {
    console.log("ERROR", error);
    // error handling.
  }

  //   return { statusCode: 200, body: "Hello world" };
};
