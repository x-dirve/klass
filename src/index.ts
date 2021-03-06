import { isArray, isBoolean, isObject, isString, isUndefined } from "@x-drive/utils";

/**样式连接类型 */
enum ConnectType {
    /**驼峰 */
    Camel
    /**连接符 */
    , Line
}

/**配置项 */
interface KlassConfig {
    /**基础样式名 */
    base?: string;

    /**连接类型 */
    type?: ConnectType;

    /**连接符 */
    connect?: string;

    /**是否追加 */
    prepend?: boolean;
}

/**样式生效条件 */
interface KlassConditions {
    [key: string]: boolean;
}

/**配置方法参数 */
interface KlassConfigOptions {
    /**连接方式 */
    type?: ConnectType;

    /**连接符号 */
    symbol?: string;
}

/**获取第一个字符 */
const FIRST_CHAR_REGEXP = /^./;

/**
 * 首字大写
 * @param str 待处理字符串
 */
function firstCharToUpperCase(str: string) {
    if (isString(str)) {
        return str.replace(FIRST_CHAR_REGEXP, (m: string) => m.toUpperCase());
    }
    return str;
}

/**默认的连接符 */
var defConnect = {
    [`${ConnectType.Camel}`]: ""
    , [`${ConnectType.Line}`]: "-"
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
export function config(conf: KlassConfigOptions) {
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
export default function klass(config: any, conditions?: KlassConditions, prependBase?: boolean) {
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
    } else {
        const { base, connect, type = defType, prepend = false } = config as KlassConfig;
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
        } else {
            classNameConditions = config;
        }
    } else {
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