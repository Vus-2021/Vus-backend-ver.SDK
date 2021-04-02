const getAdminNotice = require('../../../services/notice/getAdminNotice');
const searchValidator = require('../../../modules/searchValidator');

const resolvers = {
    Query: {
        getAdminNotice: async (_, args) => {
            const { isMatched, notice, name, content } = {
                notice: args.notice,
                name: args.name,
                content: args.content,
                isMatched: args.isMatched || false,
            };
            let condition = searchValidator({ isMatched, notice, name, content });

            try {
                const { success, message, code, data } = await getAdminNotice({
                    sortKey: '#notice',
                    index: 'sk-index',
                    noticeType: 'ADMIN',
                    condition,
                });

                data.forEach((item) => {
                    item.createdAt = item.gsiSortKey.split('#')[2];
                    item.author = item.name;
                });

                return { success, message, code, data };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
