import {
  InjectionKey,
  provide,
  inject,
  customRef,
  Ref,
  ref,
  isProxy,
} from "vue";
import { get, set, PropertyPath } from "lodash";

export type FuncFormula<T> = (...args: any) => T;
export type ClassFormula<T> = new (...args: any) => T;
export type AggregationFunc = (...args: any[]) => void;
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
 * @param {(FuncFormula<T> | ClassFormula<T>)} formula
 * @returns
 */
export function cataly<T, P>(formula: FuncFormula<T> | ClassFormula<T>) {
  return (undefined as unknown) as T;
}

/**
 * define a domain module
 *
 * @export
 * @template T
 * @param {T} poly
 * @param {LinkToken} token
 * @param {LinkToken} [outSourceToken]
 * @return {*}
 */
export function definePoly<T extends { [key: string]: any }>(
  poly: T,
  token: LinkToken,
  outSourceToken?: LinkToken
) {
  let polyValue = poly;
  if (outSourceToken) {
    const result = inject(outSourceToken);
    if (result === undefined) {
      console.warn("[vue-poly]lose bound to outerSource");
    } else {
      polyValue = result;
    }
  }
  const __boundStatus = ref({
    event: 0,
    value: 0,
    ref: 0,
    eventList: [] as QueryPath[],
    valueList: [] as QueryPath[],
    refList: [] as QueryPath[],
    frozenSub: false,
  });

  provide(token, { ...polyValue, __boundStatus });
  return __boundStatus;
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
  const provideFormula = inject(token);
  if (!provideFormula) {
    return defaultValue;
  } else {
    const result = get(provideFormula, queryPath) as T;
    if (result === undefined) {
      return defaultValue;
    }
    provideFormula.__boundStatus.value.value++;
    provideFormula.__boundStatus.value.valueList.push(queryPath);
    return result;
  }
}

/**
 * get aggregated domain event
 *
 * @export
 * @template T
 * @param {LinkToken} token
 * @param {QueryPath} queryPath
 * @returns
 */
export function bondEvent<T extends AggregationFunc>(
  token: LinkToken,
  queryPath: QueryPath
) {
  const provideFormula = inject(token);
  if (!provideFormula) {
    return () => {};
  }
  if (queryPath === undefined || (queryPath as any)?.length <= 0) {
    return () => {};
  }
  const result = get(provideFormula, queryPath);
  if (
    result === undefined ||
    Object.prototype.toString.call(result) !== "[object Function]"
  ) {
    return () => {};
  }
  provideFormula.__boundStatus.value.event++;
  provideFormula.__boundStatus.value.eventList.push(queryPath);
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
 * @returns
 */
export function bondRef<T>(
  token: LinkToken,
  queryPath: QueryPath,
  defaultValue: T
) {
  if (isProxy(defaultValue)) {
    throw new Error("[vue-poly ref] defaultValue cannot be proxy");
  }
  const provideFormula = inject(token);
  const localRef = ref(defaultValue) as Ref<T>;
  if (!provideFormula) {
    return localRef;
  }
  const firstGet = get(provideFormula, queryPath);
  if (firstGet === undefined) {
    return localRef;
  }
  provideFormula.__boundStatus.value.ref++;
  provideFormula.__boundStatus.value.refList.push(queryPath);
  return customRef<T>((track: any) => {
    return {
      get: () => {
        track();
        return get(provideFormula, queryPath);
      },
      set: (newValue) => {
        // when frozen, do not set
        if (provideFormula.__boundStatus.value.frozenSub) {
          return;
        }
        set(provideFormula, queryPath, newValue);
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
