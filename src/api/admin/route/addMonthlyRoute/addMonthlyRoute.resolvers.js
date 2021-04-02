const addMonthlyRoute = require('../../../../services/route/addMonthlyRoute');

const resolvers = {
    Mutation: {
        addMonthlyRoute: async (_, args, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }

            try {
                const { success, message, code } = await addMonthlyRoute({
                    partitionKey: args.partitionKey,
                    sortKey: `#${args.month}`,
                    registerCount: 0,
                    gsiSortKey: args.route,
                });

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
