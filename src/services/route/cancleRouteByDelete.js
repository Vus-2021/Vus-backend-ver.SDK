const AWS = require('aws-sdk');
const DocumentClient = new AWS.DynamoDB.DocumentClient();

const cancelRouteByDelete = async ({ userInfo, bus }) => {
    const TableName = process.env.TABLE_NAME;
    const transactItems = [
        {
            Delete: {
                TableName,
                Key: userInfo,
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

module.exports = cancelRouteByDelete;
