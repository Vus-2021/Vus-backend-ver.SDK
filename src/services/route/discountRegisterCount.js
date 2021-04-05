const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const discountRegisterCount = async ({ primaryKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: primaryKey,
        UpdateExpression: 'ADD registerCount :val',
        ExpressionAttributeValues: {
            ':val': -1,
        },
    };
    try {
        await documentClient.update(params).promise();
        return { success: true, message: 'success update', code: 204 };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = discountRegisterCount;
