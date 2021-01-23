# vue-injection-helper

> help you deal with injection problem

## getMockInstance

```Typescript
const mock = getMockInstance(SomeService)
function AnotherService(value: typeof mock){
    // ...
}

const value = SomeService()
AnotherService(value)
```

Generate a mocked instance of Service (you can call it composition function or just service)
so that it would be very simple to use with Typescript

## getInjectionToken

```Typescript
const token = getInjectionToken(SomeService)
const token = getInjectionToken(SomeService,'name')
```

Make it easy to get injection token, with certain type support

## hideProvider

```Typescript
setup(){
    const service = inject(token, defulatValue)
    hideProvider(token)
}
```

Hide the provider service, so the subtree of current components will not get undefined

## defineModule

```Typescript
setup(){
    const defaultService = SomeService()
    const {innerContext:moduleContext, token] = defineModule(defaultService,'inner-token')
    const [innerContext:moduleContextOutOfModule, token:contextTokenInModule] = defineModule(defaultService,'inner-token','outer-token')
```

Generate a Module, with inner or outside context

Return the context service and the inner token

Set up a module

Isolating the attention

## aggregateEvent & aggregateRef

```Typescript
setup(){
    const aggregation = {
        // aggregateEvent will get the function for boardcast
        // you shoud assing the type of it
        change: aggregateEvent<()=>void>('service-in-module-token',['change'])
        // ref agent part of the service
        model: aggregateRef('service-in-module-token',['model','value','name'],"")
    }
    // you can also set up a new module with it
    const subModule = defineModule(aggregation,'sub-context-token')
}
```

use it within a module

## why vue-injection-helper is better

```Typescript
// if you use vuex
const service = {
    state:{
        name:'',
        password:'',
    },
    mutations:{
        changeName(){},
        changePassword(){}
    }
}
// when you want to add some logic
const service = {
    state:{
        name:'',
        password:'',
        newState:''
    },
    mutations:{
        changeName(){},
        changePassword(){},
        changeNewState(){}
    }
}
// you need to handle two different zone of service
// and type definition is too hard to management

// when you use vue-injection-helper
const aggregation = {
    name: aggregate("service-token",['model','value','name'],'')
    password:aggregate("service-token",['model','value','password'],'')
    newState: ref('')
}
// if this logic is not part of upper service
// you can just define a ref here

// meanwhile
// you can just annouce a aggregation, and link it later
const aggregation = {
    name: aggregate('',[],'')
    password:aggregate('',[],'')
}
// or just use ref instead
const aggregation = {
    name:ref('')
    password:ref('')
}

```

With such tools accelerating your development ——

HaveFun!
