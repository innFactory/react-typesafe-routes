import { stringify } from 'qs';

// Hooks
export * from './hooks/useRouteOptions';
export * from './hooks/useRouteParams';

// Components
export * from './components/RouterSwitch';

// General
type RoutePage = React.ReactNode;

export type RouteOptions = Record<string, any> | undefined;

type RouteMiddleware = (next: RouteMiddleware) => RoutePage | RouteMiddleware;

// Parameter Parser
export interface ParamParser<T> {
  parse: (s: string) => T;
  serialize: (x: T) => string;
}

export const stringParser: ParamParser<string> = {
  parse: (s) => s,
  serialize: (s) => s,
};
export const floatParser: ParamParser<number> = {
  parse: (s) => parseFloat(s),
  serialize: (x) => x.toString(),
};
export const intParser: ParamParser<number> = {
  parse: (s) => parseInt(s),
  serialize: (x) => x.toString(),
};
export const dateParser: ParamParser<Date> = {
  parse: (s) => new Date(s),
  serialize: (d) => d.toISOString(),
};
export const booleanParser: ParamParser<boolean> = {
  parse: (s) => s === 'true',
  serialize: (b) => b.toString(),
};

// Parameters
type InferParam<T extends string, M extends [string, string]> =
  T extends `:${infer O}?` ? [M[0], M[1] | O]
  : T extends `:${infer O}*` ? [M[0], M[1] | O]
  : T extends `:${infer O}+` ? [M[0] | O, M[1]]
  : T extends `:${infer O}` ? [M[0] | O, M[1]]
  : M;

type InferParamGroups<P extends string> =
  P extends `${infer A}/${infer B}` ? InferParam<A, InferParamGroups<B>>
  : P extends `${infer A}&${infer B}` ? InferParam<A, InferParamGroups<B>>
  : InferParam<P, [never, never]>;

type MergeParamGroups<G extends [string, string]> = G[0] | G[1];

type RequiredParamNames<G extends [string, string]> = G[0];

type OptionalParamNames<G extends [string, string]> = G[1];

type SerializedParams<K extends string = string> = Record<K, string>;

type RawParams = Record<string, unknown>;

type ParamsParserMap<K extends string> = Record<K, ParamParser<any>>;

type TemplateParserMap<T extends string> = ParamsParserMap<MergeParamGroups<InferParamGroups<T>>>;

type ExtractParamsParserReturnTypes<
  P extends ParamsParserMap<any>,
  F extends keyof P,
  > = {
    [K in F]: ReturnType<P[K]["parse"]>;
  }

// Route Function
export type ChildRouteMap<RO> = Record<string, RouteNodeWithParams<any, any, any, RO> | RouteNodeWithoutParams<any, any, RO>>;

type RouteNodeBase<
  T extends string,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions,
  > = {
    parentTemplate: string;
    page: RoutePage;
    render: () => RoutePage;
    templateWithQuery: T;
    template: string;
    options: RO extends undefined ? undefined : Required<RO>;
    children: CRM;
  }; // & { [K in keyof CRM]: CRM[K] };

function isRouteNodeWithParams(node: any): node is RouteNodeWithParams<any, any, any, any> {
  return node['paramsMap'] !== undefined;
}

export type RouteNodeWithParams<
  T extends string,
  TPM extends TemplateParserMap<T>,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions,
  > = RouteNodeBase<T, CRM, RO> & {
    paramsMap: TPM;
    parseParams: <G extends InferParamGroups<T>>(
      params: SerializedParams<RequiredParamNames<G>>
        & Partial<SerializedParams<OptionalParamNames<G>>>,
      strict?: boolean,
    ) => ExtractParamsParserReturnTypes<TPM, RequiredParamNames<G>>
      & Partial<ExtractParamsParserReturnTypes<TPM, OptionalParamNames<G>>>
  } & (
    <G extends InferParamGroups<T>>(params: ExtractParamsParserReturnTypes<TPM, RequiredParamNames<G>>
      & Partial<ExtractParamsParserReturnTypes<TPM, OptionalParamNames<G>>>) => {
        $: string;
      } & {
        [K in keyof CRM]: CRM[K];
      }
  );

