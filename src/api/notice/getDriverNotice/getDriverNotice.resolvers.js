const { getAllRouteInfo } = require('../../../services/route');
const getDriverNotice = require('../../../services/route/getDriverNotice');
const searchValidator = require('../../../modules/searchValidator');
const dayjs = require('dayjs');
const resolvers = {
    Query: {
        getDriverNotice: async (parent, { route }) => {
            let { success, message, code, result } = {};
            let condition = searchValidator({ isMatched: true, gsiSortKey: route });

            try {
                ({ success, message, code, result } = await getAllRouteInfo({
                    sortKey: '#info',
                    condition,
                }));
                const data = result.map((item) => {
                    return {
                        route: item.gsiSortKey,
                    };
                });
                const routeMap = new Map();

                ({ success, message, code, routeDetails: result } = await getDriverNotice({
                    sortKey: '#detail',
                    currentLocation: true,
                    index: 'sk-index',
                }));

                data.forEach((item) => {
                    routeMap.set(item.route, {
                        updatedAt: 'null',
                        route: item.route,
                        location: 'null',
                    });
                });

                result.forEach((item) => {
                    if (routeMap.has(item.route)) {
                        routeMap.set(item.route, {
                            updatedAt: dayjs(item.updatedAt).format('HH:mm'),
                            route: item.route,
                            location: item.location,
                        });
                    }
                });

                return { success, message, code, data: [...routeMap.values()] };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
