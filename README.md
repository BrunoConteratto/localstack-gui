# LocalStack GUI

## Requisitos

- [NodeJS](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Imagem LocalStack](https://hub.docker.com/r/localstack/localstack)

## Tecnologias

- [Electron](https://www.electronjs.org/)
- [AWS-SDK](https://aws.amazon.com/pt/tools/)

## Recursos

- [ ] Dashboard.
- [-] Buckets.
- [-] Lambdas.
- [ ] Elastic Compute Cloud (EC2).
- [ ] Relational Database Service (RDS).
- [ ] Simple Email Service (SES).
- [ ] Simple Notification Service (SNS).
- [ ] Simple Queue Service (SQS).

## Configuração

```properties
src/main.js line 14

AWS.config.update({
  accessKeyId: 'teste',
  secretAccessKey: 'teste',
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  s3ForcePathStyle: true,
});
```

## Executar

```properties
npm run start
```
