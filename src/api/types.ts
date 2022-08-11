import { ModelObject } from "./api";


export type filterTypes = "gte" | "lte" | "exact" | "in";


type symbolRem<T> = T extends symbol ? string : T;
type FilterKeySuffix<T extends filterTypes> = T extends "exact" ? "" : `__${T}`;
type FilterValueType<T, F extends filterTypes> = F extends "in" ? T[] : T;


type MetaValueSpread<K extends string | number | bigint | boolean | null | undefined, F extends filterTypes, PT> = F extends filterTypes ? { [key in `${K}${FilterKeySuffix<F>}`]: FilterValueType<PT, F> } : never
type MetaKeySpread<O extends Record<keyof M, readonly filterTypes[] | undefined>, K extends string | number | bigint | boolean | null | undefined, M extends ModelObject> = K extends keyof O ? K extends keyof M ? MetaValueSpread<K, Exclude<O[K], undefined>[number], M[K]> : never : never;

export type TFilterParams<T extends Partial<Record<keyof M, readonly filterTypes[]>>, M extends ModelObject> = UnionToIntersection<Partial<MetaKeySpread<T, symbolRem<keyof T>, M>>>

export type TFilterChoiceList<T extends Partial<Record<string, any>>> = {[K in keyof T]:Record<Extract<T[K], string[]>[number], string>}

export type UnionToIntersection<T> = 
  (T extends any ? (x: T) => any : never) extends 
  (x: infer R) => any ? R : never
