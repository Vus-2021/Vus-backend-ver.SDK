const AWS = require('aws-sdk');

const documemntClient = new AWS.DynamoDB.DocumentClient();

const getAdminNotice = async ({ sortKey, index, noticeType, condition }) => {
    try {
        let params;
        params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: '#sk = :sk',
            FilterExpression: 'noticeType = :noticeType',
            ExpressionAttributeNames: {
                '#sk': 'sortKey',
            },
            ExpressionAttributeValues: {
                ':sk': sortKey,
                ':noticeType': noticeType,
            },
            IndexName: index,
            ScanIndexForward: false,
        };

        if (condition) {
            let [FilterExpression, ExpressionAttributeValues] = condition;
            params = {
                TableName: process.env.TABLE_NAME,
                KeyConditionExpression: '#sk = :sk',
                FilterExpression: 'noticeType = :noticeType'.concat(FilterExpression),
                ExpressionAttributeNames: {
                    '#sk': 'sortKey',
                },
                ExpressionAttributeValues: Object.assign(
                    {
                        ':sk': sortKey,
                        ':noticeType': noticeType,
                    },
                    ExpressionAttributeValues
                ),
                IndexName: index,
                ScanIndexForward: false,
            };
        }
        const adminNotice = (await documemntClient.query(params).promise()).Items;

        return {
            success: true,
            message: 'Success get notice',
            code: 200,
            data: adminNotice,
        };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getAdminNotice;
