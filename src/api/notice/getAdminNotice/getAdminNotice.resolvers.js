const getAdminNotice = require('../../../services/notice/getAdminNotice');
const searchValidator = require('../../../modules/searchValidator');

const resolvers = {
    Query: {
        getAdminNotice: async (_, args) => {
            const { isMatched, notice, name, content, limit } = {
                notice: args.notice,
                name: args.name,
                content: args.content,
                isMatched: args.isMatched || false,
            };
            let condition = searchValidator({ isMatched, notice, name, content });

            try {
                let { success, message, code, data } = await getAdminNotice({
                    sortKey: '#notice',
                    index: 'sk-index',
                    noticeType: 'ADMIN',
                    condition,
                });

                data.forEach((item) => {
                    item.createdAt = item.gsiSortKey.split('#')[2];
                    item.author = item.name;
                });

                if (limit) {
                    data = data.slice(0, limit);
                }

                return { success, message, code, data };
            } catch (error) {
                return { success: false, message: error.message, code: 500 };
            }
        },
    },
};

module.exports = resolvers;
