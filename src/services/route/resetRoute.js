/**
 * array 트랜잭션 처리를 못하겠다.
 */
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const resetRoute = async ({ userList, bus }) => {
    const transactItems = [
        {
            Update: {
                TableName: process.env.TABLE_NAME,
                Key: bus,
                UpdateExpression: 'SET registerCount = :value',
                ExpressionAttributeValues: {
                    ':value': 0,
                },
            },
        },
    ].concat(
        userList.map((primaryKey) => {
            return {
                Delete: {
                    TableName: process.env.TABLE_NAME,
                    Key: primaryKey,
                },
            };
        })
    );
    try {
        await documentClient
            .transactWrite({
                TransactItems: transactItems,
            })
            .promise();
        return { success: true, message: '리셋 완료', code: 204 };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = resetRoute;
