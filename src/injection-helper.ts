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
 * generate a domain by service's token
 *
 * @export
 * @template T
 * @param {(string | symbol | InjectionKey<any>)} foreignToken
 * @param {(string | symbol | InjectionKey<any>)} innerToken
 * @param {T} defaultService
 * @returns
 */
export function Domain<T>(
  foreignToken: string | symbol | InjectionKey<any>,
  innerToken: string | symbol | InjectionKey<any>,
  defaultService: T
) {
  const injectionService = inject(foreignToken, undefined);
  let service: T = (injectionService as unknown) as T;
  if (injectionService === undefined) {
    console.warn(
      `[vue-injection-heler domain-foreign-token:${foreignToken.toString()}]cannot link the model outside this domain`
    );
    service = defaultService;
  }
  provide(innerToken, service);
  return service;
}

type Callback = (...args: any[]) => void;
type AggregationObj = { [key: string]: Ref | Callback };

/**
 * generate a subdomain by collection
 *
 * @export
 * @template T
 * @param {(string | symbol | InjectionKey<any>)} subDomainToken
 * @param {T} defaultService
 * @param {T} [aggregation]
 * @returns
 */
export function Subdomain<T extends AggregationObj>(
  subDomainToken: string | symbol | InjectionKey<any>,
  defaultService: T,
  aggregation?: T
) {
  let domainExist = true;
  if (
    !aggregation ||
    Object.prototype.toString.call(aggregation) !== "[object Object]"
  ) {
    console.warn(
      `[vue-injection-heler sub-domain-token:${subDomainToken.toString()}] lose link, or aggregation muse be object`
    );
    domainExist = false;
  } else {
    for (let key of Object.keys(aggregation)) {
      if (aggregation[key] === undefined) {
        console.warn(
          `[vue-injection-heler sub-domain-token:${subDomainToken.toString()}] key:${key} lose link`
        );
        domainExist = false;
        break;
      }
    }
  }
  const service = domainExist ? aggregation : defaultService;
  provide(subDomainToken, service);
  return service as T;
}

export default {
  getMockInstance,
  getInjectionToken,
  hideProvider,
  Domain,
  Subdomain,
  get,
  set,
};
