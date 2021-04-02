const _ = require('lodash');
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const getRouteByUserId = async ({ partitionKey, sortKey }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            partitionKey,
            sortKey,
        },
    };
    try {
        const result = (await docClient.get(params).promise()).Item;
        if (_.isNil(result)) {
            return { success: false, message: '결과 없음.' };
        }

        return { success: true, message: '조회 성공', code: 200, data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = getRouteByUserId;
