import { provide, inject, customRef } from "vue";
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
 *
 * @export
 * @template P
 * @param {(InjectionKey<unknown> | string)} token
 * @param {string[]} pathProps
 * once used, provider reactive value can be watched
 * but performance will decrease
 * @param {number} [reactiveNodeLayerNum=-1]
 * if this ref is readonly
 * not used Vue readony api, so it can't be verified
 * @param {boolean} [ifReadonly=false]
 * optional local value
 * @param {Ref<P>} [local]
 * @returns
 */
export function InjectionMapping(token, pathProps, reactiveNodeLayerNum = -1, ifReadonly = false, local) {
    const provider = inject(token, undefined);
    return customRef((track, trigger) => {
        return {
            get: () => {
                track();
                if (provider) {
                    return get(provider, pathProps);
                }
                else if (local) {
                    return local.value;
                }
                return undefined;
            },
            set: (newValue) => {
                if (ifReadonly)
                    return;
                if (!provider) {
                    if (local) {
                        local.value = newValue;
                    }
                    else {
                        return;
                    }
                }
                set(provider, [...pathProps], newValue);
                if (reactiveNodeLayerNum < 0)
                    return;
                // annouce the change to ref/reactive
                if (reactiveNodeLayerNum >= pathProps.length - 1 ||
                    reactiveNodeLayerNum < 1) {
                    return;
                }
                const reactiveKey = pathProps[reactiveNodeLayerNum];
                const mountingProps = pathProps.slice(0, reactiveNodeLayerNum);
                const reactivePathProps = pathProps.slice(0, reactiveNodeLayerNum + 1);
                const mountingNode = get(provider, mountingProps);
                const reactiveNode = get(provider, reactivePathProps);
                if (Object.prototype.toString.call(mountingNode) === "[object Object]") {
                    mountingNode[reactiveKey] = { ...reactiveNode };
                }
                else if (Object.prototype.toString.call(mountingNode) === "[object Array]") {
                    mountingNode[reactiveKey] = [...reactiveNode];
                }
                else {
                    mountingNode[reactiveKey] = reactiveNode;
                }
            },
        };
    });
}
export default {
    getMockInstance,
    getInjectionToken,
    hideProvider,
    OptionalInjection,
    InjectionMapping,
};
//# sourceMappingURL=injection-helper.js.map