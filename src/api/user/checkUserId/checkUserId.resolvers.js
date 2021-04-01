const { getUserById } = require('../../../services/user');

const resolvers = {
    Query: {
        checkUserId: async (_, args) => {
            try {
                const { userId } = args;
                const { success: alreadyUserId, code } = await getUserById({
                    partitionKey: userId,
                    sortKey: '#user',
                });

                if (alreadyUserId) {
                    return { success: false, message: 'alreadyUserId', code };
                }

                return { success: true, message: 'Available user id', code };
            } catch (error) {
                return { success: true, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
