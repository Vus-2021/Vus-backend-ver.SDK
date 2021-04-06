const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const deleteRouteAndDetails = async ({ detailList, routeInfo }) => {
    const TableName = process.env.TABLE_NAME;
    const transactItems = [
        {
            Delete: {
                TableName,
                Key: routeInfo,
            },
        },
    ].concat(
        detailList.map((detail) => {
            return {
                Delete: {
                    TableName,
                    Key: detail,
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

        return { success: true, message: '노선 삭제 완료', code: 204 };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = deleteRouteAndDetails;
