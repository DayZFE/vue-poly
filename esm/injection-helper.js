import { provide, inject } from "vue";
import get from "lodash.get";
import set from "lodash.set";
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
export function getMockInstance(service) {
    return undefined;
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
export function getInjectionToken(service, tokenName) {
    const token = tokenName || Symbol();
    return token;
}
/**
 * hide suck provider
 *
 * @export
 * @template T
 * @param {(InjectionKey<T> | string)} injectionToken
 */
export function hideProvider(injectionToken) {
    provide(injectionToken, undefined);
}
/**
 * generate a domain by service's token
 *
 * @template T
 * @param {(string | symbol)} foreignToken
 * @param {(string | symbol)} innerToken
 * @param {T} defaultService
 * @returns
 */
export function Domain(foreignToken, innerToken, defaultService) {
    const injectionService = inject(foreignToken, undefined);
    let service = injectionService;
    if (injectionService === undefined) {
        console.warn(`[vue-injection-heler domain-foreign-token:${foreignToken.toString()}]cannot link the model outside this domain`);
        service = defaultService;
    }
    provide(innerToken, service);
    return service;
}
/**
 * generate a subdomain by collection
 *
 * @template T
 * @param {(string | symbol)} subDomainToken
 * @param {T} defaultService
 * @param {T} [aggregation]
 * @returns
 */
export function Subdomain(subDomainToken, defaultService, aggregation) {
    let domainExist = true;
    if (!aggregation ||
        Object.prototype.toString.call(aggregation) !== "[object Object]") {
        console.warn(`[vue-injection-heler sub-domain-token:${subDomainToken.toString()}] lose link, or aggregation muse be object`);
        domainExist = false;
    }
    else {
        for (let key of Object.keys(aggregation)) {
            if (aggregation[key] === undefined) {
                console.warn(`[vue-injection-heler sub-domain-token:${subDomainToken.toString()}] key:${key} lose link`);
                domainExist = false;
                break;
            }
        }
    }
    const service = domainExist ? aggregation : defaultService;
    provide(subDomainToken, service);
    return service;
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
//# sourceMappingURL=injection-helper.js.map