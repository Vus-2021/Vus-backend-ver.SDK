const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const deleteRoute = async ({ partitionKey, sortKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            partitionKey,
            sortKey,
        },
    };
    try {
        await documentClient.delete(params).promise();
        return { success: true, message: '노선 삭제 성공', code: 204 };
    } catch (error) {
        return { success: false, message: '서버 에러', code: 500 };
    }
};

module.exports = deleteRoute;
