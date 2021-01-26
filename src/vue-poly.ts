import { InjectionKey, provide, inject, customRef, ref } from "vue";
import { get, set, PropertyPath } from "lodash";

export type FunctionPoly<T> = (...args: any) => T;
export type ClassPoly<T> = new (...args: any) => T;
export type PolyEvent = (...args: any) => void;
export type PolyID = string | symbol | InjectionKey<any>;
export type QueryPath = PropertyPath;
export interface Bondation {
  type: "ref" | "event" | "static";
  queryPath: QueryPath;
}

export const bondGet = get;
export const bondSet = set;

// @ts-ignore
export function cataly<T, P>(Poly: FunctionPoly<T> | ClassPoly<T>) {
  return (undefined as unknown) as T;
}

export function definePoly<
  T extends { id: PolyID; disabled?: boolean; [key: string]: any }
>(poly: T) {
  if (poly.disabled) {
    const injectedPoly = inject(poly.id);
    if (injectedPoly === undefined) {
      throw new Error("cannot disable a poly while no other poly founded");
    }
    return injectedPoly;
  }
  const polyStatus = ref({
    bondList: [] as Bondation[],
    frozen: false,
  });
  const usedPoly = { ...poly, polyStatus };
  provide(poly.id, usedPoly);
  return usedPoly;
}

export function bond<T>(id: PolyID, queryPath: QueryPath, defaultValue: T) {
  let type = "static";
  if (typeof queryPath !== "string" && (queryPath as any[]).includes("value")) {
    type = "ref";
  }
  const poly = inject(id);
  if (!poly) return defaultValue;
  const IDResult = get(poly, queryPath);
  if (!IDResult) return defaultValue;
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
      set(val: any) {
        if (poly.polyStatus.value.frozen) return;
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
