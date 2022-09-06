import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { EventBus, Rule, Schedule } from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export class BirthdayAppEmailServiceStack extends cdk.Stack {
  resourceId: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.resourceId = "birthday-email-service";

    const emailLambda = new NodejsFunction(this, this.resourceId, {
      entry: "./lambdas/lambda.ts",
      environment: {
        TABLE_NAME: "User-vnuwshx4qvcddcqx24ru2aywiy-dev",
      },
    });

    const eventRule = new Rule(this, "ScheduleEmailLambda", {
      schedule: Schedule.cron({ minute: "23", hour: "11" }),
    });

    eventRule.addTarget(new targets.LambdaFunction(emailLambda));
    targets.addLambdaPermission(eventRule, emailLambda);

    emailLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:Scan"],
        resources: ["*"],
        effect: Effect.ALLOW,
      })
    );

    emailLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
        effect: Effect.ALLOW,
      })
    );
  }
}
