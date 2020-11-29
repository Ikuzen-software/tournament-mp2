import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { Treenament } from "../lib/stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Treenament(app, "Treenament", {
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
