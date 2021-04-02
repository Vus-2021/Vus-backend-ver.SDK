const uuid = require('uuid');

const createRouteDetail = require('../../../../services/route/createRouteDetail');
/**
 * TODO 토큰 적용하면 ADMIN만 Route를 생성 가능하게!
 */
const resolvers = {
    Mutation: {
        createRouteDetail: async (_, args, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            const { location, route, imageUrl, lat, long, boardingTime } = args;
            try {
                const [partitionKey, sortKey, gsiSortKey] = [
                    uuid.v4(),
                    '#detail',
                    `#boardingTime#${boardingTime}`,
                ];
                const routeDetail = { location, route, imageUrl, lat, long };

                const { success, message, code } = await createRouteDetail({
                    partitionKey,
                    sortKey,
                    gsiSortKey,
                    routeDetail,
                });

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
