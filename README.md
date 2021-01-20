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

## Domain

```Typescript
setup(){
    const defaultService = SomeService()
    const domain = Domain('out-of-module-token', 'inner-token', defaultService)
}
```

Generate a Domain

Means that you set up a module

## Subdomain

```Typescript
// you have a Composable
function SomeService(){
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
const serviceToken = getInjectionToken(SomeService)
// provide it in upper layer components
setup(){
    const service = SomeService()
    provide(token,service)
}

// just use part of it
setup(){
    const service = inject(serviceToken,undefined)
    // declare part of service
    // use type assignment boldly!
    // subdomain will handle the undefined type key
    // eq: name,password
    const aggregation = {
        // always use computed to get value
        name: compunted(()=>service?.model?.value?.test as number)
        password: computed(()=>get(service, ['test','value']) as string)
    }
    const defualtService={
        name:ref(1)
        password:ref('')
    }
    // set up a Subdomain
    const subdomain = Subdomain('subdomain-token',defaultService,aggregation)
}
```

use it within a module

With such tools accelerating your development ——

HaveFun!
