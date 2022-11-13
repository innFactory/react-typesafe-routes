import { ParamsParserMap, RawParams, SerializedParams } from '../types';

type PathToken = string | PathParam;

const isPathParam = (x: PathToken): x is PathParam => typeof x !== 'string';

interface PathParam {
  modifier: '' | '*' | '+' | '?';
  name: string;
}

const filterParamsMap = (
  paramsMap: ParamsParserMap<any>,
  tokens: PathToken[]
): ParamsParserMap<any> =>
  tokens.reduce<ParamsParserMap<any>>(
    (acc, t: PathToken) =>
      !isPathParam(t) ? acc : { ...acc, [t.name]: paramsMap[t.name] },
    {}
  );

type ParsedRouteMeta = ReturnType<typeof parseRoute>;
export const parseRoute = (
  pathWithQuery: string,
  paramsMap: ParamsParserMap<string> | undefined
) => {
  const [pathTemplate, ...queryFragments] = pathWithQuery.split('&');
  const pathTokens = parseTokens(pathTemplate.split('/'));
  const queryTokens = parseTokens(queryFragments);
  const pathParamParsers =
    paramsMap !== undefined ? filterParamsMap(paramsMap, pathTokens) : {};
  const queryParamParsers =
    paramsMap !== undefined ? filterParamsMap(paramsMap, queryTokens) : {};
  return {
    pathTemplate,
    pathTokens,
    queryTokens,
    pathParamParsers,
    queryParamParsers,
    paramsMap,
  };
};

export const parseTokens = (path: string[]): PathToken[] =>
  path.reduce<PathToken[]>((acc, f) => {
    if (!f) {
      return acc;
    } else if (f.startsWith(':')) {
      const maybeMod = f[f.length - 1];
      const modifier =
        maybeMod === '+' || maybeMod === '*' || maybeMod === '?'
          ? maybeMod
          : '';
      return acc.concat({
        modifier,
        name: f.slice(1, modifier ? f.length - 1 : undefined),
      });
    }
    return acc.concat(f);
  }, []);

export const stringifyParams = (
  paramsMap: ParamsParserMap<any>,
  params: RawParams
): Record<string, string> =>
  Object.keys(paramsMap).reduce(
    (previous, current) => ({
      ...previous,
      ...(params[current] !== undefined
        ? { [current]: paramsMap[current].serialize(params[current]) }
        : {}),
    }),
    {}
  );

export const stringifyRoute = (
  pathTokens: PathToken[],
  params: SerializedParams,
  prefixPath = ''
): string =>
  [prefixPath]
    .concat(
      pathTokens.reduce<string[]>(
        (acc, t) =>
          isPathParam(t)
            ? params[t.name] !== undefined
              ? acc.concat(encodeURIComponent(params[t.name]))
              : acc
            : acc.concat(t),
        []
      )
    )
    .join('/');

export const paramsParser = ({
  pathTokens,
  queryTokens,
  paramsMap,
}: ParsedRouteMeta) => (params: SerializedParams): RawParams => {
  const parsedParams = Object.keys(params).reduce<RawParams>(
    paramsMap
      ? (acc, k) => ({
          ...acc,
          ...(paramsMap[k] !== undefined
            ? {
                [k]: paramsMap[k].parse(params[k]),
              }
            : {}),
        })
      : (acc, _) => ({ ...acc }),
    {}
  );

  pathTokens.concat(queryTokens).forEach(t => {
    if (
      isPathParam(t) &&
      ['', '+'].includes(t.modifier) &&
      parsedParams[t.name] === undefined
    ) {
      throw Error(
        `[parseParams]: parameter "${t.name}" is required but is not defined`
      );
    }
  });
  return parsedParams;
};
