import { provide, inject, customRef, ref, isRef, } from "vue";
import get from "lodash.get";
import set from "lodash.set";
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
 * @returns
 */
export function OptionalInjection(local, token) {
    const provider = inject(token, undefined);
    if (!provider) {
        return local;
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
    return customRef((track, trigger) => {
        return {
            get: () => {
                track();
                if (provider) {
                    if (pathProps.length <= 0) {
                        return provider;
                    }
                    return get(provider, pathProps);
                }
                else if (local) {
                    return local.value;
                }
                throw new Error("cannot init a aggregation ref");
            },
            set: (newValue) => {
                if (ifReadonly || pathProps.length <= 0) {
                    // console.warn("cannot set a readonly aggregation ref");
                    return;
                }
                if (!provider) {
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
    OptionalInjection,
    Aggregation,
};
//# sourceMappingURL=injection-helper.js.map