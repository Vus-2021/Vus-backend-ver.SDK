const { ApolloServer } = require('apollo-server');
const dotenv = require('dotenv');
dotenv.config();

const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: process.env.DYNAMO_DB_END_POINT,
    region: process.env.AWS_REGION,
});

const schema = require('./graphql/mergeSchema');
const formatError = require('./graphql/formatError');
const context = require('./graphql/context');

const server = new ApolloServer({
    schema,
    formatError,
    context,
});

server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
console.log(process.env.AWS_REGION);
