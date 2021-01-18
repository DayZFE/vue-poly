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

Hide the provider value, so the subtree of components will not get undefined

## OptionalInjection

```Typescript
setup(){
    const localvalue = {
        test: ref('')
    }
    const value = OptionalInjection(localvalue,token)
}
```

If injection exists, use injection value, otherwise, use the local value

## InjectionMapping

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
    const leaveParam = InjectionMapping(token, ['test','value','param','param','param','0'])
    /*
     * reactive it to provid node
     * that means you can use watch in upper components where you provide it
     * by passing the array key of the path props where the value of ref, or
     * first layer of reactive in
     * set -1 to close reactive to upper
     */
    const leaveParam = InjectionMapping(token, ['test','value','param','param','param','0'],1 )
    /* readonly, usually when you just use a function, or you will not change in current child component tree */
    const leaveParam = InjectionMapping(token, ['test','value','param','param','param','0'],-1,true )
    /* local optional*/
    const local = ref('')
    ['test','value','param','param','param','0'],-1,false,  local)
}
```

With such tools will accelerate your development

HaveFun!
