import { Construct } from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ssm from "@aws-cdk/aws-ssm";
import * as iam from "@aws-cdk/aws-iam";

export interface BackendProps {
  imageName: string;
  clusterName: string;
  instanceType: string;
  ssmVariables: string[];
  iamUser: iam.User;
}

export class Backend extends Construct {
  constructor(parent: Construct, name: string, props: BackendProps) {
    super(parent, name);

    const vpc = new ec2.Vpc(this, "VPC", {
      cidr: "10.0.0.0/16",
      natGateways: 0,
      maxAzs: 2,
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      clusterName: props.clusterName,
      vpc,
      capacity: {
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        instanceType: new ec2.InstanceType(props.instanceType),
        desiredCapacity: 1,
        maxCapacity: 1,
      },
    });

    // env variables params

    const ssmVariables = props.ssmVariables.map((x) => ({
      secret: new ssm.StringParameter(this, x, {
        stringValue: "TOBEDEFINED",
        parameterName: `/treenament/backend/${x}`,
        type: ssm.ParameterType.STRING,
      }),
      name: x,
    }));

    const repository = new ecr.Repository(this, "Repository", {
      repositoryName: props.imageName,
      lifecycleRules: [{ maxImageCount: 5 }],
    });

    const taskDefinition = new ecs.TaskDefinition(this, "EcsTask", {
      compatibility: ecs.Compatibility.EC2,
      memoryMiB: "512",
    });

    const container = new ecs.ContainerDefinition(this, "EcsContainer", {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      taskDefinition,
      memoryLimitMiB: 512,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: "treenament",
        logRetention: 7,
      }),
      secrets: ssmVariables.reduce(
        (o, val) => ({
          ...o,
          [val.name]: ecs.Secret.fromSsmParameter(val.secret),
        }),
        {}
      ),
    });

    container.addPortMappings({ containerPort: 3000, hostPort: 80 });

    const service = new ecs.Ec2Service(this, "Ec2Service", {
      cluster,
      taskDefinition,
    });

    const alb = new elb.ApplicationLoadBalancer(this, "ALB", {
      vpc,
      internetFacing: true,
    });

    const listener = alb.addListener("Listener", {
      port: 80,
      defaultAction: elb.ListenerAction.fixedResponse(404),
    });

    const target = listener.addTargets("ECS", {
      port: 80,
      targets: [service],
    });

    new iam.Policy(this, "AccessECRandECSPolicy", {
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["ecr:*", "ecs:*"],
          resources: ['*'],
        }),
      ],
      users: [props.iamUser],
    });
  }
}
