import { provide, inject, customRef, ref, isRef, isReactive, } from "vue";
import { get, set } from "lodash-es";
/**
 * mock instance of useFunc
 *
 * @export
 * @template T
 * @param {(FuncService<T> | ClassService<T>)} service
 * @returns
 */
// @ts-ignore
export function getMockInstance(service) {
    return undefined;
}
/**
 * generate injection token
 *
 * @export
 * @template T
 * @param {(FuncService<T> | ClassService<T>)} service
 * @param {(string | symbol)} [tokenName]
 * @returns
 */
export function getInjectionToken(service, tokenName) {
    const token = tokenName || Symbol();
    return token;
}
/**
 * hide suck provider
 *
 * @export
 * @template T
 * @param {(InjectionKey<T> | string)} injectionToken
 */
export function hideProvider(injectionToken) {
    provide(injectionToken, undefined);
}
/**
 * define a domain module
 *
 * @export
 * @template T
 * @param {T} context
 * @param {LinkToken} token
 * @param {LinkToken} [outerSource]
 * @returns
 */
export function defineModule(context, token, outerSource) {
    let innerContext = context;
    if (outerSource) {
        const result = inject(outerSource);
        if (result === undefined) {
            console.warn("[vue-injection-helper]lose link to outerSource");
        }
        else {
            innerContext = result;
        }
    }
    provide(token, innerContext);
    return { innerContext, token };
}
/**
 * get aggregated domain event
 *
 * @template T
 * @param {LinkToken} token
 * @param {string[]} queryPath
 * @param {boolean} [showWarn=false]
 * @returns
 */
export function aggregateEvent(token, queryPath, showWarn = false) {
    const provideService = inject(token);
    if (!provideService) {
        if (showWarn) {
            console.warn("[vue-injection-helper aggregate event] lose link");
        }
        return () => { };
    }
    if (queryPath.length <= 0) {
        if (showWarn) {
            console.warn("[vue-injection-helper] queryPath was empty");
        }
        return () => { };
    }
    const result = get(provideService, queryPath);
    if (result === undefined ||
        Object.prototype.toString.call(result) !== "[object Function]") {
        if (showWarn) {
            console.warn("[vue-injection-helper] event func not found");
        }
        return () => { };
    }
    return result;
}
/**
 * get aggregated domain ref state
 *
 * @template T
 * @param {LinkToken} token
 * @param {string[]} queryPath
 * @param {T} defaultValue
 * @param {boolean} [showWarn=false]
 * @returns
 */
export function aggregateRef(token, queryPath, defaultValue, showWarn = false) {
    if (isRef(defaultValue) || isReactive(defaultValue)) {
        throw new Error("[vue-injection-helper aggregate ref] defaultValue cannot be ref or reactive");
    }
    const provideService = inject(token);
    const localRef = ref(defaultValue);
    if (!provideService) {
        if (showWarn) {
            console.warn("[vue-injection-helper aggregate ref] lose link");
        }
        return localRef;
    }
    if (queryPath.length <= 0) {
        if (showWarn) {
            console.warn("[vue-injection-helper aggregate ref] queryPath was empty");
        }
        return localRef;
    }
    return customRef((track, trigger) => {
        return {
            get: () => {
                track();
                const result = get(provideService, queryPath);
                if (result === undefined) {
                    console.warn("[vue-injection-helper aggregate ref] received undefined");
                    return localRef.value;
                }
                return result;
            },
            set: (newValue) => {
                set(provideService, queryPath, newValue);
            },
        };
    });
}
export default {
    getMockInstance,
    getInjectionToken,
    hideProvider,
    defineModule,
    aggregateEvent,
    aggregateRef,
    get,
    set,
};
//# sourceMappingURL=injection-helper.js.map