import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  Policy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
  Effect,
} from "aws-cdk-lib/aws-iam";
export class BirthdayAppEmailServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const emailLambda = new NodejsFunction(this, "my-handler", {
      entry: "./lambdas/lambda.ts",
      environment: {
        TABLE_NAME: "User-vnuwshx4qvcddcqx24ru2aywiy-dev",
      },
    });

    emailLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ["ses:SendEmail", "SES:SendRawEmail"],
        resources: ["*"],
        effect: Effect.ALLOW,
      })
    );

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BirthdayAppEmailServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
