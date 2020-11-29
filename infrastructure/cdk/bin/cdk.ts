#!/usr/bin/env node
import cdk = require("@aws-cdk/core");
import { Treenament } from "../lib/stack";

const app = new cdk.App();

new Treenament(app, "Treenament", {
  env: {
    region: "us-east-1",
  },
});

app.synth();
