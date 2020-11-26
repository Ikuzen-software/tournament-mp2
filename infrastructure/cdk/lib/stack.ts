import { Stack, App, StackProps } from "@aws-cdk/core";
import { StaticSite } from "./static-site";
import * as iam from "@aws-cdk/aws-iam";

export class MyStaticSiteStack extends Stack {
  constructor(parent: App, name: string, props: StackProps) {
    super(parent, name, props);

    const cicdUser = new iam.User(this, "CiCdUser", {});

    new StaticSite(this, "StaticSite", {
      domainName: "treenament.com",
      iamUser: cicdUser
    });
  }
}
