const AWS = require('aws-sdk');
const DocumentClient = new AWS.DynamoDB.DocumentClient();

const getRouteById = async ({ partitionKey, sortKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            partitionKey,
            sortKey,
        },
    };
    try {
        const route = (await DocumentClient.get(params).promise()).Item;

        if (!route) {
            return { success: false, message: 'invalid route', code: 400, route: null };
        }
        return { success: true, message: 'get route', code: 200, route };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getRouteById;
