#!/usr/bin/env node
import cdk = require("@aws-cdk/core");
import { MyStaticSiteStack } from "../lib/stack";

const app = new cdk.App();

new MyStaticSiteStack(app, "MyStaticSite", {
  env: {
    region: "us-east-1",
  },
});

app.synth();
