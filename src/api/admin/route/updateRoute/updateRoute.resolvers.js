const updateDetailRoute = require('../../../../services/route/updateDetailRoute');
const uploadS3 = require('../../../../modules/s3');

/**
 * TODO onDelete ..
 */
const resolvers = {
    Mutation: {
        updateRoute: async (
            _,
            { partitionKey, route, busNumber, limitCount, driver, file },
            { user }
        ) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }

            let updateItem;

            try {
                if (!file) {
                    updateItem = { route, busNumber, limitCount, driver };
                } else {
                    const { createReadStream, filename } = await file;
                    const fileStream = createReadStream();
                    const fileInfo = await uploadS3({ fileStream, filename });
                    updateItem = Object.assign(updateItem, { imageUrl: fileInfo.Location });
                }
                const { success, message, code } = await updateDetailRoute({
                    primaryKey: { partitionKey, sortKey: '#info' },
                    updateItem,
                });

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
