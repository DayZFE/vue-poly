declare module "lodash" {
  export type PropertyPath =
    | string
    | number
    | symbol
    | readonly (string | number | symbol)[];
  export function get<T extends Object>(target: T, path: PropertyPath): any;
  export function set<T extends Object>(
    target: T,
    path: PropertyPath,
    value: any
  ): T;
}
