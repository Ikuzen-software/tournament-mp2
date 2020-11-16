import { Stack, App, StackProps } from "@aws-cdk/core";
import { StaticSite } from "./static-site";

export class MyStaticSiteStack extends Stack {
  constructor(parent: App, name: string, props: StackProps) {
    super(parent, name, props);

    new StaticSite(this, "StaticSite", {
      domainName: "treenament.com"
    });
  }
}
