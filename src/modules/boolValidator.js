const boolValidParameters = function ({ condition, ...args }) {
    let conditionValue, conditionName;

    if (!condition) {
        condition = '';
        conditionValue = {};
        conditionName = {};
    } else {
        [condition, conditionValue, conditionName] = condition;
    }
    const existedParameters = Object.entries({ ...args }).filter((value) => value[1] != undefined);
    for (let [key, value] of existedParameters) {
        condition = condition.concat(` and #${key} = :${key}`);
        let values = {};
        values[':' + key] = value;
        Object.assign(conditionValue, values);

        let names = {};
        names['#' + key] = key;
        Object.assign(conditionName, names);
    }
    if (condition.length === 0) {
        return null;
    }
    return [condition, conditionValue, conditionName];
};
module.exports = boolValidParameters;
