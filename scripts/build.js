const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs"); // CommonJS import
const { fromEnv, fromIni } = require("@aws-sdk/credential-providers");
// require('dotenv').config()

async function start() {
  const client = new ECSClient({
    region: "us-east-2",
    credentials: fromIni({
      filepath: __dirname + "/.aws",
    }),
  });
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
              value: "teste_ext",
            },
            {
              name: "VERSION",
              value: "1.0.0",
            },
          ],
        },
      ],
    },
    taskDefinition:
      "arn:aws:ecs:us-east-2:633642797208:task-definition/task-build-medium:3",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: ["subnet-055d5ca8abf859977", "subnet-039534fb655562318"],
      },
    },
  };
  const command = new RunTaskCommand(input);
  const response = await client.send(command);
  console.log(response);
}

start();
