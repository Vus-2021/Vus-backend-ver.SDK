const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const signin = async ({ userId, hashedPassword }) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            partitionKey: userId,
            sortKey: '#user',
        },
    };
    try {
        const user = (await documentClient.get(params).promise()).Item;

        if (user.password !== hashedPassword) {
            return { success: false, message: 'not matched password', code: 400, user: null };
        }
        return { success: true, message: 'login success', code: 200, user };
    } catch (error) {
        return { success: false, message: error.message, code: 500 };
    }
};

module.exports = signin;
