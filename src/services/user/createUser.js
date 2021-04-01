const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const createUser = async ({ userId, password, salt, name, phoneNumber, type, registerDate }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            partitionKey: userId,
            sortKey: '#user',
            gsiSortKey: `#registerDate#${registerDate}`,
            password: password,
            name: name,
            salt: salt,
            phoneNumber: phoneNumber,
            type: type,
        },
    };
    try {
        await docClient.put(params).promise();
        return { success: true, message: '회원가입 성공', code: 201 };
    } catch (err) {
        return { success: false, message: err.message, code: 500 };
    }
};

module.exports = createUser;
