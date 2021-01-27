import {
  InjectionKey,
  provide,
  inject,
  customRef,
  ref,
  watch,
  toRaw,
} from "vue";
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
export interface Poly {
  id: PolyID;
  innerId?: PolyID;
  through?: boolean;
  frozen?: boolean;
  [key: string]: any;
}

export const bondGet = get;
export const bondSet = set;

// @ts-ignore
export function cataly<T, P>(Poly: FunctionPoly<T> | ClassPoly<T>) {
  return (undefined as unknown) as T;
}

export function definePoly<T extends Poly>(poly: T) {
  if (poly.through) {
    const injectedPoly = inject(poly.id);
    if (injectedPoly === undefined) {
      throw new Error("cannot disable a poly while no other poly founded");
    }
    return injectedPoly;
  }
  const polyStatus = ref({
    bondList: [] as Bondation[],
    frozen: poly.frozen || false,
  });
  const usedPoly = { ...poly, polyStatus };
  provide(poly.id, usedPoly);
  if (poly.innerId) {
    provide(poly.innerId, usedPoly);
  }
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
  if (IDResult === undefined) return defaultValue;
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
      set(val: any) {
        if (poly.polyStatus.value.frozen) return;
        set(poly, queryPath, val);
      },
    }));
  }
  return IDResult;
}

export function watchPoly(
  poly: Poly,
  cb: (status: { bondList: Bondation[]; frozen: boolean }) => void
) {
  const polyStatus = (poly as any).polyStatus;
  watch(
    polyStatus as any,
    (res) => {
      setTimeout(() => {
        cb(toRaw(res as any));
      }, 0);
    },
    { immediate: true }
  );
}

export default {
  cataly,
  bond,
  bondGet,
  bondSet,
  definePoly,
  watchPoly,
};
