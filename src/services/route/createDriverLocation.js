const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');

const createDriverLocation = async ({ preKey, destinationKey, updatedAt, locationIndex }) => {
    try {
        if (!_.isNil(preKey) && !_.isNil(destinationKey)) {
            const transactItems = [
                {
                    Update: {
                        TableName: process.env.TABLE_NAME,
                        Key: {
                            partitionKey: preKey,
                            sortKey: '#detail',
                        },
                        UpdateExpression: 'SET currentLocation = :value ',
                        ExpressionAttributeValues: {
                            ':value': false,
                        },
                    },
                },
                {
                    Update: {
                        TableName: process.env.TABLE_NAME,
                        Key: {
                            partitionKey: destinationKey,
                            sortKey: '#detail',
                        },
                        UpdateExpression:
                            'SET #currentLocation = :locationValue and #updatedAt = :updatedAt and #locationIndex = :locationIndex',
                        ExpressionAttributeNames: {
                            '#currentLocation': 'currentLocation',
                            '#updatedAt': 'updatedAt',
                            '#locationIndex': 'locationIndex',
                        },
                        ExpressionAttributeValues: {
                            ':locationValue': true,
                            ':updatedAt': updatedAt,
                            ':locationIndex': locationIndex,
                        },
                    },
                },
            ];

            await documentClient
                .transactWrite({
                    TransactItems: transactItems,
                })
                .promise();
        } else if (!_.isNil(preKey)) {
            const params = {
                TableName: process.env.TABLE_NAME,
                Key: { partitionKey: preKey, sortKey: '#detail' },
                UpdateExpression: 'SET currentLocation = :value ',
                ExpressionAttributeValues: {
                    ':value': false,
                },
            };
            await documentClient.update(params).promise();
        } else if (!_.isNil(destinationKey)) {
            const params = {
                TableName: process.env.TABLE_NAME,
                Key: { partitionKey: destinationKey, sortKey: '#detail' },
                UpdateExpression:
                    'SET #currentLocation = :locationValue and #updatedAt = :updatedAt and #locationIndex = :locationIndex',
                ExpressionAttributeNames: {
                    '#currentLocation': 'currentLocation',
                    '#updatedAt': 'updatedAt',
                    '#locationIndex': 'locationIndex',
                },
                ExpressionAttributeValues: {
                    ':locationValue': true,
                    ':updatedAt': updatedAt,
                    ':locationIndex': locationIndex,
                },
            };
            await documentClient.update(params).promise();
        }

        return { success: true, message: '위치 변경 성공', code: 204 };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = createDriverLocation;