export type RouteNodeWithoutParams<
  T extends string,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions,
  > = RouteNodeBase<T, CRM, RO> & (
    () => {
      $: string;
    } & {
        [K in keyof CRM]: CRM[K];
      }
  );

type RouteNode<
  T extends string,
  TPM extends TemplateParserMap<T>,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions,
  > = keyof TemplateParserMap<T> extends never ? RouteNodeWithoutParams<T, CRM, RO> : RouteNodeWithParams<T, TPM, CRM, RO>;

type RouteFnBaseArgs<
  RO extends RouteOptions> = {
    page: RoutePage;
    middleware?: RouteMiddleware;
    options?: Partial<RO>
  }

type RouteFnArgsWithParams<
  T extends string,
  TPM extends TemplateParserMap<T>,
  RO extends RouteOptions
  > = RouteFnBaseArgs<RO> & {
    params: TPM
  };

function isRouteArgsWithParams(args: any): args is RouteFnArgsWithParams<any, any, any> {
  return args['params'] !== undefined;
}

type RouteFnArgs<
  T extends string,
  TPM extends TemplateParserMap<T>,
  RO extends RouteOptions> = keyof TemplateParserMap<T> extends never ? RouteFnBaseArgs<RO> : RouteFnArgsWithParams<T, TPM, RO>;

type RouteFnContext<RO extends RouteOptions> = {
  previousQueryParams: SerializedParams,
  previousPath: string,
  previousOptions: Required<RO>,
  previousMiddleware: RouteMiddleware | undefined;
}

type RouteFn<
  RO extends RouteOptions
  > = <
    T extends string,
    TPM extends TemplateParserMap<T>,
    CRM extends ChildRouteMap<RO>,
    >(
    templateWithQuery: T,
    args: RouteFnArgs<T, TPM, RO>,
    children?: ChildrenRouterFn<RO, CRM>,
  ) => RouteNode<T, TPM, CRM, RO>;

// Path
type PathToken = string | PathParam;

const isPathParam = (x: PathToken): x is PathParam => typeof x !== "string";

interface PathParam {
  modifier: "" | "*" | "+" | "?";
  name: string;
}

// Router
type ChildrenRouterFn<RO extends RouteOptions, CRM extends ChildRouteMap<RO>> = (route: RouteFn<RO>) => { [K in keyof CRM]: CRM[K] };

type RouterFn<RO extends RouteOptions, CRM extends ChildRouteMap<RO>> = (route: RouteFn<RO>) => CRM;

type OptionsRouterFn = <RO extends RouteOptions, CRM extends ChildRouteMap<RO>>(options: Required<RO>, routes: RouterFn<RO, CRM>) => OptionsRouter<RO, CRM>;

export type OptionsRouter<RO extends RouteOptions, CRM extends ChildRouteMap<RO>> = { defaultOptions: RO } & { [K in keyof CRM]: CRM[K] };

type OptionlessRouterFn = <CRM extends ChildRouteMap<undefined>>(routes: RouterFn<undefined, CRM>) => OptionlessRouter<CRM>;

export type OptionlessRouter<CRM extends ChildRouteMap<undefined>> = { [K in keyof CRM]: CRM[K] };

// Utilities
const filterparamsMap = (
  paramsMap: ParamsParserMap<any>,
  tokens: PathToken[]
): ParamsParserMap<any> =>
  tokens.reduce<ParamsParserMap<any>>(
    (acc, t: PathToken) =>
      !isPathParam(t) ? acc : { ...acc, [t.name]: paramsMap[t.name] },
    {}
  );

type ParsedRouteMeta = ReturnType<typeof parseRoute>;
const parseRoute = (
  pathWithQuery: string,
  paramsMap: ParamsParserMap<string> | undefined
) => {
  const [pathTemplate, ...queryFragments] = pathWithQuery.split('&');
  const pathTokens = parseTokens(pathTemplate.split('/'));
  const queryTokens = parseTokens(queryFragments);
  const pathParamParsers = paramsMap
    ? filterparamsMap(paramsMap, pathTokens)
    : {};
  const queryParamParsers = paramsMap
    ? filterparamsMap(paramsMap, queryTokens)
    : {};
  return {
    pathTemplate,
    pathTokens,
    queryTokens,
    pathParamParsers,
    queryParamParsers,
    paramsMap,
  };
};

