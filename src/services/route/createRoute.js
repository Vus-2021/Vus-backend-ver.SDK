const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const createRoute = async ({ createItem, driverPK }) => {
    const transactItems = [
        {
            Put: {
                TableName: process.env.TABLE_NAME,
                Item: createItem,
            },
        },
        {
            Update: {
                TableName: process.env.TABLE_NAME,
                Key: driverPK,
                UpdateExpression: 'SET busId = :busId and gsiSortKey = :gsiSortKey',
                ExpressionAttributeValues: {
                    ':busId': createItem.partitonKey,
                    ':gsiSortKey': createItem.gsiSortKey,
                },
            },
        },
    ];
    try {
        await documentClient
            .transactWrite({
                TransactItems: transactItems,
            })
            .promise();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = createRoute;
