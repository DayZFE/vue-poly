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

## poly disabled

```Typescript
setup(){
     const poly = definePoly({
        id: "some id",
        disabled: true,
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

## poly status

```Typescript
setup(){
  const poly = definePoly({
    name: ref('')
  })
  watch(poly.polyStatus, res=>{
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
