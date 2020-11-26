import { Stack, App, StackProps } from "@aws-cdk/core";
import { StaticSite } from "./static-site";
import * as iam from "@aws-cdk/aws-iam";
import { Backend } from "./backend";

export class MyStaticSiteStack extends Stack {
  constructor(parent: App, name: string, props: StackProps) {
    super(parent, name, props);

    const cicdUser = new iam.User(this, "CiCdUser", {});

    new StaticSite(this, "StaticSite", {
      domainName: "treenament.com",
      iamUser: cicdUser,
    });

    new Backend(this, "Backend", {
      clusterName: "treenament-dev",
      instanceType: "t2.micro",
      imageName: "treenament-backend",
      ssmVariables: [
        "TOURNAMENT_MONGO_USERNAME",
        "TOURNAMENT_MONGO_PASSWORD",
        "TOURNAMENT_MONGO_DATABASE",
        "TOURNAMENT_MONGO_HOST",
        "TOURNAMENT_MONGO_PROTOCOL",
      ],
    });
  }
}
