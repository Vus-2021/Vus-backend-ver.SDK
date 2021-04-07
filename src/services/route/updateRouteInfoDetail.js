const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const updateDetailRoute = async ({ primaryKey, updateItem, detailList }) => {
    const TableName = process.env.TABLE_NAME;
    let ExpressionAttributeNames = Object.entries({
        ...updateItem,
    }).reduce((acc, [key, _]) => {
        let obj = {};
        obj['#' + key] = key;
        return Object.assign(acc, obj);
    }, {});

    let ExpressionAttributeValues = Object.entries({
        ...updateItem,
    }).reduce((acc, [key, value]) => {
        let obj = {};
        obj[':' + key] = value;
        return Object.assign(acc, obj);
    }, {});

    let UpdateExpression = Object.entries({
        ...updateItem,
    })
        .reduce((acc, [key, _]) => {
            return acc.concat(` #${key} = :${key},`);
        }, 'SET')
        .slice(0, -1);
    let transactItems = [
        {
            Update: {
                TableName,
                Key: primaryKey,
                UpdateExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
            },
        },
    ];
    try {
        if (detailList) {
            for (let item of detailList) {
                let { partitionKey, sortKey, ...updateDetail } = item;

                ExpressionAttributeNames = Object.entries({
                    ...updateDetail,
                }).reduce((acc, [key, _]) => {
                    let obj = {};
                    obj['#' + key] = key;
                    return Object.assign(acc, obj);
                }, {});

                ExpressionAttributeValues = Object.entries({
                    ...updateDetail,
                }).reduce((acc, [key, value]) => {
                    let obj = {};
                    obj[':' + key] = value;
                    return Object.assign(acc, obj);
                }, {});

                UpdateExpression = Object.entries({
                    ...updateDetail,
                })
                    .reduce((acc, [key, _]) => {
                        return acc.concat(` #${key} = :${key},`);
                    }, 'SET')
                    .slice(0, -1);
                transactItems = transactItems.concat({
                    Update: {
                        TableName,
                        Key: {
                            partitionKey,
                            sortKey,
                        },
                        UpdateExpression,
                        ExpressionAttributeNames,
                        ExpressionAttributeValues,
                    },
                });
            }
        }
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

module.exports = updateDetailRoute;
