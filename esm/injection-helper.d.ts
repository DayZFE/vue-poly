import { InjectionKey, Ref } from "vue";
declare type FuncService<T> = (...args: any) => T;
declare type ClassService<T> = new (...args: any) => T;
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
 * optional injection
 *
 * @export
 * @template T
 * @param {T} local
 * @param {(InjectionKey<T> | string)} token
 * @returns
 */
export declare function OptionalInjection<T>(local: T, token: InjectionKey<T> | string): T;
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
export declare function Aggregation<P>(token: InjectionKey<unknown> | string, pathProps: string[], defaultValue: P, ifReadonly?: boolean): Ref<P>;
declare const _default: {
    getMockInstance: typeof getMockInstance;
    getInjectionToken: typeof getInjectionToken;
    hideProvider: typeof hideProvider;
    OptionalInjection: typeof OptionalInjection;
    Aggregation: typeof Aggregation;
};
export default _default;
