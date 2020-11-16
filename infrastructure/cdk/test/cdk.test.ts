import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { MyStaticSiteStack } from "../lib/stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new MyStaticSiteStack(app, "MyStaticSite", {
    env: {
      region: "us-east-1",
    },
  });
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
