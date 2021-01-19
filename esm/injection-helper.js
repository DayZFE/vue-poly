import { provide, inject, customRef, ref, isRef } from "vue";
import get from "lodash.get";
import set from "lodash.set";
const isDev = process.env.NODE_ENV !== "production";
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
 * optional injection
 *
 * @export
 * @template T
 * @param {T} local
 * @param {(InjectionKey<T> | string)} token
 * @param {boolean} [debug=false]
 * @returns
 */
export function OptionalInjectionModule(local, token, debug = false) {
    const provider = inject(token, undefined);
    if (!provider) {
        return local;
    }
    if (isDev && debug) {
        // debug injection relationship
        provide("vue-injection-helper", token);
    }
    return provider;
}
/**
 * provider's mapped ref
 * if provider not exist
 * return a local value
 * recommended for all reactive annoucement
 *
 * @export
 * @template P
 * @param {(InjectionKey<unknown> | string)} token
 * @param {string[]} pathProps
 * @param {P} defaultValue
 * @param {boolean} [ifReadonly=false]
 * @returns
 */
export function Aggregation(token, pathProps, defaultValue, ifReadonly = false) {
    const provider = inject(token, undefined);
    let local;
    if (isRef(defaultValue)) {
        local = defaultValue;
    }
    else {
        local = ref(defaultValue);
    }
    let moduleToken;
    if (isDev) {
        const moduleToken = inject("vue-injection-helper", undefined);
        if (!moduleToken) {
            console.warn("[vue-injection-helper]cannot setup a relation with module token");
        }
    }
    return customRef((track) => {
        return {
            get: () => {
                track();
                if (provider === undefined) {
                    return local.value;
                }
                if (pathProps.length <= 0) {
                    return provider;
                }
                const providerPathValue = get(provider, pathProps);
                if (providerPathValue === undefined) {
                    return local.value;
                }
                return providerPathValue;
            },
            set: (newValue) => {
                if (ifReadonly || pathProps.length <= 0) {
                    // console.warn("cannot set a readonly aggregation ref");
                    return;
                }
                if (!provider) {
                    if (isDev && moduleToken) {
                        console.warn("[vue-injection-helper]setting undefined provider");
                    }
                    local.value = newValue;
                    return;
                }
                set(provider, [...pathProps], newValue);
            },
        };
    });
}
export default {
    getMockInstance,
    getInjectionToken,
    hideProvider,
    OptionalInjectionModule,
    Aggregation,
};
//# sourceMappingURL=injection-helper.js.map