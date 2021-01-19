import { InjectionKey, provide, inject, customRef, Ref, ref, isRef } from "vue";
import get from "lodash.get";
import set from "lodash.set";

type FuncService<T> = (...args: any) => T;
type ClassService<T> = new (...args: any) => T;

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
 * @param {boolean} [debug=false]
 * @returns
 */
export function OptionalInjectionModule<T>(
  local: T,
  token: InjectionKey<T> | string,
  debug: boolean = false
) {
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
export function Aggregation<P>(
  token: InjectionKey<unknown> | string,
  pathProps: string[],
  defaultValue: P,
  ifReadonly: boolean = false
) {
  const provider = inject(token, undefined);
  let local: Ref<P>;
  if (isRef(defaultValue)) {
    local = defaultValue as Ref<P>;
  } else {
    local = ref<P>(defaultValue) as Ref<P>;
  }
  let moduleToken: string | undefined;
  if (isDev) {
    const moduleToken = inject<string | undefined>(
      "vue-injection-helper",
      undefined
    );
    if (!moduleToken) {
      console.warn(
        "[vue-injection-helper]cannot setup a relation with module token"
      );
    }
  }
  return customRef<P>((track) => {
    return {
      get: () => {
        track();
        if (provider === undefined) {
          if (isDev && moduleToken) {
            console.warn("[vue-injection-helper]undefined provider");
          }
          return local.value;
        }
        if (pathProps.length <= 0) {
          return provider as P;
        }
        const providerPathValue = get(provider, pathProps);
        if (providerPathValue === undefined) {
          if (isDev && moduleToken) {
            console.warn("[vue-injection-helper]undefined provider path value");
          }
          return local.value;
        }
        return providerPathValue;
      },
      set: (newValue: any) => {
        if (ifReadonly || pathProps.length <= 0) {
          // console.warn("cannot set a readonly aggregation ref");
          return;
        }
        if (!provider) {
          local.value = newValue as P;
          return;
        }
        set(provider as any, [...pathProps], newValue);
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
