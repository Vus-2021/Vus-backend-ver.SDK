const getBusInfoByBusId = require('../../../../services/route/getBusInfoBybusId');

const resolvers = {
    Query: {
        getRouteByMonth: async (parent, { partitionKey }) => {
            try {
                const { success, message, code, data } = await getBusInfoByBusId({
                    partitionKey,
                    sortKey: '#2',
                });
                data.forEach((item) => {
                    item.month = item.sortKey.split('#')[1];
                });
                return { success, message, code, data };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
