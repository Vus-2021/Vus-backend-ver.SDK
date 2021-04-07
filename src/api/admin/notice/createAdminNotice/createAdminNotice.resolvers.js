const createNotice = require('../../../../services/notice/createNotice');
const dateNow = require('../../../../modules/dateNow');
const uuid = require('uuid');

const resolvers = {
    Mutation: {
        createAdminNotice: async (_, { noticeType, notice, content }, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            try {
                const { success, message, code } = await createNotice({
                    partitionKey: uuid.v4(),
                    sortKey: '#notice',
                    gsiSortKey: `#createdAt#${dateNow()}`,
                    updatedAt: dateNow(),
                    noticeType,
                    notice,
                    content,
                    userId: user.userId,
                    name: user.name,
                });

                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
