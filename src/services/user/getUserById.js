const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const getUserById = async ({ partitionKey, sortKey }) => {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                partitionKey,
                sortKey,
            },
        };
        const user = (await documentClient.get(params).promise()).Item;

        if (!user) {
            return { success: false, message: '신청 이력이 없습니다.', code: 400, user: null };
        }
        return { success: true, message: 'getUser', code: 200, data: user };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getUserById;
