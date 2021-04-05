const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const deleteUsers = async ({ userList }) => {
    const TableName = process.env.TABLE_NAME;
    const params = { RequestItems: {} };
    params.RequestItems[TableName] = userList.map((user) => {
        return {
            DeleteRequest: {
                Key: user,
            },
        };
    });
    try {
        await documentClient.batchWrite(params).promise();
        return { success: true, message: '유저 삭제 성공', code: 204 };
    } catch (error) {
        return { success: false, message: '서버 에러', code: 500 };
    }
};

module.exports = deleteUsers;
