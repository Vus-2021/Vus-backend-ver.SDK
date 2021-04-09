const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const getUserApply = async ({ sortKey, gsiSortKey }) => {
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
        const data = (await documentClient.query(params).promise()).Items;

        return { success: true, message: 'getUserApply', code: 200, data };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getUserApply;
