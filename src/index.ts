import { RouteFnArgs } from './routeArgs';
import {
  ChildrenRouterFn,
  ChildRouteMap,
  routeFn,
  RouteFn,
  RouteFnContext,
} from './routeFn';
import { RouteNode } from './routeNode';
import { OptionsRouterFn, RouterFn } from './router';
import { RouteOptions, TemplateParserMap } from './types';

export * from './components';
export { createRouteObjectsFromRouter } from './createRouteObjects';
export * from './hooks';
export * from './paramParser';
export { RouteElement, RouteOptions } from './types';

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
    },
    templateWithQuery,
    args,
    children
  );

const optionsRoute: OptionsRouteFn = optionsRouteFn;

export const Router: RouterFn = routes => routes(optionsRoute(undefined));

export const OptionsRouter: OptionsRouterFn = (options, routes) =>
  Object.assign(
    { defaultOptions: options },
    routes(optionsRoute(options))
  ) as any;
