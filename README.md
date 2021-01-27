# vue-poly

> ⚗️⚗️⚗️🧪🧪🧪 let's do Chemistry with vue

> Only support Vue3+

## definePoly

```Typescript
setup(outerToken: string){
    const poly = definePoly({
        id: "some id",
        name:ref(''),
        password:ref(''),
        someEvent:()=>{
            console.log(`let's do Chemistry!!!`)
        },
        staticValue: "this is sticky, aka static value"
    })
    return poly
```

Define a poly —— bunch of ref , event, sticky value that can be used by other composition

We sincerely recommend to use string instead of Symbol —— with poly you don't have to handle collision problem

So the id will be the InjectionToken

## bond

```Typescript
setup(){
    // just part of a poly
    // get by the poly id
    // use default value if poly not existed
    const polyPartial = {
      name:bond('some id',['name','value'],ref('')),
      password:bond('some id',['password','value'],ref('')),
      someEvent:bond('some id','someEvent',()=>{}),
      staticValue: bond('some id','staticValue','')
    }
    // change ref will take effect on poly
    polyPartial.name.value = "new name"
    // in upper example, poly.name.value will be "new name"

    // you can create a new poly by it
    const newPoly = definePoly({id:"new id",...polyPartial})
}
```

Get part of poly data

When poly not found, or cannot get value from suck path, use default value instead

## poly frozen

```Typescript
setup(){
    const poly = definePoly({
        id: "some id",
        name:ref(''),
        password:ref('')
    })
    poly.polyStatus.forzen = true
}
// now you cannot set value of ref in other poly partial
setup(){
    const polyPartial = {
      name:bond('some id',['name','value'],ref('')),
      password:bond('some id',['password','value'],ref(''))
    }
    // this setting will not take effect
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
        name:ref(''),
        password:ref('')
    })
    // other poly config will not be used
    // use poly defined in parent component
    // with same id
}
```

## boundGet,boundSet

same as lodash.get & lodash.set

## watch poly status

```Typescript
setup(){
  const poly = definePoly({
    name: ref('')
  })
  watchPoly(poly, res=>{
      console.log(res.bondList)
      // [{queryPath:['name','value'],type:"ref"}]
  })
}
```

You can get the bonding feedback of polyPartial in child components

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
    // handle poly
}

polyComposer(some())
```

## Domain-Driven-Design

If you know DDD

You'll get that poly is aggregation, static is value object, ref is actor, event is domain event

DDD is far more better than state management, remember that~

Have fun!

# 中文

## definePoly （声明聚合物）

```Typescript
setup(outerToken: string){
    const token = "inner-token"
    const poly = {
        name:ref(''),
        password:ref(''),
        someEvent:()=>{
            console.log(`一起来玩化学吧!!!`)
        },
        stickValue: "这被称作附着物，也就是静态值"
    }
    definePoly(poly,token,outerToken)
```

声明一个 poly —— 由一些 ref，event（function），附着物 组成，可以被其他组合函数（类）使用

我们真诚推荐大家使用字符串而不是 Symbol，因为有了 poly 这个结构，你不需要处理可能的变量碰撞

当提供 outerToken，也就是外部 token 时，我们将使用外部的 poly

## sticky 附着物

```Typescript
setup(){
    const stickValue = sticky('poly-token','stickyValue','default value')
    const stickValue = sticky('poly-token',['stickyValue'],'default value')
}
```

获取聚合物的附着物，同样，如果声明默认值，则在获取不到上文 poly 的情况下采用默认值

## boundRef （ref 化学键）

```Typescript
setup(){
    const name = boundRef('poly-token',['name','value'],'default value')
    watch(()=>{
        if(name.value===''){
            name.value = 'default value'
        }
    })
}
```

获取 poly 的一部分，无论键通道的深度，还是它是否是个 ref，都将以 ref 的格式给到您，并且能响应视图

以便您在 watch/watchEffect/computed 中处理

## boundEvent （事件 化学键）

```Typescript
setup(){
    const someEvent = boundEvent('poly-token','someEvent')
    someEvent()
}
```

