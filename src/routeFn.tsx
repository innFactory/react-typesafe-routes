import { stringify } from 'qs';
import { isRouteArgsWithParams, RouteFnArgs } from './routeArgs';
import {
  isRouteNodeWithParams,
  RouteNode,
  RouteNodeBase,
  RouteNodeWithoutParams,
  RouteNodeWithParams,
} from './routeNode';
import {
  RawParams,
  RouteMiddleware,
  RouteOptions,
  SerializedParams,
  TemplateParserMap,
} from './types';
import {
  paramsParser,
  parseRoute,
  stringifyParams,
  stringifyRoute,
} from './utils/routeUtils';

export type ChildRouteMap<RO> = Record<
  string,
  RouteNodeWithParams<any, any, any, RO> | RouteNodeWithoutParams<any, any, RO>
>;

export type RouteFnContext<RO extends RouteOptions> = {
  previousQueryParams: SerializedParams;
  previousPath: string;
  previousOptions: Required<RO>;
  previousMiddleware: RouteMiddleware | undefined;
};

export type RouteFn<RO extends RouteOptions> = <
  T extends string,
  TPM extends TemplateParserMap<T>,
  CRM extends ChildRouteMap<RO>
>(
  templateWithQuery: T,
  args: RouteFnArgs<T, TPM, RO>,
  children?: ChildrenRouterFn<RO, CRM>
) => RouteNode<T, TPM, CRM, RO>;

export function routeFn<
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
  let params: TemplateParserMap<T>;
  if (isRouteArgsWithParams(args)) {
    params = args.params;
  }

  const parsedRoute = parseRoute(templateWithQuery, params!);
  const fullTemplate = this.previousPath + '/' + parsedRoute.pathTemplate;
  const options: Required<RO> = {
    ...this.previousOptions,
    ...args.options,
  };
  var middleware: RouteMiddleware | undefined;

  if (this.previousMiddleware) {
    if (args.middleware) {
      middleware = next => {
        return this.previousMiddleware!(args.middleware!(next));
      };
    } else {
      middleware = this.previousMiddleware;
    }
  } else {
    if (args.middleware) {
      middleware = props => args.middleware!(props);
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
  // console.log('routeFn', {
  //   fullTemplate,
  //   templateWithQuery,
  //   parsedRoute,
  //   options,
  //   args,
  //   this: this,
  // });

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

          // console.log('routePath', {
          //   templateWithQuery: templateWithQuery,
          //   parsedRoute: parsedRoute,
          //   rawParams: rawParams,
          //   pathParams: pathParams,
          //   queryParams: queryParams,
          //   path: path,
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
                  component: nextChild.component,
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
                  component: nextChild.component,
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
    fullTemplate: fullTemplate,
    templateWithQuery: templateWithQuery,
    template: parsedRoute.pathTemplate,
    children: _children ?? ({} as CRM),
    options: options,
    exact: args.exact ?? true,
    strict: args.strict ?? false,
    sensitive: args.sensitive ?? false,
    includeChildren: args.includeChildren ?? true,
    render: middleware
      ? () => middleware!(args.component)
      : () => args.component,
  } as RouteNodeBase<T, CRM, RO>;

  if (isRouteArgsWithParams(args)) {
    node.paramsMap = params!;
    node.parseParams = paramsParser(parsedRoute);
  }

  return Object.assign(fn, node);
}

export type ChildrenRouterFn<
  RO extends RouteOptions,
  CRM extends ChildRouteMap<RO>
> = (route: RouteFn<RO>) => { [K in keyof CRM]: CRM[K] };

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
