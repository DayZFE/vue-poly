# vue-poly

> ⚗️⚗️⚗️🧪🧪🧪 让我们用 Vue 做化学实验

> 只支持 Vue 3+

## definePoly （声明聚合物）

```Typescript
setup(){
  const poly = definePoly({
    id: "some id",
    name: ref(''),
    password: ref(''),
    someEvent: () => {
      console.log(`让我们来玩化学！！！`)
    },
    staticValue: "这是附着物，也就是静态值"
  })

  return poly
}
```

声明一个 poly —— 由一些 ref，event（function），附着物 组成，可以被其他组合函数（类）使用

我们真诚推荐大家使用字符串而不是 Symbol，因为有了 poly 这个结构，你不需要处理可能的变量碰撞

因此，id 将是 InjectionToken （注入令牌）

## bond

```Typescript
setup(){
  // 只不过是其中的一部分
  // 通过 poly 的 id 获得
  // poly 不存在时使用默认值
  const polyPartial = {
    name: bond('some id', ['name', 'value'], ref('')),
    password: bond('some id', ['password', 'value'], ref('')),
    someEvent: bond('some id', 'someEvent', () => {}),
    staticValue: bond('some id', 'staticValue', '')
  }

  // 修改 ref 值将会在 poly 中生效
  polyPartial.name.value = "new name"
  // 在上个例子中，poly.name.value 将变成 "new name"

  // 你可以通过它创建一个新的 poly
  const newPoly = definePoly({ id: "new id", ...polyPartial })
}
```

获取 poly 中的部分数据

当找不到 poly 时，或者无法从查询路径中获取值时，使用默认值代替。

## poly frozen

```Typescript
setup(){
  const poly = definePoly({
    id: "some id",
    name: ref(''),
    password: ref('')
  })

  poly.polyStatus.frozen = true
}

// 现在你不能在其他的 poly 中设置 ref 的值了
setup(){
  const polyPartial = {
    name: bond('some id', ['name', 'value'], ref('')),
    password: bond('some id', ['password', 'value'], ref(''))
  }

  // 这些修改将不会生效
  polyPartial.name.value = "new name"
  polyPartial.password.value = "new password"
}
```

## poly through

```Typescript
setup(){
  const poly = definePoly({
    id: "some id",
    through: true,
    name: ref(''),
    password: ref('')
  })

  // 其他的 poly 配置将不会被使用
  // 使用在父组件中定义的具有相同 id 的 poly
}
```

## boundGet & boundSet

行为与 lodash 的 get & set 相同

## 侦听连接状态

```Typescript
setup(){
  const poly = definePoly({
    name: ref('')
  })

  watchPoly(poly, res => {
    console.log(res.bondList) // [{ queryPath: ['name', 'value'], type: "ref" }]
  })
}
```

你可以在子组件中获得 polyPartial 的链接反馈数据

## poly composer

```Typescript
function some(){
  const poly = definePoly({
    name: ref('')
  })

  return poly
}

const cata = cataly(some)

function polyComposer(poly: typeof cata){
  // 处理 poly
}

polyComposer(some())
```

## 领域驱动设计

如果你了解领域驱动设计

你就会明白，poly 是个聚合，附着物其实是值对象，ref 是 actor 模型，event 其实是领域事件

请记住！领域驱动远比**状态管理模式**高效的多！

玩得愉快!
