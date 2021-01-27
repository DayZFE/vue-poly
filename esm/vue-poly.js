import { provide, inject, customRef, ref, watch, toRaw, } from "vue";
import { get, set } from "lodash";
export const bondGet = get;
export const bondSet = set;
// @ts-ignore
export function cataly(Poly) {
    return undefined;
}
export function definePoly(poly) {
    // provide poly through
    if (poly.through && poly.id) {
        const injectedPoly = inject(poly.id);
        if (injectedPoly !== undefined) {
            return injectedPoly;
        }
        else {
            provide(poly.id, injectedPoly);
            provide(poly.logicId || "unknown logic", injectedPoly);
        }
    }
    // add poly status
    const polyStatus = ref({
        bondList: [],
        frozen: poly.frozen || false,
    });
    // automaticlly give a id
    if (!poly.id) {
        poly.id = Symbol();
    }
    // seal object to avoid modification
    const usedPoly = Object.seal({
        ...poly,
        polyStatus,
        logicId: poly.logicId || "unkownLogic",
    });
    // provide logicId and id
    provide(poly.id, usedPoly);
    if (poly.logicId) {
        provide(poly.logicId, usedPoly);
    }
    return usedPoly;
}
export function isPoly(poly) {
    if (poly.polyStatus && poly.id && poly.logicId) {
        return true;
    }
    else {
        return false;
    }
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
    if (!isPoly(poly))
        return;
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
    isPoly,
};
//# sourceMappingURL=vue-poly.js.map