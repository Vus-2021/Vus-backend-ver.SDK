const AWS = require('aws-sdk');
const DocumentClient = new AWS.DynamoDB.DocumentClient();

const applyRoute = async ({ userApplyData, busInfo }) => {
    const transactItems = [
        {
            Put: {
                TableName: process.env.TABLE_NAME,
                Item: userApplyData,
            },
        },
        {
            Update: {
                TableName: process.env.TABLE_NAME,
                Key: busInfo,
                UpdateExpression: 'ADD registerCount :value',
                ExpressionAttributeValues: {
                    ':value': 1,
                },
            },
        },
    ];
    try {
        await DocumentClient.transactWrite({
            TransactItems: transactItems,
        }).promise();
        return { success: true, message: '접수 성공', code: 201 };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = applyRoute;
