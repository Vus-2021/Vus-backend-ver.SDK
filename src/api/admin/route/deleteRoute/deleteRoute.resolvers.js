const deleteRouteAndDetails = require('../../../../services/route/deleteRouteAndDetails');
const getBusInfo = require('../../../../services/route/getBusInfoBybusId');
const getDetailRoutesByRoute = require('../../../../services/route/getDetailRoutesByRoute');
/**
 * TODO onDelete
 */

const resolvers = {
    Mutation: {
        deleteRoute: async (_, { partitionKey }, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            const sortKey = '#info';
            try {
                let { success, message, code, data } = await getBusInfo({ partitionKey, sortKey });
                if (data.count === 0) {
                    return { success: false, message: 'invalide Route Id', code: 400 };
                }
                const route = data[0].gsiSortKey;
                ({ success, message, code, routeDetails: data } = await getDetailRoutesByRoute({
                    sortKey: '#detail',
                    route: route,
                    index: 'sk-index',
                }));
                const detailList = data.map((item) => {
                    return {
                        partitionKey: item.partitionKey,
                        sortKey: '#detail',
                    };
                });
                ({ success, message, code } = await deleteRouteAndDetails({
                    detailList,
                    routeInfo: { partitionKey, sortKey },
                }));
                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
