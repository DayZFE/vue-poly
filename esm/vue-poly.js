(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "vue", "lodash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bond = exports.definePoly = exports.cataly = exports.bondSet = exports.bondGet = void 0;
    const vue_1 = require("vue");
    const lodash_1 = require("lodash");
    exports.bondGet = lodash_1.get;
    exports.bondSet = lodash_1.set;
    // @ts-ignore
    function cataly(Poly) {
        return undefined;
    }
    exports.cataly = cataly;
    function definePoly(poly) {
        if (poly.disabled) {
            const injectedPoly = vue_1.inject(poly.id);
            if (injectedPoly === undefined) {
                throw new Error("cannot disable a poly while no other poly founded");
            }
            return injectedPoly;
        }
        const polyStatus = vue_1.ref({
            bondList: [],
            frozen: false,
        });
        const usedPoly = { ...poly, polyStatus };
        vue_1.provide(poly.id, usedPoly);
        return usedPoly;
    }
    exports.definePoly = definePoly;
    function bond(id, queryPath, defaultValue) {
        let type = "static";
        if (typeof queryPath !== "string" && queryPath.includes("value")) {
            type = "ref";
        }
        const poly = vue_1.inject(id);
        if (!poly)
            return defaultValue;
        const IDResult = lodash_1.get(poly, queryPath);
        if (!IDResult)
            return defaultValue;
        if (typeof IDResult === "function") {
            type = "event";
        }
        poly.polyStatus.value.bondList.push({ type, queryPath });
        if (type === "ref") {
            return vue_1.customRef((track) => ({
                get() {
                    track();
                    return IDResult;
                },
                set(val) {
                    if (poly.polyStatus.value.frozen)
                        return;
                    lodash_1.set(poly, queryPath, val);
                },
            }));
        }
        return IDResult;
    }
    exports.bond = bond;
    exports.default = {
        cataly,
        bond,
        bondGet: exports.bondGet,
        bondSet: exports.bondSet,
        definePoly,
    };
});
//# sourceMappingURL=vue-poly.js.map