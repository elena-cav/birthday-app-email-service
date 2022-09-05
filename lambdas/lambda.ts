import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import AWS from "aws-sdk";
import isYourBirthday from "./isYourBirthday";

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
  date: string;
};

export const handler = async () => {
  try {
    const { Items } = await client.send(command);

    const emailsToSendToday = Items
      ?.map((record) =>
        AWS.DynamoDB.Converter.unmarshall(record)
      )
      ?.map((next: Item) => {
        return next?.birthdays.reduce<EmailInfo[]>(
          (previousEmailInfos: EmailInfo[], nextBirthday: Birthday): EmailInfo[] =>
            isYourBirthday(nextBirthday.date)
              ? [
                  ...previousEmailInfos,
                  {
                    name: nextBirthday.name,
                    birthday: new Date(nextBirthday.date),
                    email: next.email,
                  },
                ]
              : previousEmailInfos,
          []
        );
      }, [])
      .flat();

    console.log("EMAILS", emailsToSendToday);
  } catch (error) {
    console.log("ERROR", error);
    // error handling.
  }

  //   return { statusCode: 200, body: "Hello world" };
};
