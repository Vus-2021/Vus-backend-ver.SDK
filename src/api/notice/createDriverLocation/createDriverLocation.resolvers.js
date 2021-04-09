const createDriverLocation = require('../../../services/route/createDriverLocation');
const dateNow = require('../../../modules/dateNow');

const resolvers = {
    Mutation: {
        createDriverLocation: async (parent, args) => {
            const { preKey, destinationKey, locationIndex } = args.input;

            const updatedAt = dateNow();
            try {
                const { success, message, code } = await createDriverLocation({
                    preKey,
                    destinationKey,
                    updatedAt,
                    locationIndex,
                });
                return { success, message, code };
            } catch (error) {
                return { success: false, message: 'asda', code: 500 };
            }
        },
    },
};

module.exports = resolvers;
