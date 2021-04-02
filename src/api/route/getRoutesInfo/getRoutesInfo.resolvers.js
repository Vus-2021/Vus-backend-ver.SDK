const getAllRouteInfo = require('../../../services/route/getAllRouteInfo');
const getRouteInfo = require('../../../services/route/getRouteInfo');
const getBusInfo = require('../../../services/route/getBusInfoBybusId');
const dayjs = require('dayjs');
//const searchValidator = require('../../../modules/searchValidator');
/**
 * month랑, route를 필터링해서 받기....
 */
const resolvers = {
    Query: {
        getRoutesInfo: async (_, args) => {
            const { month, route } = {
                month: args.month || dayjs().format('YYYY-MM'),
                route: args.route,
            };

            try {
                let success, message, code, result;
                if (!route) {
                    ({ success, message, code, result } = await getAllRouteInfo({
                        sortKey: '#info',
                    }));
                } else {
                    ({ success, message, code, result } = await getRouteInfo({
                        sortKey: '#info',
                        gsiSortKey: route,
                    }));
                }

                result.forEach((item) => {
                    item.route = item.gsiSortKey;
                });
                const busMap = new Map();

                result.forEach((bus) => {
                    busMap.set(bus.partitionKey, {
                        ...bus,
                        month: {},
                    });
                });

                const partitionKeys = result.map((item) => item.partitionKey);
                let busInfo = [];
                for (let partitionKey of partitionKeys) {
                    let bus = await getBusInfo({ partitionKey, sortKey: `#${month}` });
                    busInfo.push(...bus.data);
                }
                busInfo.forEach((item) => {
                    busMap.get(item.partitionKey).month = {
                        registerCount: item.registerCount,
                        month: month,
                    };
                });

                const data = [...busMap.values()];

                return { success, message, code, data };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
