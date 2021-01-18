import { InjectionKey, provide, inject, customRef, Ref } from "vue";
import get from "lodash.get";
import set from "lodash.set";

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
export function getMockInstance<T>(_service: FuncService<T> | ClassService<T>) {
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
  _service: FuncService<T> | ClassService<T>,
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
  // return inject(token, undefined) ?? local;

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
 * @param {number} [reactiveNodeLayerNum=-1] once used, provider reactive value can be watched but performance will decrease
 * @param {boolean} [isReadonly=false] if this ref is readonly not used Vue readonly api, so it can't be verified
 * @param {Ref<P>} [local] optional local value
 * @returns
 */
export function InjectionMapping<P>(
  token: InjectionKey<unknown> | string,
  pathProps: string[],
  reactiveNodeLayerNum: number = -1,
  isReadonly: boolean = false,
  local?: Ref<P>
) {
  const provider = inject(token, undefined);

  return customRef<P | undefined>((track: any, trigger: any) => {
    return {
      get: () => {
        track();
        if (provider) {
          return get(provider, pathProps) as P;
        } else if (local) {
          return local.value;
        }
        return undefined;
      },
      set: (newValue: any) => {
        if (isReadonly) return;
        if (!provider) {
          if (local) {
            local.value = newValue as P;
          } else {
            return;
          }
        }

        set(provider as any, [...pathProps], newValue);
        if (reactiveNodeLayerNum < 0) return;
        // announce the change to ref/reactive
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

        // 将新值赋给旧值 - 路径直接覆盖 - 从而触发监听
        if (
          Object.prototype.toString.call(mountingNode) === "[object Object]"
        ) {
          mountingNode[reactiveKey] = { ...reactiveNode };
        } else if (
          Object.prototype.toString.call(mountingNode) === "[object Array]"
        ) {
          mountingNode[reactiveKey] = [...reactiveNode];
        } else {
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
