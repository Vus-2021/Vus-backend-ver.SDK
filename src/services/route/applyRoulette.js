const dayjs = require('dayjs');

const applyRoulette = ({ applicants, limitCount }) => {
    let result = { fulfilled: [], reject: [] };
    let first = [];
    let second = [];
    let dueDate = dayjs().subtract(3, 'month');

    if (applicants.count < limitCount) {
        console.log('allPass');
        result.fulfilled = applicants;

        return result;
    }

    applicants = applicants.filter((user) => {
        if (dayjs.duration(dueDate.diff(user.registerDate))['$ms'] <= 0) {
            first.push(user);
        }
        return dayjs.duration(dueDate.diff(user.registerDate))['$ms'] > 0;
    });

    first.sort((a, b) => {
        a = dayjs(a.registerDate);
        b = dayjs(b.registerDate);
        return b - a;
    });

    if (first.length <= limitCount) {
        result.fulfilled = first;
    } else if (first.length > limitCount) {
        result.fulfilled = first.slice(0, limitCount);
        result.reject = [...first.slice(limitCount, first.length), ...applicants];
        return result;
    }

    applicants = applicants.filter((applicant) => {
        if (applicant.previousMonthState === ('notApply' || 'reject')) {
            second.push(applicant);
        }
        return applicant.previousMonthState !== ('notApply' || 'reject');
    });

    const secondLimitCount = limitCount - first.length;
    if (second.length <= secondLimitCount) {
        result.fulfilled = [...result.fulfilled, ...second];
    } else if (first.length > secondLimitCount) {
        result.fulfilled = [...result.fulfilled, ...second.slice(0, secondLimitCount)];
        result.reject = [...second.slice(secondLimitCount, second.length), ...applicants];
        return result;
    }

    /** 세 번째 그룹 */
    const thirdLimitCount = secondLimitCount - second.length;

    for (let i = 0; i < thirdLimitCount; i++) {
        result.fulfilled.push(applicants.shift());
    }
    result.reject = [...result.reject, ...applicants];

    // console.log(
    //     result.fulfilled.map((item) => {
    //         return {
    //             id: item.partitionKey,
    //             //date: item.registerDate,
    //             s: item.previousMonthState,
    //         };
    //     })
    // );
    // console.log(
    //     result.reject.map((item) => {
    //         return {
    //             id: item.partitionKey,
    //             //date: item.registerDate,
    //             s: item.previousMonthState,
    //         };
    //     })
    // );

    return result;
};

module.exports = applyRoulette;
