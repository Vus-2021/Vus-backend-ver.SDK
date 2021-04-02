const getDetailRoutesByRoute = require('../../../services/route/getDetailRoutesByRoute');

const resolvers = {
    Query: {
        getDetailRoutes: async (_, { route }) => {
            try {
                const { success, message, code, routeDetails: data } = await getDetailRoutesByRoute(
                    {
                        sortKey: '#detail',
                        route: route,
                        index: 'sk-index',
                    }
                );
                data.forEach((item) => {
                    item.boardingTime = item.gsiSortKey.split('#')[2];
                });
                return { success, message, code, data };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
