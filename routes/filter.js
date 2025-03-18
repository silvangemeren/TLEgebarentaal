import Sign from "../Models/Sign.js";

export const getFilteredSigns = async (query, page = 1, limit, shuffle) => {
    try {
        page = parseInt(page);
        limit = parseInt(limit);
        let filter = {};

        if (query.lesson) {
            filter.lesson = parseInt(query.lesson);
        }
        if (query.wordgroup) {
            filter.wordgroupNumber = parseInt(query.wordgroup);
        }

        let signs = await Sign.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .collation({ locale: 'nl', strength: 2 })
            .sort({ lesson: 1, translation: 1 });
        if (shuffle){
            signs = signs.sort(() => Math.random() - 0.5);
        }

        const totalSigns = await Sign.countDocuments(filter);

        return {
            items: signs,
            pagination: {
                currentPage: page,
                currentItems: limit,
                totalPages: Math.ceil(totalSigns / limit),
                totalItems: totalSigns
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};
