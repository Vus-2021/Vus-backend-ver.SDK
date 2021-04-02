const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const getRouteInfo = async ({ sortKey, gsiSortKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: '#sk = :sk and gsiSortKey = :gsiSortKey',
        IndexName: 'sk-index',
        ExpressionAttributeNames: {
            '#sk': 'sortKey',
        },
        ExpressionAttributeValues: {
            ':sk': sortKey,
            ':gsiSortKey': gsiSortKey,
        },
    };
    try {
        const result = (await documentClient.query(params).promise()).Items;

        if (result.count === 0) {
            return { success: false, message: 'NullValue', code: 200 };
        }

        return { success: true, message: 'getRoute', code: 200, result };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getRouteInfo;
