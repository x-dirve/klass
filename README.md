# Klass

> 类 BEM 规则的样式名生成模块，根据条件生成样式列表

使用方式
```typescript
klass(config: any, conditions?: KlassConditions, prependBase?: boolean)
```

## 参数
- **config** 配置项
- **conditions** 生效条件
- **prependBase** 是否追加基础样式到输出样式的最前方

## 配置项
```typescript
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
```


## 使用例子
```tsx
klass({ "current": true, "act": true }) // current act
klass("comp", { "current": true, "act": true }) // compCurrent compAct
klass("comp", { "current": true, "act": true }, true) // comp compCurrent compAct
klass(["comp", "current", { "act": true, "haha": false }]) // comp current act
klass({ "base": "comp", "prepend": true }, { "current": true, "act": true }) // comp compCurrent compAct
klass({ "base": "comp" }, { "current": true, "act": true }) // compCurrent compAct
klass({ "base": "comp", "type": 1 }, { "current": true, "act": true }) // comp-current comp-act
klass({ "base": "comp", "type": 1, "connect": "__" }, { "current": true, "act": true }) //comp__current comp__act
```

## 修改默认配置
```tsx
config({"type": 1, "symbol": "___"});
// ...
klass({ "base": "comp", "prepend": true }, { "current": true, "act": true }) // comp comp___current comp___act
```