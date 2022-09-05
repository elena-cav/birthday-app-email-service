import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class BirthdayAppEmailServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, "my-handler", {
      entry: "./lambdas/lambda.ts",
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BirthdayAppEmailServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}