const isArray = (arr) => {
    return typeof arr === "object" ? true : false;
};

const isNonEmptyArray = (arr) => {
    return typeof arr === "object" && arr.length != 0 ? true : false;
};

const isBoolean = (bool) => {
    return typeof bool === "boolean" ? true : false;
};

const isNumber = (num) => {
    return typeof num === "number" ? true : false;
};

const isObject = (obj) => {
    return typeof obj === "object" ? true : false;
};

const isNonEmptyObject = (obj) => {
    return typeof obj === "object" && Object.keys(obj).length != 0 ? true : false;
};

const hasKeys = (obj, keys) => {
    for (let key of keys) {
        if (!Object.keys(obj).includes(key)) return false;
    }
    return true;
};

const isString = (str) => {
    return typeof str === "string" ? true : false;
};

const isNonEmptyString = (str) => {
    return typeof str === "string" && str.length != 0 ? true : false;
};

const isCorrectLength = (inp, min, max) => {
    return inp.length >= min && inp.length <= min ? true : false;
};

module.exports = {
    isArray,
    isNonEmptyArray,
    isBoolean,
    isNumber,
    isObject,
    isNonEmptyObject,
    hasKeys,
    isString,
    isNonEmptyString,
    isCorrectLength,
};
