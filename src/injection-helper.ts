import { InjectionKey, provide, inject, computed, customRef } from "vue";
import { get, set } from "lodash-es";

type FuncService<T> = (...args: any) => T;
type ClassService<T> = new (...args: any) => T;

/**
 * mock instance of useFunc
 *
 * @export
 * @template T
 * @param {(FuncService<T> | ClassService<T>)} service
 * @returns
 */
// @ts-ignore
export function getMockInstance<T>(service: FuncService<T> | ClassService<T>) {
  return (undefined as unknown) as T;
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
export function getInjectionToken<T>(
  service: FuncService<T> | ClassService<T>,
  tokenName?: string | symbol
) {
  const token = tokenName || Symbol();
  return token as InjectionKey<T>;
}

/**
 * hide suck provider
 *
 * @export
 * @template T
 * @param {(InjectionKey<T> | string)} injectionToken
 */
export function hideProvider<T>(injectionToken: InjectionKey<T> | string) {
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
export function OptionalInjection<T>(
  local: T,
  token: InjectionKey<T> | string
) {
  const provider = inject(token, undefined);
  if (!provider) {
    return local;
  }
  return provider;
}

/**
 * get provider's mapped ref
 *
 * @export
 * @template P
 * @param {(InjectionKey<unknown> | string)} token
 * @param {string[]} pathProps
 * @returns
 */
export function InjectionMapped<P>(
  token: InjectionKey<unknown> | string,
  pathProps: string[],
  reactiveNodeLayerNum: number
) {
  const provider = inject(token, undefined);
  const value = computed(() => {
    if (provider) {
      const providerRef = get(provider, pathProps);
      return providerRef;
    }
    return (undefined as unknown) as P;
  });
  const setValue = (val: P) => {
    if (provider) {
      const providerRef = get(provider, pathProps);
      // change value
      set(provider as any, [...pathProps], val);
      // announce change
      if (
        reactiveNodeLayerNum >= pathProps.length - 1 ||
        reactiveNodeLayerNum < 1
      ) {
        return;
      }
      const reactiveKey = pathProps[reactiveNodeLayerNum];
      const mountingProps = pathProps.slice(0, reactiveNodeLayerNum);
      const reactivePathProps = pathProps.slice(0, reactiveNodeLayerNum + 1);
      const mountingNode = get(provider, mountingProps);
      const reactiveNode = get(provider, reactivePathProps);
      if (Object.prototype.toString.call(mountingNode) === "[object Object]") {
        mountingNode[reactiveKey] = { ...reactiveNode };
      } else if (
        Object.prototype.toString.call(mountingNode) === "[object Array]"
      ) {
        mountingNode[reactiveKey] = [...reactiveNode];
      } else {
        mountingNode[reactiveKey] = reactiveNode;
      }
    }
  };
  return customRef<P>((track: any, trigger: any) => {
    return {
      get: () => {
        track();
        if (provider) {
        }
        return value.value as P;
      },
      set: (newValue) => {
        setValue(newValue as P);
      },
    };
  });
}
