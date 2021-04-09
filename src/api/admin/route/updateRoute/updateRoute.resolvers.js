const updateRouteInfoDetail = require('../../../../services/route/updateRouteInfoDetail');
const getDetailRoutesByRoute = require('../../../../services/route/getDetailRoutesByRoute');
const getRouteById = require('../../../../services/route/getRouteById');
const uploadS3 = require('../../../../modules/s3');

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
            updateItem = { gsiSortKey: route, busNumber, limitCount, driver };

            try {
                const thisRoute = (await getRouteById({ partitionKey, sortKey: '#info' })).route;
                let detailList;
                if (route !== thisRoute.gsiSortKey) {
                    const details = await getDetailRoutesByRoute({
                        sortKey: '#detail',
                        route: thisRoute.gsiSortKey,
                        index: 'sk-index',
                    });
                    detailList = details.routeDetails.map((item) => {
                        return {
                            partitionKey: item.partitionKey,
                            sortKey: '#detail',
                            route: route,
                            gsiSortKey: item.gsiSortKey,
                            location: item.location,
                            lat: item.lat,
                            long: item.long,
                        };
                    });
                }
                if (file) {
                    const { createReadStream, filename } = await file;
                    const fileStream = createReadStream();
                    const fileInfo = await uploadS3({ fileStream, filename });
                    updateItem = Object.assign(updateItem, { imageUrl: fileInfo.Location });
                }

                const userPk = { partitionKey: driver.userId, sortKey: '#driver' };
                const { success, message, code } = await updateRouteInfoDetail({
                    primaryKey: { partitionKey, sortKey: '#info' },
                    updateItem,
                    detailList,
                    userPk,
                });

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
