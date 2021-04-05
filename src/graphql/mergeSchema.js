const {
    mergeTypeDefs,
    mergeResolvers,
    loadFilesSync,
    makeExecutableSchema,
} = require('graphql-tools');
const path = require('path');

const allTypes = loadFilesSync(path.join(__dirname, '../api/**/*.graphql'));
const allResolvers = loadFilesSync(path.join(__dirname, '../api/**/*.resolvers.js'));
const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs(allTypes),
    resolvers: mergeResolvers(allResolvers),
});

module.exports = schema;
