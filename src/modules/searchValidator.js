const validParameters = function ({ isMatched, ...args }) {
    let condition = '';
    let conditionValue = {};
    let conditionName = {};

    const existedParameters = Object.entries({ ...args }).filter((value) => value[1] != undefined);
    for (let [key, value] of existedParameters) {
        condition =
            isMatched === true
                ? condition.concat(` and #${key} = :${key}`)
                : condition.concat(` and contains(#${key}, :${key})`);
        let values = {};
        values[':' + key] = value;
        Object.assign(conditionValue, values);

        let names = {};
        names['#' + key] = key;
        Object.assign(conditionName, names);
    }

    if (existedParameters.length === 0) {
        return null;
    }
    return [condition, conditionValue, conditionName];
};
module.exports = validParameters;
