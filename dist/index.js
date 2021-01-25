'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils = require('@x-drive/utils');

/**样式连接类型 */
var ConnectType;
(function (ConnectType) {
    /**驼峰 */
    ConnectType[ConnectType["Camel"] = 0] = "Camel";
    ConnectType[ConnectType["Line"] = 1] = "Line";
})(ConnectType || (ConnectType = {}));
/**获取第一个字符 */
var FIRST_CHAR_REGEXP = /^./;
/**
 * 首字大写
 * @param str 待处理字符串
 */
function firstCharToUpperCase(str) {
    if (utils.isString(str)) {
        return str.replace(FIRST_CHAR_REGEXP, function (m) { return m.toUpperCase(); });
    }
    return str;
}
/**默认的连接符 */
var defConnect = {};
defConnect[("" + (ConnectType.Camel))] = "";
defConnect[("" + (ConnectType.Line))] = "-";
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
    if (utils.isObject(conf)) {
        var type = conf.type; if ( type === void 0 ) type = ConnectType.Camel;
        var symbol = conf.symbol;
        if (utils.isString(symbol)) {
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
    if (utils.isUndefined(config)) {
        return "";
    }
    // config 是个数组的直接处理
    if (utils.isArray(config)) {
        return config.map(function (item) {
            if (utils.isString(item)) {
                return item;
            }
            if (utils.isObject(item)) {
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
    var klassPrepend = utils.isBoolean(prependBase) ? prependBase : false;
    // 处理配置
    if (utils.isString(config)) {
        klassBase = config;
    }
    else {
        var base = config.base;
        var connect = config.connect;
        var type = config.type; if ( type === void 0 ) type = defType;
        var prepend = config.prepend; if ( prepend === void 0 ) prepend = false;
        klassLink = connect || (defConnect[type]);
        if (!utils.isUndefined(base)) {
            // @ts-ignore
            klassBase = base;
        }
        if (!utils.isUndefined(type)) {
            klassConnect = type;
        }
        if (utils.isBoolean(prepend)) {
            klassPrepend = prepend;
        }
    }
    // 处理条件
    var classNameConditions;
    if (utils.isUndefined(conditions)) {
        if (utils.isString(config)) {
            classNameConditions = {};
            classNameConditions[("" + config)] = true;
        }
        else {
            classNameConditions = config;
        }
    }
    else {
        classNameConditions = conditions;
    }
    // 生成样式数组
    var classNames = Object.keys(classNameConditions)
        .filter(function (key) { return classNameConditions[key]; })
        .map(function (name) {
        if (klassBase) {
            switch (klassConnect) {
                case ConnectType.Camel:
                    name = "" + klassBase + klassLink + (firstCharToUpperCase(name));
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

exports.config = config;
exports.default = klass;
//# sourceMappingURL=index.js.map
