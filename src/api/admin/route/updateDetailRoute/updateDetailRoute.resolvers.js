const updateDetailRoute = require('../../../../services/route/updateDetailRoute');

const resolvers = {
    Mutation: {
        updateDetailRoute: async (
            _,
            { partitionKey, boardingTime, lat, long, location, route },
            { user }
        ) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            const updateItem = Object.assign({
                gsiSortKey: `#boardingTime#${boardingTime}`,
                lat,
                long,
                location,
                route,
            });
            try {
                const { success, message, code } = await updateDetailRoute({
                    primaryKey: { partitionKey, sortKey: '#detail' },
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
