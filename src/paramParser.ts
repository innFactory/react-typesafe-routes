export interface ParamParser<T> {
  parse: (s: string) => T;
  serialize: (x: T) => string;
}

export const stringParser: ParamParser<string> = {
  parse: s => s,
  serialize: s => s,
};
export const floatParser: ParamParser<number> = {
  parse: s => parseFloat(s),
  serialize: x => x.toString(),
};
export const intParser: ParamParser<number> = {
  parse: s => parseInt(s),
  serialize: x => x.toString(),
};
export const dateParser: ParamParser<Date> = {
  parse: s => new Date(s),
  serialize: d => d.toISOString(),
};
export const booleanParser: ParamParser<boolean> = {
  parse: s => s === 'true',
  serialize: b => b.toString(),
};

export const stringListParser: <T extends readonly string[]>(
  strings: T
) => ParamParser<typeof strings[number]> = () => ({
  parse: s => s,
  serialize: s => s,
});
