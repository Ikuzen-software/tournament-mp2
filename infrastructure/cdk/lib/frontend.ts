import { Construct } from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam";
import { PolicyStatement } from "@aws-cdk/aws-iam";

export interface FrontendProps {
  domainName: string;
  iamUser: iam.User;
}

export class Frontend extends Construct {
  constructor(parent: Construct, name: string, props: FrontendProps) {
    super(parent, name);

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: props.domainName,
      versioned: true,
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "SiteDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new iam.Policy(this, "AccessS3AndCFPolicy", {
      statements: [
        new PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["s3:PutObject", "s3:PutObjectAcl"],
          resources: [siteBucket.bucketArn],
        }),
        new PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["cloudfront:CreateInvalidation"],
          resources: [
            `arn:aws:cloudfront::*:distribution/${distribution.distributionId}`,
          ],
        }),
      ],
      users: [props.iamUser],
    });
  }
}
