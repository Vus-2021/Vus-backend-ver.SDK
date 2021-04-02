const dayjs = require('dayjs');

const cancelRouteByUpdate = require('../../../services/route/cancelRouteByUpdate');
const cancelRouteByDelete = require('../../../services/route/cancleRouteByDelete');
const getUserById = require('../../../services/user/getUserById');
const getRouteById = require('../../../services/route/getRouteById');

/**
 * TODO 신청 취소할때. 취소한 월이 탑승 월보다 전일때는 컬럼을 삭제, 그게 아니면 cancelled toggle,
 */

const resolvers = {
    Mutation: {
        cancelRoute: async (parent, { busId, month }, { user }) => {
            const nowMonth = dayjs(new Date()).format('YYYY-MM');
            if (!user) {
                return { success: false, message: 'access denied', code: 403 };
            }
            try {
                const userInfo = {
                    partitionKey: user.userId,
                    sortKey: `#applyRoute#${month}`,
                };

                let { success, message, code, data } = {};

                ({ success, message, code, data } = await getUserById({
                    partitionKey: user.userId,
                    sortKey: `#applyRoute#${month}`,
                }));

                if (!success) {
                    return { success, message, code };
                }

                if (success && data.isCancellation) {
                    return { success: false, message: '이미 취소되었음', code: 400 };
                }

                ({ success, message, code } = await getRouteById({
                    partitionKey: busId,
                    sortKey: `#${month}`,
                }));

                if (!success) {
                    return { success, message, code };
                }

                const bus = {
                    partitionKey: busId,
                    sortKey: `#${month}`,
                };

                if (nowMonth === month) {
                    ({ success, message, code } = await cancelRouteByUpdate({ userInfo, bus }));
                } else {
                    ({ success, message, code } = await cancelRouteByDelete({ userInfo, bus }));
                }
                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
