const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');

const getUserApply = require('../../../../services/user/getUserApply');
const getRouteById = require('../../../../services/route/getRouteById');
const applyRoulette = require('../../../../services/route/applyRoulette');
const updateApplyRolette = require('../../../../services/route/updateApplyRoulette');
dayjs.extend(duration);

const resolvers = {
    Mutation: {
        triggerPassengers: async (parent, { month, route, busId }) => {
            let { success, message, code, data } = {};

            try {
                const bus = await getRouteById({ partitionKey: busId, sortKey: '#info' });

                ({ success, message, code, result: data } = await getUserApply({
                    sortKey: `#applyRoute#${month}`,
                    gsiSortKey: route,
                }));
                let applicants = data.sort(() => Math.random() - Math.random());
                const limitCount = bus.route.limitCount;
                const { fulfilled, reject } = applyRoulette({ applicants, limitCount });
                const fulfilledKeys = fulfilled.map((item) => {
                    return {
                        partitionKey: item.partitionKey,
                        sortKey: item.sortKey,
                    };
                });

                const rejectKeys = reject.map((item) => {
                    return {
                        partitionKey: item.partitionKey,
                        sortKey: item.sortKey,
                    };
                });
                ({ success, message, code } = await updateApplyRolette({
                    fulfilledKeys,
                    rejectKeys,
                }));

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
