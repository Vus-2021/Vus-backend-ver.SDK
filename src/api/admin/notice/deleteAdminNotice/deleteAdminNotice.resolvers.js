const deleteNotice = require('../../../../services/notice/deleteNotice');

const resolvers = {
    Mutation: {
        deleteNotice: async (_, args, { user }) => {
            if (!user || user.type !== 'ADMIN') {
                return { success: false, message: 'access denied', code: 403 };
            }
            const noticeList = args.partitionKey.map((item) => {
                return {
                    partitionKey: item,
                    sortKey: '#notice',
                };
            });
            try {
                const { success, message, code } = await deleteNotice({ noticeList });
                return { success, message, code };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
