/**
 * TODO
 * GSI-PK #applyRoute#YYYY-MM 아래 있는 데이터들을 모두 제거. busId #YYYY-MM 의 Attribute 인 register count가 0으로 셋팅
 */

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

                /**
                 * 시작이다
                 * #applyRoute#month query로 찾고  => map  id : apply month 해서 리스트 보내기.
                 */
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
