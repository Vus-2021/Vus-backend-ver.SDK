const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const getNoticeById = async ({ partitionKey, sortKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            partitionKey,
            sortKey,
        },
    };
    try {
        const notice = (await documentClient.get(params).promise()).Item;

        if (!notice) {
            return { success: false, message: 'invalid notice', code: 400, data: null };
        }
        return { success: true, message: 'success get notice', code: 200, data: notice };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getNoticeById;
