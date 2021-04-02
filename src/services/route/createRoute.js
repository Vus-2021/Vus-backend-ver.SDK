const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const createRoute = async ({
    partitionKey,
    sortKey,
    gsiSortKey,
    busNumber,
    limitCount,
    driver,
}) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            partitionKey,
            sortKey,
            gsiSortKey,
            busNumber,
            limitCount,
            driver,
        },
    };
    try {
        await documentClient.put(params).promise();
        return { success: true, message: 'success crete Route' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = createRoute;
