const jwt = require('../../../modules/jwt');
const { signin, getUserById } = require('../../../services/user');
const { getHashedPassword } = require('../../../modules/hash');
const _ = require('lodash');

const resolvers = {
    Mutation: {
        signin: async (parent, args) => {
            const { userId, password } = args;
            let { data: getUser } = await getUserById({
                partitionKey: userId,
                sortKey: '#user',
            });
            if (_.isNil(getUser)) {
                return { success: false, message: 'invalid user Id', code: 400 };
            }
            const salt = getUser.salt;
            const hashedPassword = await getHashedPassword(password, salt);
            const { success, user, message, code } = await signin({ userId, hashedPassword });
            if (!success) {
                return { success, message, code };
            }
            const payload = { userId: user.partitionKey, name: user.name, type: user.type };
            const token = await jwt.sign(payload);
            return { success, message, code, data: token };
        },
    },
};

module.exports = resolvers;
