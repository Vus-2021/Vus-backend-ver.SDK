const AWS = require('aws-sdk');
const documemntClient = new AWS.DynamoDB.DocumentClient();

const getDetailRoutesByRoute = async ({ sortKey, currentLocation, index }) => {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: '#sk = :sk',
            FilterExpression: 'currentLocation = :currentLocation',
            ExpressionAttributeNames: {
                '#sk': 'sortKey',
            },
            ExpressionAttributeValues: {
                ':sk': sortKey,
                ':currentLocation': currentLocation,
            },
            IndexName: index,
            ScanIndexForward: false,
        };
        const routeDetails = (await documemntClient.query(params).promise()).Items;
        return { success: true, message: 'getRoute', code: 201, routeDetails };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getDetailRoutesByRoute;
