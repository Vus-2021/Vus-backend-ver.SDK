const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const getDetailRoutesByRoute = async ({ sortKey, route, index }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: '#sk = :sk',
        FilterExpression: 'route = :route',
        IndexName: index,
        ExpressionAttributeNames: {
            '#sk': 'sortKey',
        },
        ExpressionAttributeValues: {
            ':sk': sortKey,
            ':route': route,
        },
        ScanIndexForward: true,
    };

    try {
        const routeDetails = (await documentClient.query(params).promise()).Items;
        return { success: true, message: 'getRoute', code: 201, routeDetails };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getDetailRoutesByRoute;
