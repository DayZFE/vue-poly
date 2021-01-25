import { provide, inject, customRef, ref, isRef, isReactive, } from "vue";
import { get, set } from "lodash";
export const bondGet = get;
export const bondSet = set;
// @ts-ignore
/**
 * get mock instance
 *
 * @export
 * @template T
 * @param {(FuncService<T> | ClassService<T>)} service
 * @returns
 */
export function cataly(service) {
    return undefined;
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
export function definePoly(context, token, outerSource) {
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
 * get sticky vlaue of aggregation root
 *
 * @export
 * @template T
 * @param {LinkToken} token
 * @param {QueryPath} queryPath
 * @param {T} defaultValue
 * @returns
 */
export function sticky(token, queryPath, defaultValue) {
    const provideService = inject(token);
    if (!provideService) {
        return defaultValue;
    }
    else {
        const result = get(provideService, queryPath);
        return result === undefined ? result : defaultValue;
    }
}
/**
 * get aggregated domain event
 *
 * @export
 * @template T
 * @param {LinkToken} token
 * @param {QueryPath} queryPath
 * @param {boolean} [showWarn=false]
 * @returns
 */
export function bondEvent(token, queryPath, showWarn = false) {
    const provideService = inject(token);
    if (!provideService) {
        if (showWarn) {
            console.warn("[vue-injection-helper aggregate event] lose link");
        }
        return () => { };
    }
    if (queryPath === undefined || queryPath?.length <= 0) {
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
 * @export
 * @template T
 * @param {LinkToken} token
 * @param {QueryPath} queryPath
 * @param {T} defaultValue
 * @param {boolean} [showWarn=false]
 * @returns
 */
export function bondRef(token, queryPath, defaultValue, showWarn = false) {
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
    if (queryPath === undefined || queryPath.length <= 0) {
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
    cataly,
    sticky,
    bondGet,
    bondSet,
    bondRef,
    bondEvent,
    definePoly,
};
//# sourceMappingURL=vue-poly.js.map