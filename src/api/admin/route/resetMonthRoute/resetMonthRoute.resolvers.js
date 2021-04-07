const getRouteById = require('../../../../services/route/getRouteById');
const getRouteInfo = require('../../../../services/route/getRouteInfo');
const resetRoute = require('../../../../services/route/resetRoute');

const resolvers = {
    Mutation: {
        resetMonthRoute: async (parent, { busId, month, route }, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            try {
                let { success, message, code, data } = {};

                ({ success, message, code } = await getRouteById({
                    partitionKey: busId,
                    sortKey: `#${month}`,
                }));

                if (!success) {
                    return { success, message, code };
                }

                ({ success, message, code, route: data } = await getRouteById({
                    partitionKey: busId,
                    sortKey: `#info`,
                }));

                if (data.gsiSortKey !== route) {
                    return { success: false, message: 'invalid route', code: 400 };
                }

                const userList = (
                    await getRouteInfo({
                        sortKey: `#applyRoute#${month}`,
                        gsiSortKey: route,
                    })
                ).result.map((item) => {
                    return {
                        partitionKey: item.partitionKey,
                        sortKey: `#applyRoute#${month}`,
                    };
                });

                const bus = {
                    partitionKey: busId,
                    sortKey: `#${month}`,
                };

                ({ success, message, code } = await resetRoute({ userList, bus }));

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
