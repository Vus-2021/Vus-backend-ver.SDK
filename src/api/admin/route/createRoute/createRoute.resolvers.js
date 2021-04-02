const createRoute = require('../../../../services/route/createRoute');
const uuid = require('uuid');

const resolvers = {
    Mutation: {
        createRoute: async (_, args, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            const { busNumber, limitCount, driver, route } = args;
            try {
                const [partitionKey, sortKey, gsiSortKey] = [uuid.v4(), '#info', route];

                const { success, message, code } = await createRoute({
                    partitionKey,
                    sortKey,
                    gsiSortKey,
                    busNumber,
                    limitCount,
                    driver,
                });

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
