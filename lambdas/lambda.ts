import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import AWS from "aws-sdk";
import isYourBirthday from "./isYourBirthday";

const ddbClient = new DynamoDBClient({ region: "eu-west-1" });
const sesClient = new SESClient({ region: "eu-west-1" });

const ddbCommand = new ScanCommand({
  TableName: process.env.TABLE_NAME,
});

const sendEmail = async (
  emailAddress: string,
  name: string,
  birthdayName: string
) => {
  console.log("EMAIL SENDER", process.env.EMAIL_SENDER);
  console.log("EMAIL ADDRESS", emailAddress);
  const response = await sesClient.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [emailAddress],
      },
      Source: process.env.EMAIL_SENDER,
      Message: {
        Subject: { Data: `Today's Birthdays` },
        Body: {
          Text: {
            Data: `Good morning ${name}! Today it's ${birthdayName}'s birthday!`,
          },
        },
      },
    })
  );
  console.log(response);
};

type EmailInfo = {
  name: string;
  birthdayName: string;
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
    const { Items } = await ddbClient.send(ddbCommand);

    const emailsToSendToday = Items?.map((record) =>
      AWS.DynamoDB.Converter.unmarshall(record)
    )
      ?.reduce((acc: [EmailInfo], next: Item) => {
        const emailInfo = next?.birthdays.reduce<EmailInfo[]>(
          (
            previousEmailInfos: EmailInfo[],
            nextBirthday: Birthday
          ): EmailInfo[] =>
            isYourBirthday(nextBirthday.date)
              ? [
                  ...previousEmailInfos,
                  {
                    name: next?.name,
                    birthdayName: nextBirthday.name,
                    birthday: new Date(nextBirthday.date),
                    email: next.email,
                  },
                ]
              : previousEmailInfos,
          []
        );

        return [...acc, emailInfo];
      }, [])
      .flat();

    console.log("EMAILS", emailsToSendToday);

    await Promise.all(
      emailsToSendToday.map(
        ({
          email,
          name,
          birthdayName,
        }: {
          email: string;
          name: string;
          birthdayName: string;
        }) => sendEmail(email, name, birthdayName)
      )
    );

    return { statusCode: 200, body: "Emails sent" };
  } catch (error) {
    console.log("ERROR", error);

    return { statusCode: 500, body: error };
  }
};