const parseTokens = (path: string[]): PathToken[] =>
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

const stringifyParams = (
  paramsMap: ParamsParserMap<any>,
  params: RawParams
): Record<string, string> =>
  Object.keys(paramsMap).reduce(
    (previous, current) => ({
      ...previous,
      ...(params[current]
        ? { [current]: paramsMap[current].serialize(params[current]) }
        : {}),
    }),
    {}
  );

export const Router: OptionlessRouterFn = routes =>
  routes(optionsRoute(undefined));

export const OptionsRouter: OptionsRouterFn = (options, routes) =>
  Object.assign({defaultOptions: options }, routes(optionsRoute(options)));

type OptionsRouteFn = <RO extends RouteOptions>(
  options: Required<RO>
) => RouteFn<RO>;

const optionsRouteFn = <RO extends RouteOptions>(options: Required<RO>) => <
  T extends string,
  TPM extends TemplateParserMap<T>,
  CRM extends ChildRouteMap<RO>,
  CRF extends ChildrenRouterFn<RO, CRM>
>(
  templateWithQuery: T,
  args: RouteFnArgs<T, TPM, RO>,
  children?: CRF
): RouteNode<T, TPM, CRM, RO> =>
  routeFn.call<
    RouteFnContext<RO>,
    [T, typeof args, CRF | undefined],
    RouteNode<T, TPM, CRM, RO>
  >(
    {
      previousPath: '',
      previousQueryParams: {},
      previousOptions: options,
      previousMiddleware: undefined,
    },
    templateWithQuery,
    args,
    children
  );

const optionsRoute: OptionsRouteFn = optionsRouteFn;

const childrenRouterFn = <RO extends RouteOptions>(
  context: RouteFnContext<RO>
): RouteFn<RO> => <
  T extends string,
  TPM extends TemplateParserMap<T>,
  CRM extends ChildRouteMap<RO>,
  CRF extends ChildrenRouterFn<RO, CRM>
>(
  templateWithQuery: T,
  args: RouteFnArgs<T, TPM, RO>,
  children?: CRF
): RouteNode<T, TPM, CRM, RO> =>
    routeFn.call<
      RouteFnContext<RO>,
      [T, typeof args, CRF | undefined],
      RouteNode<T, TPM, CRM, RO>
    >(context, templateWithQuery, args, children);

function routeFn<
  T extends string,
  TPM extends TemplateParserMap<T>,
  CRM extends ChildRouteMap<RO>,
  RO extends RouteOptions
