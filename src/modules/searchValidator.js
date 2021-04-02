const validParameters = function ({ isMatched, ...args }) {
    let condition = '';
    let conditionValue = {};

    const existedParameters = Object.entries({ ...args }).filter((value) => value[1] != undefined);
    for (let [key, value] of existedParameters) {
        condition =
            isMatched === true
                ? condition.concat(` and ${key} = :${key}`)
                : condition.concat(` and contains(${key}, :${key})`);
        let obj = {};
        obj[':' + key] = value;
        Object.assign(conditionValue, obj);
    }

    if (existedParameters.length === 0) {
        return null;
    }
    return [condition, conditionValue];
};
module.exports = validParameters;
