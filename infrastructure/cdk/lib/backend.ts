import { Construct } from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ssm from "@aws-cdk/aws-ssm";

export interface BackendProps {
  imageName: string;
  clusterName: string;
  instanceType: string;
  ssmVariables: string[];
}

export class Backend extends Construct {
  constructor(parent: Construct, name: string, props: BackendProps) {
    super(parent, name);

    const cluster = new ecs.Cluster(this, "Cluster", {
      clusterName: props.clusterName,
      capacity: {
        instanceType: new ec2.InstanceType(props.instanceType),
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
        secrets: ssmVariables.reduce(
          (o, val) => ({
            ...o,
            [val.name]: ecs.Secret.fromSsmParameter(val.secret),
          }),
          {}
        ),
    });

    const service = new ecs.Ec2Service(this, "Ec2Service", {
      cluster,
      taskDefinition,
    });
  }
}
