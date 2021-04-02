const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const getAllRouteInfo = async ({ sortKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: '#sk = :sk',
        IndexName: 'sk-index',
        ExpressionAttributeNames: {
            '#sk': 'sortKey',
        },
        ExpressionAttributeValues: {
            ':sk': sortKey,
        },
    };
    try {
        const result = (await documentClient.query(params).promise()).Items;

        return { success: true, message: 'getRoutes', code: 200, result };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getAllRouteInfo;
