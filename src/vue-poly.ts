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
import { get, set, PropertyPath } from "lodash";

export type FuncService<T> = (...args: any) => T;
export type ClassService<T> = new (...args: any) => T;
export type AggregationFunc = (...args: any[]) => void;
export type AggregationNode = Ref | AggregationFunc;
export interface Aggregation {
  [key: string]: AggregationNode;
}
export type LinkToken = string | symbol | InjectionKey<any>;
export type QueryPath = PropertyPath;

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
export function cataly<T, P>(service: FuncService<T> | ClassService<T>) {
  return (undefined as unknown) as T;
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
export function definePoly<T>(
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
 * get sticky vlaue of aggregation root
 *
 * @export
 * @template T
 * @param {LinkToken} token
 * @param {QueryPath} queryPath
 * @param {T} defaultValue
 * @returns
 */
export function sticky<T>(
  token: LinkToken,
  queryPath: QueryPath,
  defaultValue: T
) {
  const provideService = inject(token);
  if (!provideService) {
    return defaultValue;
  } else {
    const result = get(provideService, queryPath) as T;
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
export function bondEvent<T extends AggregationFunc>(
  token: LinkToken,
  queryPath: QueryPath,
  showWarn: boolean = false
) {
  const provideService = inject(token);
  if (!provideService) {
    if (showWarn) {
      console.warn("[vue-injection-helper aggregate event] lose link");
    }
    return () => {};
  }
  if (queryPath === undefined || (queryPath as any)?.length <= 0) {
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
 * @export
 * @template T
 * @param {LinkToken} token
 * @param {QueryPath} queryPath
 * @param {T} defaultValue
 * @param {boolean} [showWarn=false]
 * @returns
 */
export function bondRef<T>(
  token: LinkToken,
  queryPath: QueryPath,
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
  if (queryPath === undefined || (queryPath as any).length <= 0) {
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
  cataly,
  sticky,
  bondGet,
  bondSet,
  bondRef,
  bondEvent,
  definePoly,
};
