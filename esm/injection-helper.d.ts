import { InjectionKey, Ref } from "vue";
import { get, set, PropertyPath } from "lodash";
export declare type FuncService<T> = (...args: any) => T;
export declare type ClassService<T> = new (...args: any) => T;
export declare type AggregationFunc = (...args: any[]) => void;
export declare type AggregationNode = Ref | AggregationFunc;
export interface Aggregation {
    [key: string]: AggregationNode;
}
export declare type LinkToken = string | symbol | InjectionKey<any>;
export declare type QueryPath = PropertyPath;
export declare const objGet: typeof get;
export declare const objSet: typeof set;
/**
 * mock instance of useFunc
 *
 * @export
 * @template T
 * @param {(FuncService<T> | ClassService<T>)} service
 * @returns
 */
export declare function getMockInstance<T>(service: FuncService<T> | ClassService<T>): T;
/**
 * generate injection token
 *
 * @export
 * @template T
 * @param {(FuncService<T> | ClassService<T>)} service
 * @param {(string | symbol)} [tokenName]
 * @returns
 */
export declare function getInjectionToken<T>(service: FuncService<T> | ClassService<T>, tokenName?: string | symbol): InjectionKey<T>;
/**
 * hide suck provider
 *
 * @export
 * @template T
 * @param {(InjectionKey<T> | string)} injectionToken
 */
export declare function hideProvider<T>(injectionToken: InjectionKey<T> | string): void;
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
export declare function defineModule<T>(context: T, token: LinkToken, outerSource?: LinkToken): {
    innerContext: T;
    token: LinkToken;
};
/**
 * get static vlaue of injection
 *
 * @export
 * @template T
 * @param {LinkToken} token
 * @param {QueryPath} queryPath
 * @param {boolean} [showWarn=false]
 * @returns
 */
export declare function aggregateValue<T>(token: LinkToken, queryPath: QueryPath, showWarn?: boolean): T | null;
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
export declare function aggregateEvent<T extends AggregationFunc>(token: LinkToken, queryPath: QueryPath, showWarn?: boolean): T | (() => void);
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
export declare function aggregateRef<T>(token: LinkToken, queryPath: QueryPath, defaultValue: T, showWarn?: boolean): Ref<T>;
declare const _default: {
    getMockInstance: typeof getMockInstance;
    getInjectionToken: typeof getInjectionToken;
    hideProvider: typeof hideProvider;
    defineModule: typeof defineModule;
    aggregateValue: typeof aggregateValue;
    aggregateEvent: typeof aggregateEvent;
    aggregateRef: typeof aggregateRef;
    get: typeof get;
    set: typeof set;
};
export default _default;
