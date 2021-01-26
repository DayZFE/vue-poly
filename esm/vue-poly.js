import { provide, inject, customRef, ref } from "vue";
import { get, set } from "lodash";
export const bondGet = get;
export const bondSet = set;
// @ts-ignore
export function cataly(Poly) {
    return undefined;
}
export function definePoly(poly) {
    if (poly.disabled) {
        const injectedPoly = inject(poly.id);
        if (injectedPoly === undefined) {
            throw new Error("cannot disable a poly while no other poly founded");
        }
        return injectedPoly;
    }
    const polyStatus = ref({
        bondList: [],
        frozen: false,
    });
    const usedPoly = { ...poly, polyStatus };
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
    if (!IDResult)
        return defaultValue;
    if (typeof IDResult === "function") {
        type = "event";
    }
    poly.polyStatus.value.bondList.push({ type, queryPath });
    if (type === "ref") {
        return customRef((track) => ({
            get() {
                track();
                return IDResult;
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
export default {
    cataly,
    bond,
    bondGet,
    bondSet,
    definePoly,
};
//# sourceMappingURL=vue-poly.js.map