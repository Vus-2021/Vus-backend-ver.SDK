const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const getBusInfo = async ({ partitionKey, sortKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: '#pk = :pk and begins_with (#sk, :sk)',
        ExpressionAttributeNames: {
            '#pk': 'partitionKey',
            '#sk': 'sortKey',
        },
        ExpressionAttributeValues: {
            ':pk': partitionKey,
            ':sk': sortKey,
        },
    };
    try {
        const bus = (await documentClient.query(params).promise()).Items;

        return { success: true, message: 'success get bus info', code: 200, data: bus };
    } catch (error) {
        return { success: false, message: 'failed get bus info', code: 500 };
    }
};

module.exports = getBusInfo;
