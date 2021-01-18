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
export declare function InjectionMapping<P>(token: InjectionKey<unknown> | string, pathProps: string[], reactiveNodeLayerNum?: number, ifReadonly?: boolean, local?: Ref<P>): Ref<P | undefined>;
declare const _default: {
    getMockInstance: typeof getMockInstance;
    getInjectionToken: typeof getInjectionToken;
    hideProvider: typeof hideProvider;
    OptionalInjection: typeof OptionalInjection;
    InjectionMapping: typeof InjectionMapping;
};
export default _default;