获取 poly 的一部分函数作为事件触发器，并不需要提供默认值，未连接上时，将采用空函数()=>{}

## boundGet,boundSet (代理 化学键)

行为与 lodash 的 get，set 相同

## 确定连接状态

```Typescript
setup(){
  const token = "inner-token"
  const poly = {
      name:ref(''),
      password:ref(''),
      someEvent:()=>{
          console.log(`let's do Chemistry!!!`)
      },
      stickValue: "this is sticky, aka static value"
  }
  const status = definePoly(poly,token,outerToken)
  watch(status,res=>{
    // this ref bounded count
    console.log(res.ref)
    // this ref bounded list of ref queryPath
    console.log(res.refList)
    // this event bounded count
    console.log(res.event)
    // queryPath of event
    console.log(res.ref)
    // this value bounded count
    console.log(res.value)
    // queryPath of value
    console.log(res.valueList)
    // if sub ref change frozened (can only modify root ref by events)
    console.log(res.frozenSub)
  })

  // change modify mode
  status.value.frozenSub = true
}
```

控制与之相连的 poly 是否能够有权限修改它，以及获得连接的反馈数据

## example

```Typescript
// composition functions

function FormComtrol(token: string){
  const touched = ref<boolean>(false);
  const focusedKeyList = ref<string[]>([]);
  const valid = ref<boolean>(false);
  const disabled = ref<boolean>(false);
  const errorList = ref<FieldErrorList>({});
  const validator = computed(() => new Schema(rules ? rules.value : {}));
  const touch = () => {
    touched.value = true;
  };
  const validate = () => {
    return new Promise((res) => {
      validator.value.validate(model.value, {}, (errors, fileds) => {
        if (errors) {
          errorList.value = fileds;
          valid.value = false;
        } else {
          valid.value = true;
          (res as any)();
        }
      });
    });
  };
  const focused = computed(() => focusedKeyList.value.length > 0);
  const poly = {
    model,
    rules,
    touched,
    focused,
    focusedKeyList,
    valid,
    disabled,
    errorList,
    validator,
    touch,
    validate,
  };
  definePoly(poly, "form-token", token);
  return poly;
}

function InputControl(defaultValue?: any, token?: string) {
  const usedToken = token || "form-control";
  const keyList = sticky("form-item-control", "keyList",[])
  const newPoly = {
    model: boundRef(
      usedToken,
      ["model", "value", ...keyList],
      undefined as any
    ),
    errors: boundRef(usedToken, ["errorList", "value", ...keyList], []),
    disabled: boundRef(usedToken, ["disabled", "value"], false),
    touched: boundRef(usedToken, ["touched", "value"], false),
    touch: boundEvent(usedToken, ["touch"]),
    focusedKeyList: boundRef(
      usedToken,
      ["focusedKeyList", "value"],
      [] as string[]
    ),
  };
  // default value is superior than all
  if (defaultValue !== undefined) {
    newPoly.model.value = defaultValue;
  }
  // independent focused
  const focused = ref(false);
  // focus when touch and set focusedKey
  const focus = () => {
    focused.value = true;
    newPoly.touch();
    const value = keyList.join("-");
    const exist = newPoly.focusedKeyList.value.find((el) => el === value);
    if (!exist) newPoly.focusedKeyList.value.push(value);
  };

  const blur = () => {
    focused.value = false;
    newPoly.focusedKeyList.value = newPoly.focusedKeyList.value.filter(
      (el) => el !== keyList.join("-")
    );
  };
  // link a new poly?
  // definePoly(newPoly, 'input-control')
  return { ...newPoly, focused, focus, blur };
}

```

之后您便能完全脱离组件进行开发

当然，别忘了配合相关的测试工具（正在开发中），脱离组件后，测试变得非常重要

## 领域驱动设计

如果您了解领域驱动设计

您就会明白，poly 是个聚合，附着物其实是值对象，ref 是 actor 模型，event 其实是领域事件

请记住！领域驱动远比“状态管理模式”高效的多！

用得开心!
