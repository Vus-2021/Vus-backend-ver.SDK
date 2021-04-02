const AWS = require('aws-sdk');
const DocumentClient = new AWS.DynamoDB.DocumentClient();

const cancelRouteByUpdate = async ({ userInfo, bus }) => {
    const TableName = process.env.TABLE_NAME;
    const transactItems = [
        {
            Update: {
                TableName,
                Key: userInfo,
                UpdateExpression: 'SET isCancellation :val',
                ExpressionAttributeValues: {
                    ':val': true,
                },
            },
        },
        {
            Update: {
                TableName,
                Key: bus,
                UpdateExpression: 'ADD registerCount :val',
                ExpressionAttributeValues: {
                    ':val': -1,
                },
            },
        },
    ];
    try {
        await DocumentClient.transactWrite({
            TransactItems: transactItems,
        }).promise();

        return { success: true, message: '통근 버스 취소', code: 204 };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = cancelRouteByUpdate;
