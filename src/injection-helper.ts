import {
  InjectionKey,
  provide,
  inject,
  customRef,
  Ref,
  ref,
  isRef,
  isReactive,
} from "vue";
import { get, set } from "lodash";

export type FuncService<T> = (...args: any) => T;
export type ClassService<T> = new (...args: any) => T;
export type AggregationFunc = (...args: any[]) => void;
export type AggregationNode = Ref | AggregationFunc;
export interface Aggregation {
  [key: string]: AggregationNode;
}
export type LinkToken = string | symbol | InjectionKey<any>;

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
 * define a domain module
 *
 * @export
 * @template T
 * @param {T} context
 * @param {LinkToken} token
 * @param {LinkToken} [outerSource]
 * @returns
 */
export function defineModule<T>(
  context: T,
  token: LinkToken,
  outerSource?: LinkToken
) {
  let innerContext = context;
  if (outerSource) {
    const result = inject(outerSource);
    if (result === undefined) {
      console.warn("[vue-injection-helper]lose link to outerSource");
    } else {
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
export function aggregateEvent<T extends AggregationFunc>(
  token: LinkToken,
  queryPath: string[],
  showWarn: boolean = false
) {
  const provideService = inject(token);
  if (!provideService) {
    if (showWarn) {
      console.warn("[vue-injection-helper aggregate event] lose link");
    }
    return () => {};
  }
  if (queryPath.length <= 0) {
    if (showWarn) {
      console.warn("[vue-injection-helper] queryPath was empty");
    }
    return () => {};
  }
  const result = get(provideService, queryPath);
  if (
    result === undefined ||
    Object.prototype.toString.call(result) !== "[object Function]"
  ) {
    if (showWarn) {
      console.warn("[vue-injection-helper] event func not found");
    }
    return () => {};
  }
  return result as T;
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
export function aggregateRef<T>(
  token: LinkToken,
  queryPath: string[],
  defaultValue: T,
  showWarn: boolean = false
) {
  if (isRef(defaultValue) || isReactive(defaultValue)) {
    throw new Error(
      "[vue-injection-helper aggregate ref] defaultValue cannot be ref or reactive"
    );
  }
  const provideService = inject(token);
  const localRef = ref(defaultValue) as Ref<T>;
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
  return customRef<T>((track: any, trigger: any) => {
    return {
      get: () => {
        track();
        const result = get(provideService, queryPath);
        if (result === undefined) {
          console.warn(
            "[vue-injection-helper aggregate ref] received undefined"
          );
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
