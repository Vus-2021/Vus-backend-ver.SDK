const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const getBusApplicant = async ({ sortKey, gsiSortKey, index, condition }) => {
    try {
        let params;
        params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: '#sk = :sk and #gsi = :gsi',
            ExpressionAttributeNames: {
                '#sk': 'sortKey',
                '#gsi': 'gsiSortKey',
            },
            ExpressionAttributeValues: {
                ':sk': sortKey,
                ':gsi': gsiSortKey,
            },
            IndexName: index,
            ScanIndexForward: false,
        };

        if (condition) {
            let [FilterExpression, ExpressionAttributeValues, ExpressionAttributeNames] = condition;
            params = {
                TableName: process.env.TABLE_NAME,
                KeyConditionExpression: '#sk = :sk and #gsi = :gsi',
                FilterExpression: FilterExpression.substr(5),
                ExpressionAttributeNames: Object.assign(
                    {
                        '#sk': 'sortKey',
                        '#gsi': 'gsiSortKey',
                    },
                    ExpressionAttributeNames
                ),
                ExpressionAttributeValues: Object.assign(
                    {
                        ':sk': sortKey,
                        ':gsi': gsiSortKey,
                    },
                    ExpressionAttributeValues
                ),
                IndexName: index,
                ScanIndexForward: false,
            };
        }
        const busApplicant = (await documentClient.query(params).promise()).Items;
        return {
            success: true,
            message: 'Success get Applicant',
            code: 200,
            data: busApplicant,
        };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = getBusApplicant;
