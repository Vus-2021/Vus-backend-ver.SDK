const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const getUserById = async ({ partitionKey, sortKey }) => {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                partitionKey,
                sortKey,
            },
        };
        const user = (await docClient.get(params).promise()).Item;

        if (!user) {
            return { success: false, message: 'invalid user', code: 400, user: null };
        }
        return { success: true, message: 'getUser', code: 200, data: user };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getUserById;
