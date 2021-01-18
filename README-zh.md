# vue-injection-helper

> 帮助你解决依赖注入问题

## getMockInstance

```Typescript
const mock = getMockInstance(SomeComposable)
function AnotherComposable(value: typeof mock){
    // ...
}

const value = SomeComposable()
AnotherComposable(value)
```

生成 Composable 的模拟实例（你可以称它为 composable （可组合的）函数，也可以称它为 service 服务）。

以使它可以非常简单地与 Typescript 一起使用。

## getInjectionToken

```Typescript
const token = getInjectionToken(SomeComposable);
const token = getInjectionToken(SomeComposable, "name");
```

在支持特定类型的情况下，使获取注入令牌变得非常容易。

## hideProvider

```Typescript
setup(){
    const composition = inject(token, defaultValue)
    hideProvider(token)
}
```

隐藏提供者的值，这样该组件的子组件就不会拿到这个 token 对应的服务。

## OptionalInjection

```Typescript
setup(){
    const localValue = {
        test: ref('')
    }
    const value = OptionalInjection(localValue,token)
}
```

如果存在注入，则使用注入值，否则使用本地值。

## InjectionMapping

```Typescript
// 你有一个 Composable 组合函数或者叫 Service 服务
function SomeComposable() {
  return {
    test: ref({
      param: {
        param: {
          param: [""],
        },
      },
    }),
  };
}

const token = getInjectionToken(SomeComposable);

// 在上层组件中提供它
setup(){
    const service = SomeComposable()
    provide(token,service)
}

// 在下层组件注入其中的一部分
setup(){
    // 就像这样 -> 数组路径转属性访问路径：test.value.param.param.param[0]
    const leaveParam = InjectionMapping(token, [
      "test",
      "value",
      "param",
      "param",
      "param",
      "0",
    ]);

    /*
     * 给提供服务的节点设置响应式
     * 意味着你可以在上层组件中使用 watch api 进行监听
     * 通过传递路径 props 的数组键，其中的 ref 值，或者在第一层 reactive 中设置 -1 来关闭上层响应式
     */
    const leaveParam = InjectionMapping(
      token,
      ["test", "value", "param", "param", "param", "0"],
      1
    );

    /* readonly，通常是当你只是使用一个函数时，或者你不会在当前的子组件树中更改 */
    const leaveParam = InjectionMapping(
      token,
      ["test", "value", "param", "param", "param", "0"],
      -1,
      true
    );

    /* 本地可选 */
    const local = ref("");
    const leaveParam = InjectionMapping(
      token,
      ["test", "value", "param", "param", "param", "0"],
      -1,
      false,
      local
    );
}
```

有了这样的工具，将提供你的开发效率。

玩得开心点，朋友~
