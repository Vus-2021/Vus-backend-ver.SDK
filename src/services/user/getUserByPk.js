const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const getUserById = async ({ partitionKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: {
            '#pk': 'partitionKey',
        },
        ExpressionAttributeValues: {
            ':pk': partitionKey,
        },
    };
    try {
        const data = (await docClient.query(params).promise()).Items;

        return { success: true, message: 'getUser', code: 200, data };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getUserById;
