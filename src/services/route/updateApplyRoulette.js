const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const updateApplyRolette = async ({ fulfilledKeys, rejectKeys }) => {
    const TableName = process.env.TABLE_NAME;
    try {
        let transactItems = [];
        transactItems
            .concat(
                fulfilledKeys.map((item) => {
                    return {
                        Update: {
                            TableName,
                            Key: item,
                            UpdateExpression: 'SET #state = :state',
                            ExpressionAttributeNames: {
                                '#state': ':state',
                            },
                            ExpressionAttributeValues: {
                                ':state': 'fulfilled',
                            },
                        },
                    };
                })
            )
            .concat(
                rejectKeys.map((item) => {
                    return {
                        Update: {
                            TableName,
                            Key: item,
                            UpdateExpression: 'SET #state = :state',
                            ExpressionAttributeNames: {
                                '#state': ':state',
                            },
                            ExpressionAttributeValues: {
                                ':state': 'reject',
                            },
                        },
                    };
                })
            );

        await documentClient
            .transactWrite({
                TransactItems: transactItems,
            })
            .promise();
        return { success: true, message: 'success update', code: 204 };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = updateApplyRolette;