>(
  this: RouteFnContext<RO>,
  templateWithQuery: T,
  args: RouteFnArgs<T, TPM, RO>,
  children?: ChildrenRouterFn<RO, CRM>
): RouteNode<T, TPM, CRM, RO> {
  var params: TemplateParserMap<T>;
  if (isRouteArgsWithParams(args)) {
    params = args.params;
  }

  const parsedRoute = parseRoute(templateWithQuery, params);
  const options: Required<RO> = { ...this.previousOptions, ...args.options };
  var middleware: RouteMiddleware | undefined;

  if (this.previousMiddleware) {
    if (args.middleware) {
      middleware = next =>
        this.previousMiddleware!(args.middleware!(next) as any);
    } else {
      middleware = this.previousMiddleware;
    }
  } else {
    if (args.middleware) {
      middleware = args.middleware;
    }
  }

  const childrenRouteFn = childrenRouterFn({
    previousPath: this.previousPath + '/' + parsedRoute.pathTemplate,
    previousQueryParams: { ...this.previousQueryParams },
    previousOptions: options,
    previousMiddleware: middleware,
  });
  const _children =
    typeof children === 'function'
      ? children(childrenRouteFn)
      : typeof children === 'object'
        ? children
        : undefined;

  // DEBUG:
  // console.log({ templateWithQuery, children, _children });
  // console.log(
  //   'routeFn',
  //   {
  //     templateWithQuery,
  //     parsedRoute,
  //     childrenType: typeof children,
  //     _children,
  //     options,
  //   },
  //   this
  // );

  const fn = (rawParams: RawParams) =>
    new Proxy<any>(
      {},
      {
        get: (target, next, receiver) => {
          const pathParams = stringifyParams(
            parsedRoute.pathParamParsers,
            rawParams
          );
          const queryParams = {
            ...this.previousQueryParams,
            ...stringifyParams(parsedRoute.queryParamParsers, rawParams),
          };
          const path = stringifyRoute(
            parsedRoute.pathTokens,
            pathParams,
            this.previousPath
          );

          // console.log('routeFn get: ', {
          //   templateWithQuery,
          //   pathParamParsers: parsedRoute.pathParamParsers,
          //   rawParams,
          //   pathParams,
          //   path,
          //   children: {
          //     children,
          //     type: typeof children,
          //     _children,
          //   },
          // });

          if (next === '$') {
            return path + stringify(queryParams, { addQueryPrefix: true });
          } else if (next === Symbol.toPrimitive) {
            return () =>
              path + stringify(queryParams, { addQueryPrefix: true });
          } else if (typeof next == 'string' && _children && _children[next]) {
            const nextChild = _children[next];

            if (isRouteNodeWithParams(nextChild)) {
              return routeFn.call<RouteFnContext<RO>, [any, any, any], any>(
                {
                  previousPath: path,
                  previousQueryParams: queryParams,
                  previousOptions: options,
                  previousMiddleware: middleware,
                },
                nextChild.templateWithQuery,
                {
                  page: nextChild.page,
                  options: nextChild.options,
                  params: nextChild.paramsMap,
                },
                nextChild.children
              );
            } else {
              return routeFn.call<RouteFnContext<RO>, [any, any, any], any>(
                {
                  previousPath: path,
                  previousQueryParams: queryParams,
                  previousOptions: options,
                  previousMiddleware: middleware,
                },
                nextChild.templateWithQuery,
                {
                  page: nextChild.page,
                  options: nextChild.options,
                },
                nextChild.children
              );
            }
          }

          return Reflect.get(target, next, receiver);
        },
      }
    );

  var node: any = {
    parentTemplate: this.previousPath,
    templateWithQuery: templateWithQuery,
    template: parsedRoute.pathTemplate,
    children: _children ?? ({} as CRM),
    options: options,
    page: args.page,
    render:
      middleware !== undefined
        ? () => (middleware!(args.page as any) as any)()
        : () => args.page,
  } as RouteNodeBase<T, CRM, RO>;

  if (isRouteArgsWithParams(args)) {
    node.paramsMap = params;
    node.parseParams = paramsParser(parsedRoute);
  }

  return Object.assign(fn, node);
}

const stringifyRoute = (
  pathTokens: PathToken[],
  params: SerializedParams,
  prefixPath = ''
): string =>
  [prefixPath]
    .concat(
      pathTokens.reduce<string[]>(
        (acc, t) =>
          isPathParam(t)
            ? params[t.name]
              ? acc.concat(encodeURIComponent(params[t.name]))
              : acc
            : acc.concat(t),
        []
      )
    )
    .join('/');

const paramsParser = ({
  pathTokens,
  queryTokens,
  paramsMap,
}: ParsedRouteMeta) => (
  params: SerializedParams,
  strict = false
): RawParams => {
    const parsedParams = Object.keys(params).reduce<RawParams>(
      paramsMap
        ? (acc, k) => ({
          ...acc,
          ...(paramsMap[k]
            ? {
              [k]: paramsMap[k].parse(params[k]),
            }
            : {}),
        })
        : (acc, _) => ({ ...acc }),
      {}
    );
    if (strict) {
      pathTokens.concat(queryTokens).forEach(t => {
        if (
          isPathParam(t) &&
          ['', '+'].includes(t.modifier) &&
          !parsedParams[t.name]
        ) {
          throw Error(
            `[parseParams]: parameter "${t.name}" is required but is not defined`
          );
        }
      });
    }
    return parsedParams;
  };
