const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

const pasta = "/app"; // Diretório local
const clientSlug = process.env.CLIENT; // Substitua com o valor apropriado
const version = process.env.VERSION; // Substitua com o valor apropria

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId, // Substitua com suas credenciais do AWS
  secretAccessKey,
  region: "us-east-2", // Substitua com a região desejada
});

function procuraAPK(caminho) {
  fs.readdir(caminho, (err, arquivos) => {
    if (err) {
      console.error("Erro ao ler o diretório:", err);
      return;
    }

    arquivos.forEach((arquivo) => {
      const caminhoArquivo = path.join(caminho, arquivo);

      fs.stat(caminhoArquivo, (erro, stats) => {
        if (erro) {
          console.error("Erro ao obter estatísticas do arquivo:", erro);
          return;
        }

        if (stats.isFile() && path.extname(arquivo) === ".apk") {
          const pastaS3 = `${clientSlug}/${version}`;
          const nomeArquivoS3 = `${pastaS3}/${arquivo}`;

          // Configurações para o upload
          const params = {
            Bucket: "donathanbuilds", // Substitua com o nome do seu bucket S3
            Key: nomeArquivoS3,
            Body: fs.createReadStream(caminhoArquivo),
          };

          // Upload para o Amazon S3
          s3.upload(params, (uploadErr, data) => {
            if (uploadErr) {
              console.error(
                "Erro ao fazer upload para o Amazon S3:",
                uploadErr
              );
            } else {
              console.log(
                `Arquivo ${arquivo} enviado para o Amazon S3 em: ${data.Location}`
              );
            }
          });
        } else if (stats.isDirectory()) {
          procuraAPK(caminhoArquivo);
        }
      });
    });
  });
}

procuraAPK(pasta);
