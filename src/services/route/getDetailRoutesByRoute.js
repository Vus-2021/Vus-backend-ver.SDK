const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const getDetailRoutesByRoute = async ({ sortKey, route, index, condition }) => {
    let params;
    params = {
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

    if (condition) {
        let [FilterExpression, ExpressionAttributeValues, ExpressionAttributeNames] = condition;
        params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: '#sk = :sk',
            FilterExpression: 'route = :route'.concat(FilterExpression),
            ExpressionAttributeNames: Object.assign(
                {
                    '#sk': 'sortKey',
                },
                ExpressionAttributeNames
            ),
            ExpressionAttributeValues: Object.assign(
                {
                    ':sk': sortKey,
                    ':route': route,
                },
                ExpressionAttributeValues
            ),
            IndexName: index,
            ScanIndexForward: true,
        };
    }

    try {
        const routeDetails = (await documentClient.query(params).promise()).Items;
        return { success: true, message: 'getRoute', code: 201, routeDetails };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getDetailRoutesByRoute;
