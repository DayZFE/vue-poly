# vue-injection-helper

> help you deal with injection problem

## getMockInstance

```Typescript
const mock = getMockInstance(SomeComposable)
function AnotherComposable(value: typeof mock){
    // ...
}

const value = SomeComposable()
AnotherComposable(value)
```

Generate a mocked instance of Composable (you can call it composition function or just service)
so that it can be very simple to use with Typescript

## getInjectionToken

```Typescript
const token = getInjectionToken(SomeComposable)
const token = getInjectionToken(SomeComposable,'name')
```

Make it easy to get injection token, with certain type support

## hideProvider

```Typescript
setup(){
    const composition = inject(token, defulatValue)
    hideProvider(token)
}
```

Hide the provider value, so the subtree of current components will not get undefined

## OptionalInjectionModule

```Typescript
setup(){
    const localvalue = {
        test: ref('')
    }
    const value = OptionalInjectionModule(localvalue,token)
}
```

If injection exists, use injected value, otherwise, use the local value
use it to declare a module, control this module from outside

## Aggregation

```Typescript
// you have a Composable
function SomeComposable(){
    return {
        test: ref({
            param:{
                param:{
                    param:['']
                }
            }
        })
    }
}
const token = getInjectionToken(SomeComposable)
// provide it in upper layer components
setup(){
    const service = SomeComposable()
    provide(token,service)
}

// just use part of it with injection
setup(){
    // just use it
    const value = Aggregation(token,['test','value','param','0'],'')
    // it will return a string ref valued '' if provider not founded


    /* readonly, usually when you just use a function, or you will not change in current child component tree */
    const leaveParam = Aggregation(token, ['test','value','param','0'],true )
    // leaveParam.value = xxx will trigger a warn
}
```

use it within a module

With such tools accelerating your development ——

HaveFun!
