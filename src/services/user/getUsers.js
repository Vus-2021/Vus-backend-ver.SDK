const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const getUsers = async ({ sortKey, index, condition }) => {
    try {
        let params;
        params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: '#sk = :sk',
            ExpressionAttributeNames: {
                '#sk': 'sortKey',
            },
            ExpressionAttributeValues: {
                ':sk': sortKey,
            },
            IndexName: index,
            ScanIndexForward: false,
        };

        if (condition) {
            let [FilterExpression, ExpressionAttributeValues, ExpressionAttributeNames] = condition;

            params = {
                TableName: process.env.TABLE_NAME,
                KeyConditionExpression: '#sk = :sk',
                FilterExpression: FilterExpression.substr(5),
                ExpressionAttributeNames: Object.assign(
                    {
                        '#sk': 'sortKey',
                    },
                    ExpressionAttributeNames
                ),
                ExpressionAttributeValues: Object.assign(
                    {
                        ':sk': sortKey,
                    },
                    ExpressionAttributeValues
                ),
                IndexName: index,
                ScanIndexForward: false,
            };
        }

        const users = (await documentClient.query(params).promise()).Items;

        return {
            success: true,
            message: 'Success get users',
            code: 200,
            data: users,
        };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getUsers;
