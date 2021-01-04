/**
 * Interface for how a route parameter should be parsed and serialized.
 *
 * @typeParam T The Type this parser should parse to and serialize from
 */
export interface ParamParser<T> {
  /**
   * @param s The string from the url
   * @returns The parameter parsed to the type T
   */
  parse: (s: string) => T;
  /**
   * @param x The value to serialize
   * @returns The string for the url serialized from the type T
   */
  serialize: (x: T) => string;
}

/**
 * Parameter parser for the type `string`
 */
export const stringParser: ParamParser<string> = {
  parse: s => s,
  serialize: s => s,
};

/**
 * Parameter parser for the type `number` as a `float`
 */
export const floatParser: ParamParser<number> = {
  parse: s => parseFloat(s),
  serialize: x => x.toString(),
};

/**
 * Parameter parser for the type `number` as an `int`
 */
export const intParser: ParamParser<number> = {
  parse: s => parseInt(s),
  serialize: x => x.toString(),
};

/**
 * Parameter parser for the type `Date`
 */
export const dateParser: ParamParser<Date> = {
  parse: s => new Date(s),
  serialize: d => d.toISOString(),
};

/**
 * Parameter parser for the type `boolean`
 */
export const booleanParser: ParamParser<boolean> = {
  parse: s => s === 'true',
  serialize: b => b.toString(),
};

/**
 * Parameter parser for a dynamic list of strings
 *
 * @param strings - The readonly string[] to parse to and serialize from
 */
export const stringListParser: <T extends readonly string[]>(
  strings: T
) => ParamParser<typeof strings[number]> = () => ({
  parse: s => s,
  serialize: s => s,
});
