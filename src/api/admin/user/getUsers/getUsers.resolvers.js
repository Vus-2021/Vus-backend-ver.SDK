const searchValidator = require('../../../../modules/searchValidator');
const getUsers = require('../../../../services/user/getUsers');

const resolvers = {
    Query: {
        getUsers: async (parent, args, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            const { isMatched, userId, name, type } = {
                userId: args.userId,
                name: args.name,
                type: args.type,
                isMatched: args.isMatched || false,
            };
            let condition = searchValidator({ isMatched, userId, name, type });

            try {
                const { success, message, code, data } = await getUsers({
                    sortKey: '#user',
                    index: 'sk-index',
                    condition,
                });
                data.forEach((user) => {
                    user.registerDate = user.gsiSortKey.split('#')[2];
                    user.userId = user.partitionKey;
                });

                return { success, message, code, data };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
