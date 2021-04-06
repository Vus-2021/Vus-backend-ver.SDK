const updateDetailRoute = require('../../../../services/route/updateDetailRoute');
const uploadS3 = require('../../../../modules/s3');
const resolvers = {
    Mutation: {
        updateDetailRoute: async (
            _,
            { partitionKey, boardingTime, lat, long, location, route, file },
            { user }
        ) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }

            let updateItem;

            if (!file) {
                updateItem = Object.assign({
                    gsiSortKey: `#boardingTime#${boardingTime}`,
                    lat,
                    long,
                    location,
                    route,
                });
            } else {
                const { createReadStream, filename } = await file;
                const fileStream = createReadStream();
                const fileInfo = await uploadS3({ fileStream, filename });
                updateItem = Object.assign(updateItem, { imageUrl: fileInfo.Location });
            }
            try {
                const { success, message, code } = await updateDetailRoute({
                    primaryKey: { partitionKey, sortKey: '#detail' },
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
