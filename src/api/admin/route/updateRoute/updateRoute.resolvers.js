const updateDetailRoute = require('../../../../services/route/updateDetailRoute');

/**
 * TODO onDelete ..
 */
const resolvers = {
    Mutation: {
        updateRoute: async (
            _,
            { partitionKey, route, busNumber, limitCount, driver },
            { user }
        ) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }

            const updateItem = { route, busNumber, limitCount, driver };
            try {
                const { success, message, code } = await updateDetailRoute({
                    primaryKey: { partitionKey, sortKey: '#info' },
                    updateItem,
                });

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
