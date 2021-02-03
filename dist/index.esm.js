/**
 * 数据类型判断
 * @param  subject 待判断的数据
 * @param  type    数据类型名字
 * @return         判断结果
 */
function is(subject, type) {
    return Object.prototype.toString.call(subject).substr(8, type.length).toLowerCase() === type;
}

/**
 * 是否是数组
 * @param  subject 待判断的数据
 */
function isObject(subject) {
    return is(subject, "object");
}

/**
 * 是否 undefined
 * @param  subject 待判断的数据
 */
function isUndefined(subject) {
    return is(subject, "undefined");
}

/**
 * 是否是数组
 * @param  subject 待判断的数据
 */
function isArray(subject) {
    return Array.isArray(subject);
}

/**
 * 是否是字符串
 * @param  subject 待判断的数据
 */
function isString(subject) {
    return is(subject, "string");
}

/**
 * 是否是布尔值
 * @param  subject 待判断的数据
 */
function isBoolean(subject) {
    return is(subject, "boolean");
}

/**样式连接类型 */
var ConnectType;
(function (ConnectType) {
    /**驼峰 */
    ConnectType[ConnectType["Camel"] = 0] = "Camel";
    ConnectType[ConnectType["Line"] = 1] = "Line";
})(ConnectType || (ConnectType = {}));
/**获取第一个字符 */
const FIRST_CHAR_REGEXP = /^./;
/**
 * 首字大写
 * @param str 待处理字符串
 */
function firstCharToUpperCase(str) {
    if (isString(str)) {
        return str.replace(FIRST_CHAR_REGEXP, (m) => m.toUpperCase());
    }
    return str;
}
/**默认的连接符 */
var defConnect = {
    [`${ConnectType.Camel}`]: "",
    [`${ConnectType.Line}`]: "-"
};
/**默认类型 */
var defType = ConnectType.Camel;
/**
 * 配置模块默认数据
 * @param conf 配置对象
 * @example
 * ```tsx
 * config({"type": 1, "symbol": "___"});
 * // ...
 * klass({ "base": "comp", "prepend": true }, { "current": true, "act": true }) // comp comp___current comp___act
 * ```
 */
function config(conf) {
    if (isObject(conf)) {
        const { type = ConnectType.Camel, symbol } = conf;
        if (isString(symbol)) {
            // @ts-ignore
            defConnect[type] = symbol;
        }
        if (defType !== type) {
            defType = type;
        }
    }
}
/**
 * 根据条件生成样式列表
 * @param config      配置项
 * @param conditions  生效条件
 * @param prependBase 是否追加基础样式到输出样式的最前方
 * @example
 * ```tsx
 * klass({ "current": true, "act": true }) // current act
 * klass("comp", { "current": true, "act": true }) // compCurrent compAct
 * klass("comp", { "current": true, "act": true }, true) // comp compCurrent compAct
 * klass(["comp", "current", { "act": true, "haha": false }]) // comp current act
 * klass({ "base": "comp", "prepend": true }, { "current": true, "act": true }) // comp compCurrent compAct
 * klass({ "base": "comp" }, { "current": true, "act": true }) // compCurrent compAct
 * klass({ "base": "comp", "type": 1 }, { "current": true, "act": true }) // comp-current comp-act
 * klass({ "base": "comp", "type": 1, "connect": "__" }, { "current": true, "act": true }) //comp__current comp__act
 * ```
 */
function klass(config, conditions, prependBase) {
    if (isUndefined(config)) {
        return "";
    }
    // config 是个数组的直接处理
    if (isArray(config)) {
        return config.map(item => {
            if (isString(item)) {
                return item;
            }
            if (isObject(item)) {
                return klass(item);
            }
            return "";
        }).join(" ");
    }
    // 基础样式
    var klassBase = "";
    // 连接符
    var klassLink = "";
    // 拼接类型
    var klassConnect = defType;
    // 是否追加基础样式
    var klassPrepend = isBoolean(prependBase) ? prependBase : false;
    // 处理配置
    if (isString(config)) {
        klassBase = config;
    }
    else {
        const { base, connect, type = defType, prepend = false } = config;
        klassLink = connect || (defConnect[type]);
        if (!isUndefined(base)) {
            // @ts-ignore
            klassBase = base;
        }
        if (!isUndefined(type)) {
            klassConnect = type;
        }
        if (isBoolean(prepend)) {
            klassPrepend = prepend;
        }
    }
    // 处理条件
    var classNameConditions;
    if (isUndefined(conditions)) {
        if (isString(config)) {
            classNameConditions = {
                [`${config}`]: true
            };
        }
        else {
            classNameConditions = config;
        }
    }
    else {
        classNameConditions = conditions;
    }
    // 生成样式数组
    const classNames = Object.keys(classNameConditions)
        .filter(key => classNameConditions[key])
        .map(name => {
        if (klassBase) {
            switch (klassConnect) {
                case ConnectType.Camel:
                    name = `${klassBase}${klassLink}${firstCharToUpperCase(name)}`;
                    break;
                case ConnectType.Line:
                    name = [klassBase, name].join(klassLink);
                    break;
            }
        }
        return name;
    });
    // 是否追加
    if (klassPrepend && klassBase) {
        classNames.unshift(klassBase);
    }
    return classNames.join(" ");
}

export default klass;
export { config };
//# sourceMappingURL=index.esm.js.map
