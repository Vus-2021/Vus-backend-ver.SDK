const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const createRouteDetail = async ({ partitionKey, sortKey, gsiSortKey, routeDetail }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            partitionKey,
            sortKey,
            gsiSortKey,
            ...routeDetail,
        },
    };
    try {
        await documentClient.put(params).promise();
        return { success: true, message: 'success crete Route detail', code: 201 };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = createRouteDetail;
