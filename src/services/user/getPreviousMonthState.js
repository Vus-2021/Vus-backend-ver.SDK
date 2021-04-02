const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const getPreviousMonthState = async ({ partitionKey, sortKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            partitionKey,
            sortKey,
        },
    };
    try {
        const previousApplyData = (await docClient.get(params).promise()).Item;

        return {
            success: true,
            message: 'success! get previouse apply data',
            code: 200,
            data: previousApplyData,
        };
    } catch (error) {
        return { success: false, message: 'failed! get previouse apply data', code: 500 };
    }
};

module.exports = getPreviousMonthState;
