/**样式连接类型 */
declare enum ConnectType {
    /**驼峰 */
    Camel 
    /**连接符 */
    = 0
    /**连接符 */
    ,
    Line = 1
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
export declare function config(conf: KlassConfigOptions): void;
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
export default function klass(config: any, conditions?: KlassConditions, prependBase?: boolean): any;
export {};
