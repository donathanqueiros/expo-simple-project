const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs"); // CommonJS import
const { fromEnv, fromIni } = require("@aws-sdk/credential-providers");
// require('dotenv').config()

const client = new ECSClient({
  region: "us-east-2",
  credentials: fromIni({
    filepath: __dirname + "/.aws",
  }),
});

function generateBuild(clientName, version) {
  const input = {
    cluster: "arn:aws:ecs:us-east-2:633642797208:cluster/teste",
    count: 1,
    enableExecuteCommand: false,
    launchType: "FARGATE",
    overrides: {
      containerOverrides: [
        {
          // ContainerOverride
          name: "app-build-teste",
          environment: [
            // EnvironmentVariables
            {
              name: "CLIENT",
              value: clientName,
            },
            {
              name: "VERSION",
              value: version,
            },
          ],
        },
      ],
    },
    taskDefinition:
      "arn:aws:ecs:us-east-2:633642797208:task-definition/task-build-medium:4",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: ["subnet-1c566a50"],
        assignPublicIp: "ENABLED",
      },
    },
  };
  const command = new RunTaskCommand(input);
  return client.send(command);
}

async function start() {
  generateBuild("build_teste", "1.0.0");
}

start();
