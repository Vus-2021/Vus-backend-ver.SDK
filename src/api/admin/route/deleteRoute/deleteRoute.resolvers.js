const deleteRoute = require('../../../../services/route/deleteRoute');
const getBusInfo = require('../../../../services/route/getBusInfoBybusId');

const resolvers = {
    Mutation: {
        deleteRoute: async (_, { partitionKey }, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            const sortKey = '#info';
            try {
                let { success, message, code, data } = await getBusInfo({ partitionKey, sortKey });
                if (data.count === 0) {
                    return { success: false, message: 'invalide Route Id', code: 400 };
                }

                ({ success, message, code } = await deleteRoute({ partitionKey, sortKey }));
                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
