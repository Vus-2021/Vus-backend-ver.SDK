const getUserByPk = require('../../../services/user/getUserByPk');

const resolvers = {
    Query: {
        getMyInformation: async (parent, args, context) => {
            if (!context.user) return { success: false, message: context.message, code: 400 };
            try {
                let { data } = await getUserByPk({ partitionKey: context.user.userId });

                data = data
                    .filter((item) => {
                        return (
                            (item.state === 'pending' || item.state === 'fulfilled') &&
                            !item.isCancellation &&
                            item.sortKey !== '#user'
                        );
                    })
                    .map((dataItem) => {
                        return {
                            partitionKey: dataItem.partitionKey,
                            sortKey: dataItem.sortKey,
                            routes: dataItem.gsiSortKey,
                            busId: dataItem.busId,
                            month: dataItem.sortKey.split('#')[2],
                        };
                    });
                const obj = context.user;
                obj.routeInfo = data;

                return {
                    success: true,
                    message: 'success get my information',
                    code: 200,
                    data: obj,
                };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
