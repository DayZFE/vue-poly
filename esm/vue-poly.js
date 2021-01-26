import { provide, inject, customRef, ref, watch, toRaw, } from "vue";
import { get, set } from "lodash";
export const bondGet = get;
export const bondSet = set;
// @ts-ignore
export function cataly(Poly) {
    return undefined;
}
export function definePoly(poly) {
    if (poly.through) {
        const injectedPoly = inject(poly.id);
        if (injectedPoly !== undefined) {
            return injectedPoly;
        }
    }
    const polyStatus = ref({
        bondList: [],
        frozen: false,
    });
    const usedPoly = Object.seal({ ...poly, polyStatus });
    provide(poly.id, usedPoly);
    return usedPoly;
}
export function bond(id, queryPath, defaultValue) {
    let type = "static";
    if (typeof queryPath !== "string" && queryPath.includes("value")) {
        type = "ref";
    }
    const poly = inject(id);
    if (!poly)
        return defaultValue;
    const IDResult = get(poly, queryPath);
    if (IDResult === undefined)
        return defaultValue;
    if (typeof IDResult === "function") {
        type = "event";
    }
    poly.polyStatus.value.bondList.push({ type, queryPath });
    if (type === "ref") {
        return customRef((track) => ({
            get() {
                track();
                return get(poly, queryPath);
            },
            set(val) {
                if (poly.polyStatus.value.frozen)
                    return;
                set(poly, queryPath, val);
            },
        }));
    }
    return IDResult;
}
export function watchPoly(poly, cb) {
    const polyStatus = poly.polyStatus;
    watch(polyStatus, (res) => {
        setTimeout(() => {
            cb(toRaw(res));
        }, 0);
    }, { immediate: true });
}
export default {
    cataly,
    bond,
    bondGet,
    bondSet,
    definePoly,
    watchPoly,
};
//# sourceMappingURL=vue-poly.js.map