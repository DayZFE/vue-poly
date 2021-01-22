(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "vue", "lodash.get", "lodash.set"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.aggregateRef = exports.aggregateEvent = exports.defineModule = exports.hideProvider = exports.getInjectionToken = exports.getMockInstance = void 0;
    const vue_1 = require("vue");
    const lodash_get_1 = require("lodash.get");
    const lodash_set_1 = require("lodash.set");
    /**
     * mock instance of useFunc
     *
     * @export
     * @template T
     * @param {(FuncService<T> | ClassService<T>)} service
     * @returns
     */
    // @ts-ignore
    function getMockInstance(service) {
        return undefined;
    }
    exports.getMockInstance = getMockInstance;
    /**
     * generate injection token
     *
     * @export
     * @template T
     * @param {(FuncService<T> | ClassService<T>)} service
     * @param {(string | symbol)} [tokenName]
     * @returns
     */
    function getInjectionToken(service, tokenName) {
        const token = tokenName || Symbol();
        return token;
    }
    exports.getInjectionToken = getInjectionToken;
    /**
     * hide suck provider
     *
     * @export
     * @template T
     * @param {(InjectionKey<T> | string)} injectionToken
     */
    function hideProvider(injectionToken) {
        vue_1.provide(injectionToken, undefined);
    }
    exports.hideProvider = hideProvider;
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
    function defineModule(context, token, outerSource) {
        let innerContext = context;
        if (outerSource) {
            const result = vue_1.inject(outerSource);
            if (result === undefined) {
                console.warn("[vue-injection-helper]lose link to outerSource");
            }
            else {
                innerContext = result;
            }
        }
        vue_1.provide(token, innerContext);
        return { innerContext, token };
    }
    exports.defineModule = defineModule;
    /**
     * get aggregated domain event
     *
     * @template T
     * @param {LinkToken} token
     * @param {string[]} queryPath
     * @param {boolean} [showWarn=false]
     * @returns
     */
    function aggregateEvent(token, queryPath, showWarn = false) {
        const provideService = vue_1.inject(token);
        if (!provideService) {
            if (showWarn) {
                console.warn("[vue-injection-helper aggregate event] lose link");
            }
            return () => { };
        }
        if (queryPath.length <= 0) {
            if (showWarn) {
                console.warn("[vue-injection-helper] queryPath was empty");
            }
            return () => { };
        }
        const result = lodash_get_1.default(provideService, queryPath);
        if (result === undefined ||
            Object.prototype.toString.call(result) !== "[object Function]") {
            if (showWarn) {
                console.warn("[vue-injection-helper] event func not found");
            }
            return () => { };
        }
        return result;
    }
    exports.aggregateEvent = aggregateEvent;
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
    function aggregateRef(token, queryPath, defaultValue, showWarn = false) {
        if (vue_1.isRef(defaultValue) || vue_1.isReactive(defaultValue)) {
            throw new Error("[vue-injection-helper aggregate ref] defaultValue cannot be ref or reactive");
        }
        const provideService = vue_1.inject(token);
        const localRef = vue_1.ref(defaultValue);
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
        const result = lodash_get_1.default(provideService, queryPath);
        return vue_1.customRef((track, trigger) => {
            return {
                get: () => {
                    track();
                    if (result === undefined) {
                        console.warn("[vue-injection-helper aggregate ref] received undefined");
                        return localRef.value;
                    }
                    return result;
                },
                set: (newValue) => {
                    lodash_set_1.default(provideService, queryPath, newValue);
                },
            };
        });
    }
    exports.aggregateRef = aggregateRef;
    exports.default = {
        getMockInstance,
        getInjectionToken,
        hideProvider,
        defineModule,
        aggregateEvent,
        aggregateRef,
        get: lodash_get_1.default,
        set: lodash_set_1.default,
    };
});
//# sourceMappingURL=injection-helper.js.map