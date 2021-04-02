const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const deleteNotice = async ({ noticeList }) => {
    const TableName = process.env.TABLE_NAME;

    const params = { RequestItems: {} };
    params.RequestItems[TableName] = noticeList.map((item) => {
        return {
            DeleteRequest: {
                Key: item,
            },
        };
    });

    try {
        await documentClient.batchWrite(params).promise();
        return { success: true, message: '공지 삭제 성공', code: 204 };
    } catch (error) {
        return { success: false, message: '서버 에러', code: 500 };
    }
};

module.exports = deleteNotice;
